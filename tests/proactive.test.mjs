import { test } from 'node:test';
import assert from 'node:assert/strict';
import { opportunities } from '../src/lib/proactive.ts';
import { seedData } from '../src/lib/model.ts';
const now = new Date('2026-10-08T12:00:00Z');
const fresh = () => ({ ...seedData(now), meetings: [], commitments: [], decisions: {} });
test('meeting reflection waits until the meeting ends', () => {
  const data = fresh();
  data.meetings = [{ id: 'meeting', personId: 'maya', topic: 'Coffee', place: 'Cafe', startsAt: '2026-10-08T11:30:00Z', endsAt: '2026-10-08T12:30:00Z' }];
  assert.ok(!opportunities(data, now).some(x => x.kind === 'reflection'));
  assert.ok(opportunities(data, new Date('2026-10-08T13:00:00Z')).some(x => x.kind === 'reflection'));
  data.reflections = [{ id: 'r', personId: 'maya', meetingId: 'meeting', createdAt: now.toISOString(), notes: 'Met', nextStep: '' }];
  assert.ok(!opportunities(data, new Date('2026-10-08T13:00:00Z')).some(x => x.kind === 'reflection'));
});
test('completed reconnection does not suppress the next cadence cycle', () => {
  const data = fresh(); const first = opportunities(data, now).find(x => x.kind === 'reconnect');
  assert.ok(first); data.decisions[first.id] = { completedAt: now.toISOString() };
  data.people = data.people.map(x => x.id === first.personId ? { ...x, lastContactAt: now.toISOString() } : x);
  assert.ok(!opportunities(data, now).some(x => x.personId === first.personId));
  const later = opportunities(data, new Date(now.getTime() + 46 * 86400000)).find(x => x.personId === first.personId);
  assert.equal(later.kind, 'reconnect'); assert.notEqual(later.id, first.id);
});
test('ranking picks one action per person and honors snooze deadlines', () => {
  const data = fresh(); data.commitments = [{ id: 'c', personId: 'elena', text: 'Send article', dueAt: now.toISOString() }];
  let cards = opportunities(data, now); assert.equal(cards.filter(x => x.personId === 'elena').length, 1); assert.equal(cards[0].kind, 'commitment');
  data.decisions['commitment:c'] = { dismissedUntil: '2026-10-09T12:00:00Z' };
  cards = opportunities(data, now); assert.ok(!cards.some(x => x.id === 'commitment:c'));
  assert.ok(opportunities(data, new Date('2026-10-09T13:00:00Z')).some(x => x.id === 'commitment:c'));
});
