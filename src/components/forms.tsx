import DateTimePicker from '@react-native-community/datetimepicker';
import { createElement, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, palette } from './ui';
import { Person } from '../lib/model';

export function FormHeader({ title }: { title: string }) {
  return <View style={formStyles.head}><Pressable accessibilityLabel="Go back" onPress={() => router.back()}><Icon name="chevron-back" /></Pressable><Text style={formStyles.title}>{title}</Text></View>;
}
export function Field({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (text: string) => void; multiline?: boolean }) {
  return <View style={formStyles.field}><Text style={formStyles.label}>{label}</Text><TextInput accessibilityLabel={label} value={value} onChangeText={onChange} style={[formStyles.input, multiline && { minHeight: 85 }]} multiline={multiline} /></View>;
}
export function PersonSelect({ people, value, onChange }: { people: Person[]; value: string; onChange: (id: string) => void }) {
  return <View style={formStyles.field}><Text style={formStyles.label}>Person</Text><ScrollView horizontal contentContainerStyle={{ gap: 8 }} showsHorizontalScrollIndicator={false}>{people.map(person => <Pressable key={person.id} onPress={() => onChange(person.id)} style={[formStyles.chip, person.id === value && { backgroundColor: palette.ink }]}><Text style={{ color: person.id === value ? '#fff' : palette.ink }}>{person.name}</Text></Pressable>)}</ScrollView>{!people.length && <Pressable onPress={() => router.push('/person/new')}><Text>Add a person first →</Text></Pressable>}</View>;
}
export function DateField({ label, value, onChange }: { label: string; value: Date; onChange: (date: Date) => void }) {
  const [picker, setPicker] = useState<'date' | 'time' | null>(null);
  const webChange = (text: string, mode: 'date' | 'time') => {
    const next = new Date(value);
    if (mode === 'date') { const [y, m, d] = text.split('-').map(Number); next.setFullYear(y, m - 1, d); }
    else { const [h, m] = text.split(':').map(Number); next.setHours(h, m, 0, 0); }
    if (!Number.isNaN(next.getTime())) onChange(next);
  };
  const dateText = `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
  const timeText = `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`;
  return <View style={formStyles.field}><Text style={formStyles.label}>{label}</Text>{Platform.OS === 'web' ? <View style={{ flexDirection: 'row', gap: 12 }}>{createElement('input', { type: 'date', 'aria-label': 'Date', value: dateText, onChange: (e: { target: { value: string } }) => { if (e.target.value) webChange(e.target.value, 'date'); }, style: { padding: 12, borderRadius: 12, border: '1px solid #e2e7eb', minWidth: 0, flex: 1 } })}{createElement('input', { type: 'time', 'aria-label': 'Time', value: timeText, onChange: (e: { target: { value: string } }) => { if (e.target.value) webChange(e.target.value, 'time'); }, style: { padding: 12, borderRadius: 12, border: '1px solid #e2e7eb', minWidth: 0, flex: 1 } })}</View> : <View style={{ flexDirection: 'row', gap: 12 }}><Pressable style={formStyles.chip} onPress={() => setPicker('date')}><Text>{value.toLocaleDateString()}</Text></Pressable><Pressable style={formStyles.chip} onPress={() => setPicker('time')}><Text>{timeText}</Text></Pressable></View>}{picker && Platform.OS !== 'web' && <><DateTimePicker value={value} mode={picker} display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={(event, selected) => { if (Platform.OS !== 'ios' || event.type === 'dismissed') setPicker(null); if (selected) onChange(selected); }} />{Platform.OS === 'ios' && <Pressable onPress={() => setPicker(null)}><Text>Done</Text></Pressable>}</>}</View>;
}
export const formStyles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: 15, padding: 20 }, title: { color: palette.ink, fontSize: 23, fontWeight: '800' }, body: { padding: 20, paddingTop: 10, paddingBottom: 40 }, field: { marginBottom: 22 }, label: { color: palette.ink, fontSize: 12, fontWeight: '700', marginBottom: 9 }, input: { color: palette.ink, fontSize: 14, padding: 14, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#e2e7eb' }, chip: { padding: 12, borderRadius: 19, backgroundColor: '#fff' }, save: { backgroundColor: palette.ink, borderRadius: 25, padding: 16, alignItems: 'center', marginTop: 12 }, saveText: { color: '#fff', fontWeight: '700' }, helper: { fontSize: 12, lineHeight: 19, color: '#66768d', marginBottom: 15 },
});
