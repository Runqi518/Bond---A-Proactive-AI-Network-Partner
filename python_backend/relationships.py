"""Explainable relationship analysis using the existing Bond export schema."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone

from .core import ApiError, number, object_value, text


def timestamp(value):
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
        if parsed.tzinfo is None:
            raise ValueError()
        return parsed.astimezone(timezone.utc)
    except (ValueError, AttributeError, TypeError):
        raise ApiError(400, "Dates must be ISO 8601 with a timezone.")


def validate_network(value):
    data = object_value(value)
    if data.get("version") != 1:
        raise ApiError(400, "Only Bond export version 1 is supported.")
    ids = {}
    for collection in ("people", "meetings", "commitments", "reflections", "messages"):
        rows = data.get(collection, [])
        if not isinstance(rows, list) or len(rows) > 5000:
            raise ApiError(400, "Invalid " + collection + ".")
        ids[collection] = set()
        for row in rows:
            object_value(row)
            ident = text(row.get("id"), "id", 128)
            if ident in ids[collection]:
                raise ApiError(400, "Duplicate id in " + collection + ".")
            ids[collection].add(ident)
    for person in data.get("people", []):
        text(person.get("name"), "name", 200)
        number(person.get("cadenceDays"), "cadenceDays", minimum=1, integer=True)
        timestamp(person.get("lastContactAt"))
    for collection, date_field in (("meetings", "startsAt"), ("commitments", "dueAt"),
                                   ("reflections", "createdAt"), ("messages", "createdAt")):
        for row in data.get(collection, []):
            if row.get("personId") not in ids["people"]:
                raise ApiError(400, "Unknown personId.")
            timestamp(row.get(date_field))
            for optional in ("endsAt", "completedAt"):
                if row.get(optional):
                    timestamp(row[optional])
            if collection == "meetings" and row.get("endsAt"):
                if timestamp(row["endsAt"]) < timestamp(row["startsAt"]):
                    raise ApiError(400, "Meeting ends before it starts.")
            if collection == "reflections" and row.get("meetingId"):
                matches = [m for m in data.get("meetings", []) if m["id"] == row["meetingId"]]
                if not matches or matches[0]["personId"] != row["personId"]:
                    raise ApiError(400, "Reflection meeting does not belong to person.")
    for decision in object_value(data.get("decisions", {})).values():
        object_value(decision)
        for key in ("completedAt", "dismissedUntil"):
            if decision.get(key):
                timestamp(decision[key])
    return data


def analyze(data, now=None):
    data = validate_network(data)
    now = timestamp(now) if now else datetime.now(timezone.utc)
    candidates = []
    for person in data.get("people", []):
        pid = person["id"]
        def add(ident, kind, score, title, reason, event=None):
            item = dict(id=ident, kind=kind, personId=pid, score=score,
                        title=title, reason=reason)
            if event:
                item["eventAt"] = event
            decision = data.get("decisions", {}).get(ident, {})
            if decision.get("completedAt"):
                return
            if decision.get("dismissedUntil") and timestamp(decision["dismissedUntil"]) > now:
                return
            candidates.append(item)

        for promise in data.get("commitments", []):
            if promise["personId"] != pid or promise.get("completedAt"):
                continue
            days = (timestamp(promise["dueAt"]) - now).total_seconds() / 86400
            if days <= 7:
                add("commitment:" + promise["id"], "commitment",
                    110 if days < 0 else 95 - max(0, days), promise.get("text", ""),
                    "A promise is past its planned date." if days < 0 else "You promised to follow up.",
                    promise["dueAt"])
        for meeting in data.get("meetings", []):
            if meeting["personId"] != pid:
                continue
            start = timestamp(meeting["startsAt"])
            hours = (start - now).total_seconds() / 3600
            if 0 < hours <= 48:
                add("meeting:" + meeting["id"], "meeting", 102 - hours / 48,
                    meeting.get("topic", ""), "Meeting starts within 48 hours.", meeting["startsAt"])
            end = timestamp(meeting["endsAt"]) if meeting.get("endsAt") else start + timedelta(hours=1)
            elapsed = (now - end).total_seconds() / 3600
            reflected = any(r.get("meetingId") == meeting["id"] for r in data.get("reflections", []))
            if 0 <= elapsed <= 36 and not reflected:
                add("reflection:" + meeting["id"], "reflection", 72 - elapsed / 36,
                    "Capture what mattered while it is fresh", meeting.get("topic", ""))
        idle = int((now - timestamp(person["lastContactAt"])).total_seconds() // 86400)
        cadence = person["cadenceDays"]
        if idle >= cadence:
            add("reconnect:" + pid + ":" + person["lastContactAt"], "reconnect",
                45 + min(15, idle - cadence), person.get("goal") or "Reconnect with " + person["name"],
                "Last connected %d days ago; cadence is %d days." % (idle, cadence))
    candidates.sort(key=lambda x: (-x["score"], x["personId"]))
    seen, selected = set(), []
    for candidate in candidates:
        if candidate["personId"] not in seen:
            selected.append(candidate)
            seen.add(candidate["personId"])
    return {"opportunities": selected, "summary": {
        "people": len(data.get("people", [])),
        "openCommitments": sum(not x.get("completedAt") for x in data.get("commitments", [])),
        "actionablePeople": len(selected),
    }}
