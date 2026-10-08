import { BondData, Person } from './model';

export type OpportunityKind = 'commitment' | 'meeting' | 'reflection' | 'reconnect';
export type Opportunity = {
  id: string;
  kind: OpportunityKind;
  personId: string;
  label: string;
  title: string;
  reason: string;
  action: string;
  score: number;
  eventAt?: string;
};

const DAY = 86_400_000;
const dayDistance = (later: string | Date, earlier: string | Date) => (new Date(later).getTime() - new Date(earlier).getTime()) / DAY;

/** Deterministic ranking keeps the source of each suggestion visible to the user. */
export function opportunities(data: BondData, now = new Date()): Opportunity[] {
  const candidates: Opportunity[] = [];
  for (const person of data.people) {
    addCommitments(person, data, now, candidates);
    addMeetings(person, data, now, candidates);
    addReflection(person, data, now, candidates);
    addReconnect(person, now, candidates);
  }
  const eligible = candidates.filter(item => {
    const decision = data.decisions[item.id];
    return !decision?.completedAt && (!decision?.dismissedUntil || new Date(decision.dismissedUntil) <= now);
  });
  eligible.sort((a, b) => b.score - a.score || a.personId.localeCompare(b.personId));
  const seen = new Set<string>();
  return eligible.filter(item => {
    if (seen.has(item.personId)) return false;
    seen.add(item.personId);
    return true;
  });
}

function addCommitments(person: Person, data: BondData, now: Date, items: Opportunity[]) {
  for (const promise of data.commitments.filter(x => x.personId === person.id && !x.completedAt)) {
    const days = dayDistance(promise.dueAt, now);
    if (days > 7) continue;
    items.push({ id: `commitment:${promise.id}`, kind: 'commitment', personId: person.id,
      label: days < 0 ? 'OVERDUE · COMMITMENT' : 'TO FOLLOW UP · COMMITMENT', title: promise.text,
      reason: days < 0 ? 'A promise is past its planned date.' : 'You promised to follow up.',
      action: 'Draft message', score: days < 0 ? 110 : 95 - Math.max(0, days), eventAt: promise.dueAt });
  }
}

function addMeetings(person: Person, data: BondData, now: Date, items: Opportunity[]) {
  for (const meeting of data.meetings.filter(x => x.personId === person.id)) {
    const hours = dayDistance(meeting.startsAt, now) * 24;
    if (hours <= 0 || hours > 48) continue;
    items.push({ id: `meeting:${meeting.id}`, kind: 'meeting', personId: person.id,
      label: 'HAPPENING SOON · NEXT 48H', title: meeting.topic,
      reason: `${formatWhen(meeting.startsAt)} · ${meeting.place}`, action: 'Prepare rehearsal',
      score: 102 - hours / 48, eventAt: meeting.startsAt });
  }
}

function addReflection(person: Person, data: BondData, now: Date, items: Opportunity[]) {
  for (const meeting of data.meetings.filter(x => x.personId === person.id)) {
    const hours = -dayDistance(meeting.startsAt, now) * 24;
    if (hours < 0 || hours > 36 || data.reflections.some(x => x.meetingId === meeting.id)) continue;
    items.push({ id: `reflection:${meeting.id}`, kind: 'reflection', personId: person.id,
      label: 'AFTER THE MEETING', title: 'Capture what mattered while it is fresh',
      reason: `${meeting.topic} · ${formatWhen(meeting.startsAt)}`, action: 'Reflect now', score: 72 - hours / 36 });
  }
}

function addReconnect(person: Person, now: Date, items: Opportunity[]) {
  const idleDays = Math.floor(dayDistance(now, person.lastContactAt));
  if (idleDays < person.cadenceDays) return;
  items.push({ id: `reconnect:${person.id}`, kind: 'reconnect', personId: person.id,
    label: `CADENCE · ${idleDays}D IDLE`, title: person.goal || `Reconnect with ${person.name}`,
    reason: `Last connected ${idleDays} days ago · your cadence is ${person.cadenceDays} days.`,
    action: 'Reconnect', score: 45 + Math.min(15, idleDays - person.cadenceDays) });
}

export function formatWhen(value: string) {
  return new Date(value).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export function nextReminderTime(now = new Date()) {
  const next = new Date(now);
  next.setHours(9, 0, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  return next;
}
