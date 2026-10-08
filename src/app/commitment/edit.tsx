import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text } from 'react-native';
import { Page } from '../../components/ui';
import { DateField, Field, FormHeader, PersonSelect, formStyles as s } from '../../components/forms';
import { useBond } from '../../lib/store';

export default function CommitmentEdit() {
  const params = useLocalSearchParams<{ id?: string; personId?: string }>();
  const { data, update } = useBond();
  const existing = data.commitments.find(x => x.id === params.id);
  const [personId, setPersonId] = useState(existing?.personId || params.personId || data.people[0]?.id || '');
  const [text, setText] = useState(existing?.text || '');
  const [dueAt, setDueAt] = useState(() => existing ? new Date(existing.dueAt) : new Date(Date.now() + 3 * 86400000));
  const save = () => {
    if (!data.people.some(x => x.id === personId) || !text.trim()) { Alert.alert('Add a next step', 'Choose a person and describe your commitment.'); return; }
    const commitment = { ...existing, id: existing?.id || `promise-${Date.now()}`, personId, text: text.trim(), dueAt: dueAt.toISOString() };
    update(current => { const decisions = { ...current.decisions }; delete decisions[`commitment:${commitment.id}`]; return { ...current, commitments: existing ? current.commitments.map(x => x.id === commitment.id ? commitment : x) : [...current.commitments, commitment], decisions }; });
    router.back();
  };
  return <Page><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><FormHeader title={existing ? 'Edit follow-up' : 'Add a follow-up'} /><ScrollView contentContainerStyle={s.body} keyboardShouldPersistTaps="handled"><PersonSelect people={data.people} value={personId} onChange={setPersonId} /><Field label="Your commitment *" value={text} onChange={setText} multiline /><DateField label="Due" value={dueAt} onChange={setDueAt} /><Text style={s.helper}>A reminder helps you keep your promise. Mark it done after taking the real action.</Text><Pressable onPress={save} style={s.save}><Text style={s.saveText}>Save follow-up</Text></Pressable></ScrollView></KeyboardAvoidingView></Page>;
}
