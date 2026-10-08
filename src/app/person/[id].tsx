import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, ImageBackground, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Icon, palette } from '../../components/ui';
import { shareText } from '../../lib/share';
import { coachingReply } from '../../lib/ai';
import { useBond } from '../../lib/store';
import { formatWhen } from '../../lib/proactive';

const backgrounds = {
  maya: require('../../../assets/chat-maya.png'), marcus: require('../../../assets/chat-marcus.png'),
  elena: require('../../../assets/chat-elena.png'), sarah: require('../../../assets/chat-sarah.png'),
};

export default function PersonChat() {
  const { id, mode: routeMode } = useLocalSearchParams<{ id: string; mode?: string }>();
  const { data, update } = useBond();
  const person = data.people.find(x => x.id === id);
  const [mode, setMode] = useState(routeMode || 'chat');
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [draftOpen, setDraftOpen] = useState(false);
  const [draftText, setDraftText] = useState('');
  const [draftNotice, setDraftNotice] = useState('');
  const [contextOpen, setContextOpen] = useState(false);
  const [edit, setEdit] = useState({ name: person?.name || '', role: person?.role || '', how: person?.how || '', about: person?.about || '', goal: person?.goal || '', cadenceDays: String(person?.cadenceDays || 30) });
  const meeting = data.meetings.filter(x => x.personId === id && new Date(x.startsAt) > new Date()).sort((a, b) => a.startsAt.localeCompare(b.startsAt))[0];
  const messages = useMemo(() => data.messages.filter(x => x.personId === id), [data.messages, id]);
  if (!person) return <SafeAreaView style={styles.missing}><Text>Person not found.</Text><Pressable onPress={() => router.replace('/people')}><Text>Back to People</Text></Pressable></SafeAreaView>;
  const background = backgrounds[id as keyof typeof backgrounds] || backgrounds.maya;

  const send = async () => {
    const trimmed = input.trim(); if (!trimmed || sending) return;
    if (trimmed.length > 4000) { setError('Keep your message under 4,000 characters.'); return; }
    setSending(true); setError('');
    try {
      const reply = await coachingReply(person, messages, mode, trimmed, { meeting: meeting ? `${meeting.topic} · ${meeting.startsAt} · ${meeting.place}` : '', commitment: data.commitments.filter(x => x.personId === person.id && !x.completedAt).map(x => x.text).join('; ') });
      const now = new Date().toISOString();
      update(current => ({ ...current, messages: [...current.messages,
        { id: `me-${Date.now()}`, personId: person.id, by: 'me', text: trimmed, createdAt: now, mode },
        { id: `cue-${Date.now()}`, personId: person.id, by: 'agent', text: reply.text, createdAt: now, mode, source: reply.source }],
      }));
      setInput('');
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Could not send. Try again.'); }
    finally { setSending(false); }
  };
  const shareDraft = () => {
    const latest = [...messages].reverse().find(x => x.by === 'agent' && x.mode === 'draft');
    if (latest) { setDraftText(latest.text); setDraftNotice(''); setDraftOpen(true); } else Alert.alert('Write a draft first', 'Your message will be shared only when you choose where to send it.');
  };
  const deletePerson = () => {
    const remove = () => { update(current => ({ ...current, people: current.people.filter(x => x.id !== person.id), meetings: current.meetings.filter(x => x.personId !== person.id), commitments: current.commitments.filter(x => x.personId !== person.id), reflections: current.reflections.filter(x => x.personId !== person.id), messages: current.messages.filter(x => x.personId !== person.id) })); router.replace('/people'); };
    if (Platform.OS === 'web') { if (window.confirm(`Remove ${person.name} and their saved notes?`)) remove(); }
    else Alert.alert('Remove connection?', 'Their meetings, follow-ups, notes and practice history will be removed from this device.', [{ text: 'Keep', style: 'cancel' }, { text: 'Remove', style: 'destructive', onPress: remove }]);
  };
  const saveContext = () => {
    update(current => ({ ...current, people: current.people.map(x => x.id === person.id ? { ...x, name: edit.name.trim() || x.name, role: edit.role.trim(), how: edit.how.trim(), about: edit.about.trim(), goal: edit.goal.trim(), cadenceDays: Math.max(7, Math.min(365, Number(edit.cadenceDays) || 30)) } : x) }));
    setContextOpen(false);
  };

  return <SafeAreaView style={{ flex: 1, backgroundColor: '#242523' }} edges={['top', 'bottom']}><ImageBackground source={background} resizeMode="cover" style={{ flex: 1 }}><LinearGradient colors={['#151714a8', '#1517142a', '#151714af']} style={{ flex: 1 }}>
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.head}><Pressable onPress={() => router.back()} style={styles.circle}><Icon name="chevron-back" color="#fff" /></Pressable><View style={styles.identity}><Text style={styles.name}>{person.name}</Text><Text style={styles.role}>{person.role}</Text></View><Pressable onPress={() => { setEdit({ name: person.name, role: person.role, how: person.how, about: person.about, goal: person.goal, cadenceDays: String(person.cadenceDays) }); setContextOpen(true); }} style={styles.circle}><Icon name="document-text-outline" color="#fff" /></Pressable></View>
      <View style={styles.context}><View style={styles.contextTop}><Avatar person={person} size={39} /><View style={{ flex: 1 }}><Text style={styles.contextName}>{person.name}</Text><Text style={styles.contextWhen}>{meeting ? `${formatWhen(meeting.startsAt)} · ${meeting.place}` : person.how}</Text></View></View><Pressable onPress={() => router.push({ pathname: '/agenda', params: { personId: person.id } })}><Text style={[styles.contextWhen, { color: palette.blueInk, paddingTop: 9 }]}>Meetings & follow-ups →</Text></Pressable><Text style={styles.contextGoal}><Text style={{ fontWeight: '800' }}>Primary goal: </Text>{person.goal || 'Get to know each other'}</Text></View>
      <View style={styles.modePill}><Text style={styles.modeText}>{mode === 'draft' ? 'DRAFT A REAL MESSAGE' : mode === 'rehearse' ? 'REHEARSAL · PRIVATE PRACTICE' : 'BOND AI · PRIVATE PRACTICE'}</Text></View>
      <ScrollView style={styles.messages} contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 15, paddingBottom: 22 }} keyboardShouldPersistTaps="handled">
        {messages.map(message => <View key={message.id} style={[styles.messageWrap, message.by === 'me' && { alignItems: 'flex-end' }]}><Text style={styles.messageLabel}>{message.by === 'me' ? 'You' : message.source === 'ai' ? 'BOND AI · private coaching' : 'BOND · local coaching'}</Text><View style={[styles.bubble, message.by === 'me' && styles.myBubble]}><Text style={styles.bubbleText}>{message.text}</Text></View></View>)}
        {mode === 'rehearse' && <View style={styles.cues}><Text style={styles.cuesTitle}>A natural opening</Text><Text style={styles.cuesCopy}>Practice asking about recent work or a shared interest.</Text><View style={styles.cueButtons}><Pressable onPress={() => setInput(`What has been most interesting in your work lately?`)} style={styles.cueButton}><Text style={styles.cueButtonText}>Recent work</Text></Pressable><Pressable onPress={() => setInput(`I was thinking about ${person.goal || 'our last conversation'}. What is your perspective?`)} style={styles.cueButton}><Text style={styles.cueButtonText}>Shared interest</Text></Pressable></View></View>}
      </ScrollView>
      <View style={styles.composer}>{!!error && <Text accessibilityLiveRegion="polite" style={{ color: '#9c3e51', padding: 8, fontSize: 12 }}>{error}</Text>}{sending && <Text style={{ padding: 8, fontSize: 12 }}>Preparing a thoughtful response…</Text>}{mode === 'draft' && <Pressable onPress={shareDraft} style={styles.share}><Icon name="share-outline" color={palette.ink} size={20} /><Text style={styles.shareText}>Share draft</Text></Pressable>}<View style={styles.composeRow}><Pressable onPress={() => setMode(mode === 'rehearse' ? 'chat' : 'rehearse')} style={[styles.rehearse, mode === 'rehearse' && styles.rehearseOn]}><Text style={styles.rehearseText}>✦ Rehearse</Text></Pressable><TextInput editable={!sending} value={input} onChangeText={setInput} placeholder={mode === 'draft' ? 'Write a real message…' : 'Type a message…'} placeholderTextColor="#6d7688" style={styles.input} multiline /><Pressable onPress={send} disabled={sending} accessibilityLabel="Send practice message" style={styles.send}><Icon name="arrow-up" color="#fff" size={20} /></Pressable></View></View>
    </KeyboardAvoidingView>
  </LinearGradient></ImageBackground>
  <Modal visible={draftOpen} animationType="slide" transparent onRequestClose={() => setDraftOpen(false)}><View style={styles.modalShade}><View style={styles.modal}><View style={styles.modalHead}><Text style={styles.modalTitle}>Review your draft</Text><Pressable accessibilityLabel="Close draft" onPress={() => setDraftOpen(false)}><Icon name="close" /></Pressable></View><Text style={styles.modalIntro}>Edit before sharing. You choose the recipient and send the message yourself.</Text><TextInput accessibilityLabel="Draft message" value={draftText} onChangeText={setDraftText} multiline style={[styles.fieldInput, { minHeight: 160, maxHeight: 300 }]} /><Pressable disabled={!draftText.trim()} onPress={async () => { try { setDraftNotice(await shareText(draftText.trim())); } catch (failure) { setDraftNotice(failure instanceof Error ? failure.message : 'Could not share.'); } }} style={styles.save}><Text style={styles.saveText}>{Platform.OS === 'web' ? 'Share / copy draft' : 'Choose where to share'}</Text></Pressable><Text accessibilityLiveRegion="polite" style={styles.modalIntro}>{draftNotice}</Text></View></View></Modal>
  <Modal visible={contextOpen} animationType="slide" transparent onRequestClose={() => setContextOpen(false)}><View style={styles.modalShade}><View style={styles.modal}><View style={styles.modalHead}><Text style={styles.modalTitle}>{person.name}</Text><Pressable onPress={() => setContextOpen(false)}><Icon name="close" /></Pressable></View><Text style={styles.modalIntro}>Edit the context Bond uses for private practice and nudges.</Text><ScrollView style={{ maxHeight: 460 }} keyboardShouldPersistTaps="handled">{([['Name', 'name'], ['Role / connection', 'role'], ['How you know them', 'how'], ['What you know', 'about'], ['Relationship goal', 'goal'], ['Cadence in days', 'cadenceDays']] as const).map(([label, key]) => <View key={key} style={styles.field}><Text style={styles.fieldLabel}>{label}</Text><TextInput value={edit[key]} onChangeText={value => setEdit(current => ({ ...current, [key]: value }))} style={[styles.fieldInput, key === 'about' && { minHeight: 74 }]} multiline={key === 'about'} keyboardType={key === 'cadenceDays' ? 'number-pad' : 'default'} /></View>)}</ScrollView><Pressable onPress={saveContext} style={styles.save}><Text style={styles.saveText}>Save context</Text></Pressable><Pressable onPress={() => { setContextOpen(false); router.push({ pathname: '/reflect', params: { personId: person.id } }); }} style={styles.reflect}><Text style={styles.reflectText}>Reflect on a meeting →</Text></Pressable><Pressable onPress={deletePerson} style={styles.reflect}><Text style={{ color: '#9c3e51', fontSize: 12 }}>Remove connection</Text></Pressable></View></View></Modal>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  missing: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  head: { height: 72, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }, circle: { width: 39, height: 39, borderRadius: 20, backgroundColor: '#ffffff42', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#ffffff66' }, identity: { flex: 1, alignItems: 'center' }, name: { color: '#fff', fontSize: 19, fontWeight: '800' }, role: { color: '#fff', opacity: .8, fontSize: 11, marginTop: 2 },
  context: { marginHorizontal: 17, padding: 14, backgroundColor: '#ffffffb8', borderWidth: 1, borderColor: '#ffffffb8', borderRadius: 20 }, contextTop: { flexDirection: 'row', alignItems: 'center', gap: 9 }, contextName: { fontSize: 14, color: palette.ink, fontWeight: '800' }, contextWhen: { fontSize: 11, color: '#4d5869', marginTop: 2 }, contextGoal: { color: palette.ink, fontSize: 12, lineHeight: 17, marginTop: 9 },
  modePill: { alignSelf: 'flex-start', marginLeft: 18, marginTop: 13, backgroundColor: '#14171de0', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 5 }, modeText: { color: '#ffe36d', fontSize: 9, fontWeight: '800', letterSpacing: .7 },
  messages: { flex: 1 }, messageWrap: { marginBottom: 15, alignItems: 'flex-start' }, messageLabel: { color: '#fff', fontSize: 10, marginBottom: 5, fontWeight: '700' }, bubble: { maxWidth: '88%', backgroundColor: '#ffffffeb', borderRadius: 17, borderTopLeftRadius: 4, paddingHorizontal: 15, paddingVertical: 12 }, myBubble: { backgroundColor: '#ffe783e8', borderTopLeftRadius: 17, borderTopRightRadius: 4 }, bubbleText: { color: palette.ink, fontSize: 14, lineHeight: 20 },
  cues: { backgroundColor: '#fffffff0', borderRadius: 17, padding: 15, alignSelf: 'flex-start', maxWidth: '91%' }, cuesTitle: { color: palette.ink, fontSize: 13, fontWeight: '800' }, cuesCopy: { color: '#4c586c', fontSize: 12, marginTop: 5, lineHeight: 17 }, cueButtons: { flexDirection: 'row', gap: 7, marginTop: 10 }, cueButton: { borderColor: '#dddfe2', borderWidth: 1, borderRadius: 17, paddingHorizontal: 10, paddingVertical: 7 }, cueButtonText: { color: palette.ink, fontSize: 10, fontWeight: '700' },
  composer: { padding: 10, paddingBottom: 12, backgroundColor: '#fffffff0', borderTopLeftRadius: 23, borderTopRightRadius: 23 }, composeRow: { flexDirection: 'row', alignItems: 'center', gap: 7 }, rehearse: { backgroundColor: '#24272e', borderRadius: 22, paddingHorizontal: 11, paddingVertical: 11 }, rehearseOn: { backgroundColor: '#131417' }, rehearseText: { color: '#fff', fontSize: 11, fontWeight: '700' }, input: { flex: 1, minHeight: 37, maxHeight: 90, color: palette.ink, fontSize: 12 }, send: { width: 34, height: 34, backgroundColor: '#16191f', borderRadius: 17, alignItems: 'center', justifyContent: 'center' }, share: { flexDirection: 'row', alignSelf: 'flex-end', alignItems: 'center', gap: 5, paddingBottom: 7 }, shareText: { color: palette.ink, fontSize: 11, fontWeight: '700' },
  modalShade: { flex: 1, backgroundColor: '#11192788', justifyContent: 'flex-end' }, modal: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 20, paddingTop: 18, paddingBottom: 28 }, modalHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, modalTitle: { color: palette.ink, fontSize: 23, fontWeight: '800' }, modalIntro: { color: '#64738b', fontSize: 12, marginTop: 5, marginBottom: 12 }, field: { marginBottom: 13 }, fieldLabel: { color: palette.ink, fontSize: 11, fontWeight: '700', marginBottom: 5 }, fieldInput: { borderWidth: 1, borderColor: '#dfe6ec', borderRadius: 12, paddingHorizontal: 11, paddingVertical: 9, fontSize: 13, color: palette.ink }, save: { backgroundColor: '#191d24', borderRadius: 23, padding: 14, alignItems: 'center', marginTop: 7 }, saveText: { color: '#fff', fontWeight: '800' }, reflect: { alignItems: 'center', paddingTop: 12 }, reflectText: { color: palette.blueInk, fontSize: 12, fontWeight: '700' },
});
