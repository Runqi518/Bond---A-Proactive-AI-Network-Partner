import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text } from 'react-native';
import { Page } from '../../components/ui';
import { DateField, Field, FormHeader, PersonSelect, formStyles as s } from '../../components/forms';
import { useBond } from '../../lib/store';

export default function MeetingEdit() {
  const params = useLocalSearchParams<{ id?: string; personId?: string }>();
  const { data, update } = useBond();
  const existing = data.meetings.find(x => x.id === params.id);
  const [personId, setPersonId] = useState(existing?.personId || params.personId || data.people[0]?.id || '');
  const [startsAt, setStartsAt] = useState(() => existing ? new Date(existing.startsAt) : new Date(Date.now() + 86400000));
  const [endsAt, setEndsAt] = useState(() => existing ? new Date(existing.endsAt || new Date(existing.startsAt).getTime() + 3600000) : new Date(Date.now() + 90000000));
  const [topic, setTopic] = useState(existing?.topic || '');
  const [place, setPlace] = useState(existing?.place || '');
  const save = () => {
    if (!data.people.some(x => x.id === personId) || !topic.trim()) { Alert.alert('Add meeting details', 'Choose a person and a topic.'); return; }
    if (endsAt <= startsAt) { Alert.alert('Check the end time', 'The meeting should end after it starts.'); return; }
    const meeting = { id: existing?.id || `meet-${Date.now()}`, personId, startsAt: startsAt.toISOString(), endsAt: endsAt.toISOString(), topic: topic.trim(), place: place.trim() };
    update(current => { const decisions = { ...current.decisions }; delete decisions[`meeting:${meeting.id}`]; delete decisions[`reflection:${meeting.id}`]; return { ...current, meetings: existing ? current.meetings.map(x => x.id === meeting.id ? meeting : x) : [...current.meetings, meeting], decisions }; });
    router.back();
  };
  return <Page><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><FormHeader title={existing ? 'Edit meeting' : 'Plan a meeting'} /><ScrollView contentContainerStyle={s.body} keyboardShouldPersistTaps="handled"><PersonSelect people={data.people} value={personId} onChange={setPersonId} /><Field label="Topic *" value={topic} onChange={setTopic} /><Field label="Place / meeting link" value={place} onChange={setPlace} /><DateField label="Starts" value={startsAt} onChange={date => { setStartsAt(date); if (endsAt <= date) setEndsAt(new Date(date.getTime() + 3600000)); }} /><DateField label="Ends" value={endsAt} onChange={setEndsAt} /><Text style={s.helper}>Bond prepares you in the 48 hours before this meeting and offers a reflection after it ends.</Text><Pressable onPress={save} style={s.save}><Text style={s.saveText}>Save meeting</Text></Pressable></ScrollView></KeyboardAvoidingView></Page>;
}
