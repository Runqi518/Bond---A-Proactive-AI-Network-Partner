export type Tone = 'blue' | 'yellow' | 'green' | 'pink';

export type Person = {
  id: string;
  name: string;
  role: string;
  how: string;
  about: string;
  goal: string;
  tags: string[];
  tone: Tone;
  cadenceDays: number;
  lastContactAt: string;
};

export type Meeting = {
  id: string;
  personId: string;
  startsAt: string;
  endsAt?: string;
  place: string;
  topic: string;
};

export type Commitment = {
  id: string;
  personId: string;
  text: string;
  dueAt: string;
  completedAt?: string;
};

export type Reflection = {
  id: string;
  personId: string;
  meetingId?: string;
  createdAt: string;
  notes: string;
  nextStep: string;
};

export type Message = { id: string; personId: string; by: 'me' | 'agent'; text: string; createdAt: string; mode?: string; source?: 'local' | 'ai' };
export type Decision = { dismissedUntil?: string; completedAt?: string };

export type BondData = {
  version: 1;
  initialized?: boolean;
  people: Person[];
  meetings: Meeting[];
  commitments: Commitment[];
  reflections: Reflection[];
  messages: Message[];
  decisions: Record<string, Decision>;
  notificationsEnabled: boolean;
};

const at = (base: Date, days: number, hour = 10, minute = 30) => {
  const result = new Date(base);
  result.setDate(result.getDate() + days);
  result.setHours(hour, minute, 0, 0);
  return result.toISOString();
};

export function seedData(now = new Date()): BondData {
  const people: Person[] = [
    { id: 'maya', name: 'Maya Chen', role: 'ex-Stripe Product Lead', how: 'Met through a product community', about: 'Product leader exploring advisory work and thoughtful partnerships.', goal: 'Explore an advisory relationship and product strategy.', tags: ['Advisory', 'Coffee'], tone: 'blue', cadenceDays: 30, lastContactAt: at(now, -13) },
    { id: 'marcus', name: 'Marcus Vance', role: 'Climate Tech Angel Investor', how: 'Met at a climate technology dinner', about: 'Angel investor focused on climate technology and disciplined execution.', goal: 'Continue the discussion and share a focused reading list.', tags: ['Investor', 'Follow up'], tone: 'yellow', cadenceDays: 30, lastContactAt: at(now, -1) },
    { id: 'elena', name: 'Elena Rostova', role: 'Cognitive Systems Scientist', how: 'Met through an AI research community', about: 'Researcher exploring privacy and on-device agent models.', goal: 'Reconnect and compare ideas about agent memory.', tags: ['Research', 'Reconnect'], tone: 'green', cadenceDays: 45, lastContactAt: at(now, -62) },
    { id: 'sarah', name: 'Sarah Lin', role: 'Lead Design Engineer', how: 'Connected through a design systems workshop', about: 'Design engineer interested in interaction details and tactile products.', goal: 'Align on interaction direction.', tags: ['Design', 'Sync'], tone: 'pink', cadenceDays: 30, lastContactAt: at(now, -8) },
  ];
  return {
    version: 1,
    people,
    meetings: [
      { id: 'meet-maya', personId: 'maya', startsAt: at(now, 1), place: 'Blue Bottle Mint Plaza', topic: 'Coffee catch-up · Partnership discussion' },
      { id: 'meet-marcus', personId: 'marcus', startsAt: at(now, -1, 19, 30), place: 'The Bar Room', topic: 'Dinner conversation' },
      { id: 'meet-sarah', personId: 'sarah', startsAt: at(now, 4, 15), place: 'Studio 4', topic: 'Design sync' },
    ],
    commitments: [{ id: 'promise-marcus', personId: 'marcus', text: 'Send reading list on decentralized governance', dueAt: at(now, 0, 18) }],
    reflections: [],
    messages: people.map((person, index) => ({ id: `intro-${person.id}`, personId: person.id, by: 'agent' as const, text: [
      'Your coffee with Maya is coming up. Want to practice a natural opening?',
      'You promised Marcus a reading list. Let’s make the follow-up concise and useful.',
      'It has been a while since you spoke with Elena. What would you like to share?',
      'Your next design conversation can start with one concrete interaction.',
    ][index], createdAt: now.toISOString() })),
    decisions: {},
    notificationsEnabled: false,
  };
}
