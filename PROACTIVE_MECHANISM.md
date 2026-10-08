# Bond proactive mechanism

## Product principle

Bond should turn relationship context into one small, timely action. Each suggestion answers three questions: **why now**, **what to do**, and **how to start**. The user always decides whether to contact someone.

## Signal → action loop

| Signal | Trigger | Action |
| --- | --- | --- |
| Upcoming meeting | Starts within 48 hours | Rehearse a natural opener and review the relationship goal |
| Promise or next step | Due within 7 days, or overdue | Draft a specific follow-up; user sends it outside Bond |
| Recent meeting | Ended within 36 hours, with no reflection | Save what happened and a next step |
| Relationship cadence | Days since last real contact exceed a per-person target | Reconnect around a real shared topic |

The current implementation uses facts that the user explicitly saved in Bond. It does not infer that an AI practice message is a real interaction.

## Ranking and feedback

1. Overdue promises rank highest; then imminent meetings, upcoming promises, post-meeting reflections, and reconnection.
2. Bond shows one card per person at a time and initially shows the top two cards on Today.
3. Dismissing a card snoozes it for one day, or seven days for a reconnection. Completing a promise or reconnection updates the last real contact date.
4. If notifications are enabled, Bond schedules each new opportunity once in the next two weeks at 9:00 local time, with at most two notifications on a day. The lock-screen wording does not reveal contact details.
5. The user can edit each person's goal and cadence and disable notifications at any time.

## Next phase for a truly intelligent network partner

With explicit opt in, calendar events could suggest meeting preparation and post-meeting reflection. Apple requires full calendar access to read events; requesting it should happen only when the user enables that source. The connected AI service already drafts messages. A future extension could extract possible promises from reflections, but every extracted fact should be shown for user confirmation before it affects reminders. A later matching feature could propose introductions between two contacts only after the user confirms both sides' relevance and consents to sharing their information. The first measurable outcome should be real conversations and fulfilled commitments, rather than time spent chatting with the app.

## Implemented flow updates

Meeting creation/editing now records a start and end time. Reflection triggers after the end (old records assume a one-hour meeting). Cancelling a meeting removes its future opportunities. A completed reconnection is tied to the last-contact timestamp so the next cadence cycle remains eligible. Follow-ups can be edited, completed, reopened or removed independently of reflections.

Notification scheduling remembers opportunities whose notification time has passed, avoiding repeat scheduling of the same action after app reopening. It plans up to two per day for fourteen days and refreshes on foreground/data changes. The app does not run an always-on cloud scheduler.

The optional AI service supports contextual coaching, hypothetical rehearsal and editable drafts. The deterministic rules choose when to suggest an action; AI helps the user decide what to say. External calendar signals, live contact enrichment and shared introductions are not connected.
