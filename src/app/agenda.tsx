import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { Page, palette } from '../components/ui';
import { FormHeader, formStyles as s } from '../components/forms';
import { useBond } from '../lib/store';
import { formatWhen } from '../lib/proactive';

export default function Agenda() {
  const { personId } = useLocalSearchParams<{ personId?: string }>();
  const { data, update } = useBond();
  const [history, setHistory] = useState(false);
  const meetings = data.meetings.filter(x => !personId || x.personId === personId).filter(x => history || new Date(x.endsAt || x.startsAt) >= new Date()).sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const commitments = data.commitments.filter(x => !personId || x.personId === personId).filter(x => history || !x.completedAt).sort((a, b) => a.dueAt.localeCompare(b.dueAt));
  const personName = (id: string) => data.people.find(x => x.id === id)?.name || 'Connection';
  const removeMeeting = (id: string) => {
    const remove = () => update(current => ({ ...current, meetings: current.meetings.filter(x => x.id !== id) }));
    if (Platform.OS === 'web') { if (window.confirm('Cancel this meeting and its reminders?')) remove(); }
    else Alert.alert('Cancel this meeting?', 'Its reminders will be removed. Your reflections are kept.', [{ text: 'Keep', style: 'cancel' }, { text: 'Cancel meeting', style: 'destructive', onPress: remove }]);
  };
  const toggleDone = (id: string) => update(current => {
    const promise = current.commitments.find(x => x.id === id)!;
    const completedAt = promise.completedAt ? undefined : new Date().toISOString();
    const decisions = { ...current.decisions }; delete decisions[`commitment:${id}`];
    return { ...current, decisions, commitments: current.commitments.map(x => x.id === id ? { ...x, completedAt } : x), people: completedAt ? current.people.map(x => x.id === promise.personId ? { ...x, lastContactAt: completedAt } : x) : current.people };
  });
  const linkStyle = { color: palette.blueInk, fontWeight: '700' as const, fontSize: 12, paddingVertical: 9 };
  const cardStyle = { backgroundColor: '#fff', borderRadius: 22, padding: 18, marginBottom: 12 };
  return <Page><FormHeader title="Meetings & follow-ups" /><ScrollView contentContainerStyle={s.body}>
    <View style={{ flexDirection: 'row', gap: 14, marginBottom: 20 }}><Pressable onPress={() => router.push({ pathname: '/meeting/edit', params: { personId } })}><Text style={linkStyle}>＋ Meeting</Text></Pressable><Pressable onPress={() => router.push({ pathname: '/commitment/edit', params: { personId } })}><Text style={linkStyle}>＋ Follow-up</Text></Pressable></View>
    <Text style={s.helper}>Plan a real conversation, then keep the next step small and specific.</Text>
    <Text style={[s.title, { fontSize: 18, marginBottom: 15 }]}>Meetings</Text>
    {!meetings.length && <Text style={s.helper}>No upcoming meetings. Add one to get a preparation nudge.</Text>}
    {meetings.map(meeting => <View key={meeting.id} style={cardStyle}><Text style={s.label}>{personName(meeting.personId)}</Text><Text style={{ fontSize: 16, color: palette.ink, fontWeight: '700' }}>{meeting.topic}</Text><Text style={[s.helper, { marginTop: 8 }]}>{formatWhen(meeting.startsAt)}{meeting.place ? ` · ${meeting.place}` : ''}</Text><View style={{ flexDirection: 'row', gap: 18 }}><Pressable onPress={() => router.push({ pathname: '/meeting/edit', params: { id: meeting.id } })}><Text style={linkStyle}>Edit</Text></Pressable>{new Date(meeting.endsAt || meeting.startsAt) <= new Date() && <Pressable onPress={() => router.push({ pathname: '/reflect', params: { personId: meeting.personId, meetingId: meeting.id } })}><Text style={linkStyle}>Reflect</Text></Pressable>}<Pressable onPress={() => removeMeeting(meeting.id)}><Text style={{ ...linkStyle, color: '#9c3e51' }}>Cancel</Text></Pressable></View></View>)}
    <Text style={[s.title, { fontSize: 18, marginVertical: 15 }]}>Follow-ups</Text>
    {!commitments.length && <Text style={s.helper}>No open promises. Add a follow-up or create one after a reflection.</Text>}
    {commitments.map(promise => <View key={promise.id} style={cardStyle}><Text style={s.label}>{personName(promise.personId)}</Text><Text style={{ fontSize: 16, color: palette.ink, textDecorationLine: promise.completedAt ? 'line-through' : 'none' }}>{promise.text}</Text><Text style={[s.helper, { marginTop: 8 }]}>{promise.completedAt ? 'Completed' : `Due ${formatWhen(promise.dueAt)}`}</Text><View style={{ flexDirection: 'row', gap: 18 }}><Pressable onPress={() => router.push({ pathname: '/commitment/edit', params: { id: promise.id } })}><Text style={linkStyle}>Edit</Text></Pressable><Pressable onPress={() => toggleDone(promise.id)}><Text style={linkStyle}>{promise.completedAt ? 'Reopen' : 'Mark done'}</Text></Pressable><Pressable onPress={() => update(current => ({ ...current, commitments: current.commitments.filter(x => x.id !== promise.id) }))}><Text style={{ ...linkStyle, color: '#9c3e51' }}>Remove</Text></Pressable></View></View>)}
    <Pressable onPress={() => setHistory(!history)}><Text style={linkStyle}>{history ? 'Hide past meetings & completed actions' : 'Show past meetings & completed actions'}</Text></Pressable>
  </ScrollView></Page>;
}
