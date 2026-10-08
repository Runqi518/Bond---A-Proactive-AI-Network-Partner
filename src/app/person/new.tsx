import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Icon, Page, palette } from '../../components/ui';
import { Person, Tone } from '../../lib/model';
import { useBond } from '../../lib/store';

export default function AddPerson() {
  const { data, update } = useBond();
  const [values, setValues] = useState({ name: '', role: '', how: '', about: '', goal: '', tags: '', cadenceDays: '30' });
  const field = (label: string, key: keyof typeof values, placeholder: string, multiline = false) => <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput value={values[key]} onChangeText={value => setValues(current => ({ ...current, [key]: value }))} placeholder={placeholder} placeholderTextColor="#a0aabb" style={[styles.input, multiline && { height: 92, textAlignVertical: 'top' }]} multiline={multiline} keyboardType={key === 'cadenceDays' ? 'number-pad' : 'default'} /></View>;
  const save = () => {
    const name = values.name.trim(); if (!name) return;
    const id = `person-${Date.now()}`;
    const tones: Tone[] = ['blue', 'yellow', 'green', 'pink'];
    const person: Person = { id, name, role: values.role.trim(), how: values.how.trim(), about: values.about.trim(), goal: values.goal.trim(), tags: values.tags.split(',').map(x => x.trim()).filter(Boolean).slice(0, 4), tone: tones[data.people.length % 4], cadenceDays: Math.max(7, Math.min(365, Number(values.cadenceDays) || 30)), lastContactAt: new Date().toISOString() };
    update(current => ({ ...current, people: [person, ...current.people], messages: [...current.messages, { id: `intro-${id}`, personId: id, by: 'agent', text: `Bond AI is ready to help you prepare for a conversation with ${name}. What would you like to explore?`, createdAt: new Date().toISOString() }] }));
    router.replace({ pathname: '/person/[id]', params: { id } });
  };
  return <Page background="#f8f9fa"><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><View style={styles.head}><Pressable onPress={() => router.back()} style={styles.back}><Icon name="chevron-back" /></Pressable><Text style={styles.title}>Add person</Text></View><ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled"><Text style={styles.intro}>A few details help Bond make each suggestion and private practice feel relevant.</Text>{field('Name *', 'name', 'e.g. Jordan Lee')}{field('Role / connection', 'role', 'e.g. Founder, designer, mentor')}{field('How you know them', 'how', 'e.g. Met at a design meetup')}{field('What you know', 'about', 'Their work, interests, shared topics…', true)}{field('What you want to talk about', 'goal', 'One thing you would like to explore')}{field('Tags', 'tags', 'Design, Coffee next week')}{field('Reconnect cadence in days', 'cadenceDays', '30')}<Text style={styles.helper}>You can change these details any time from the person’s chat.</Text></ScrollView><View style={styles.footer}><Pressable onPress={save} disabled={!values.name.trim()} style={[styles.save, !values.name.trim() && { opacity: .4 }]}><Text style={styles.saveText}>Start connecting →</Text></Pressable></View></KeyboardAvoidingView></Page>;
}

const styles = StyleSheet.create({
  head: { height: 65, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20 }, back: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }, title: { color: palette.ink, fontSize: 23, fontWeight: '800' },
  form: { paddingHorizontal: 20, paddingBottom: 25 }, intro: { color: '#65748c', fontSize: 13, lineHeight: 20, marginTop: 13, marginBottom: 23 }, field: { marginBottom: 16 }, label: { color: palette.ink, fontSize: 12, fontWeight: '700', marginBottom: 7 }, input: { backgroundColor: '#fff', borderRadius: 15, borderWidth: 1, borderColor: '#e4e8ec', paddingHorizontal: 13, paddingVertical: 12, color: palette.ink, fontSize: 13 }, helper: { color: palette.muted, fontSize: 11, lineHeight: 16 }, footer: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12, backgroundColor: '#fff' }, save: { backgroundColor: '#1b1e25', padding: 15, borderRadius: 25, alignItems: 'center' }, saveText: { color: '#fff', fontWeight: '800', fontSize: 14 },
});
