import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Icon, Page, palette } from '../components/ui';
import { useBond } from '../lib/store';

export default function Reflect() {
  const params = useLocalSearchParams<{ personId?: string; meetingId?: string }>();
  const { data, update } = useBond();
  const [personId, setPersonId] = useState(params.personId || data.people[0]?.id || '');
  const [notes, setNotes] = useState('');
  const [next, setNext] = useState('');
  const [dueDays, setDueDays] = useState(3);
  const save = () => {
    if (!personId || !notes.trim()) { Alert.alert('Add a note', 'Choose a person and write what you learned.'); return; }
    const createdAt = new Date().toISOString();
    const due = new Date(); due.setDate(due.getDate() + dueDays);
    update(current => ({ ...current,
      reflections: [...current.reflections, { id: `reflection-${Date.now()}`, personId, meetingId: personId === params.personId ? params.meetingId : undefined, createdAt, notes: notes.trim(), nextStep: next.trim() }],
      commitments: next.trim() ? [...current.commitments, { id: `promise-${Date.now()}`, personId, text: next.trim(), dueAt: due.toISOString() }] : current.commitments,
      people: current.people.map(x => x.id === personId ? { ...x, lastContactAt: createdAt } : x),
    }));
    router.replace('/me');
  };
  return <Page background="#f8f9fa"><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><View style={styles.head}><Pressable onPress={() => router.back()} style={styles.back}><Icon name="chevron-back" /></Pressable><Text style={styles.title}>Reflect on a meeting</Text></View><ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled"><Text style={styles.intro}>Capture the real conversation while it is fresh. Your note helps Bond suggest a thoughtful next step.</Text><Text style={styles.label}>Who did you meet?</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.people}>{data.people.map(person => <Pressable key={person.id} onPress={() => setPersonId(person.id)} style={[styles.personChoice, personId === person.id && styles.personSelected]}><Text style={[styles.personText, personId === person.id && { color: '#fff' }]}>{person.name}</Text></Pressable>)}</ScrollView><Text style={styles.label}>How did it go? *</Text><TextInput value={notes} onChangeText={setNotes} multiline placeholder="What did you learn? What felt good or hard? What did you agree to?" placeholderTextColor="#9eacba" style={styles.notes} textAlignVertical="top" /><Text style={styles.label}>Next step</Text><TextInput value={next} onChangeText={setNext} placeholder="e.g. Send the article this week" placeholderTextColor="#9eacba" style={styles.next} /><Text style={styles.label}>Remind me in</Text><View style={styles.dueChoices}>{[1, 3, 7].map(days => <Pressable key={days} onPress={() => setDueDays(days)} style={[styles.due, dueDays === days && styles.dueSelected]}><Text style={[styles.dueText, dueDays === days && { color: '#fff' }]}>{days} {days === 1 ? 'day' : 'days'}</Text></Pressable>)}</View><Text style={styles.helper}>Bond will only create a follow-up action when you enter a next step.</Text></ScrollView><View style={styles.footer}><Pressable onPress={save} style={styles.save}><Text style={styles.saveText}>Save reflection</Text></Pressable></View></KeyboardAvoidingView></Page>;
}

const styles = StyleSheet.create({
  head: { height: 65, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20 }, back: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }, title: { color: palette.ink, fontSize: 21, fontWeight: '800' },
  form: { paddingHorizontal: 20, paddingBottom: 25 }, intro: { color: '#65748c', fontSize: 13, lineHeight: 20, marginTop: 13, marginBottom: 22 }, label: { color: palette.ink, fontSize: 12, fontWeight: '700', marginBottom: 8 }, people: { gap: 7, marginBottom: 23 }, personChoice: { backgroundColor: '#fff', borderRadius: 18, paddingHorizontal: 13, paddingVertical: 10 }, personSelected: { backgroundColor: palette.ink }, personText: { color: palette.ink, fontSize: 11, fontWeight: '700' }, notes: { height: 170, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e7eb', padding: 13, color: palette.ink, fontSize: 13, marginBottom: 20 }, next: { backgroundColor: '#fff', borderRadius: 15, borderWidth: 1, borderColor: '#e2e7eb', padding: 13, color: palette.ink, fontSize: 13, marginBottom: 19 }, dueChoices: { flexDirection: 'row', gap: 7, marginBottom: 11 }, due: { backgroundColor: '#fff', borderRadius: 17, paddingHorizontal: 17, paddingVertical: 9 }, dueSelected: { backgroundColor: palette.ink }, dueText: { color: palette.ink, fontWeight: '700', fontSize: 11 }, helper: { color: palette.muted, fontSize: 11, lineHeight: 16 }, footer: { backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12 }, save: { backgroundColor: '#1b1e25', borderRadius: 25, padding: 15, alignItems: 'center' }, saveText: { color: '#fff', fontWeight: '800', fontSize: 14 },
});
