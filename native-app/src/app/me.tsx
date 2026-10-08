import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Share, StyleSheet, Switch, Text, View } from 'react-native';
import { Avatar, Header, Icon, Page, palette } from '../components/ui';
import { useBond } from '../lib/store';

export default function Me() {
  const { data, setNudges } = useBond();
  const [busy, setBusy] = useState(false);
  const toggle = async (enabled: boolean) => {
    setBusy(true);
    const allowed = await setNudges(enabled);
    setBusy(false);
    if (enabled && !allowed) Alert.alert('Notifications are off', 'You can still see your nudges in Today. Enable notifications in device settings when you are ready.');
  };
  const exportData = () => Share.share({ message: JSON.stringify({ people: data.people, meetings: data.meetings, commitments: data.commitments, reflections: data.reflections }, null, 2) });
  return <Page current="me" background="#f8f8f9"><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <Header />
    <Text style={styles.title}>Reflection</Text>
    <View style={styles.feature}><View style={styles.badge}><Text style={styles.badgeText}>●  POST-ENCOUNTER SYNC</Text></View><Text style={styles.featureTitle}>Reflect on a meeting</Text><Text style={styles.featureCopy}>Gather impressions and commitments soon after meeting someone.</Text><Pressable onPress={() => router.push('/reflect')} style={styles.featureButton}><Icon name="create-outline" size={18} color={palette.greenInk} /><Text style={styles.featureButtonText}>Select person & Reflect</Text><Icon name="arrow-forward" size={18} color={palette.muted} /></Pressable></View>
    <View style={styles.stats}><View style={styles.stat}><Text style={styles.statLabel}>People in Bond</Text><Text style={styles.statValue}>{data.people.length}</Text><Text style={styles.statCopy}>Thoughtful connections</Text></View><View style={styles.stat}><Text style={styles.statLabel}>Memories stored</Text><Text style={styles.statValue}>{data.reflections.length}</Text><Text style={styles.statCopy}>Saved on this device</Text></View></View>
    <View style={styles.sectionTitle}><Text style={styles.sectionTitleText}>Recent Reflections</Text><Pressable onPress={() => router.push('/reflect')}><Text style={styles.link}>Add new</Text></Pressable></View>
    {data.reflections.length ? data.reflections.slice().reverse().slice(0, 4).map(reflection => { const person = data.people.find(x => x.id === reflection.personId); return <View key={reflection.id} style={styles.memory}><View style={styles.memoryHead}>{person && <Avatar person={person} size={38} />}<View><Text style={styles.memoryName}>{person?.name || 'Connection'}</Text><Text style={styles.memoryDate}>{new Date(reflection.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text></View></View><Text style={styles.memoryText}>{reflection.notes}</Text>{!!reflection.nextStep && <Text style={styles.nextStep}>Next: {reflection.nextStep}</Text>}</View>; }) : <View style={styles.memory}><Text style={styles.memoryText}>Your first reflection will appear here after a real conversation.</Text></View>}
    <Text style={[styles.sectionTitleText, { marginTop: 26, marginBottom: 10 }]}>Settings & Intelligence</Text>
    <View style={styles.settings}><View style={styles.settingRow}><View style={styles.settingIcon}><Icon name="notifications-outline" size={19} color={palette.blueInk} /></View><View style={{ flex: 1 }}><Text style={styles.settingTitle}>Notifications & Cadence</Text><Text style={styles.settingCopy}>Up to two gentle nudges a day</Text></View><Switch value={data.notificationsEnabled} onValueChange={toggle} disabled={busy} trackColor={{ true: '#a7dcc5', false: '#d8dee5' }} thumbColor="#fff" /></View><View style={styles.separator} /><Pressable onPress={() => router.push('/people')} style={styles.settingRow}><View style={[styles.settingIcon, { backgroundColor: '#def5e8' }]}><Icon name="flag-outline" size={19} color={palette.greenInk} /></View><View style={{ flex: 1 }}><Text style={styles.settingTitle}>Relationship Goals</Text><Text style={styles.settingCopy}>Edit each person’s goal and cadence</Text></View><Icon name="chevron-forward" size={17} color={palette.muted} /></Pressable><View style={styles.separator} /><Pressable onPress={exportData} style={styles.settingRow}><View style={styles.settingIcon}><Icon name="download-outline" size={19} color={palette.blueInk} /></View><View style={{ flex: 1 }}><Text style={styles.settingTitle}>Export Local Data</Text><Text style={styles.settingCopy}>Share a copy you control</Text></View><Icon name="chevron-forward" size={17} color={palette.muted} /></Pressable></View>
    <View style={styles.privacy}><Icon name="shield-checkmark-outline" size={16} color={palette.muted} /><Text style={styles.privacyText}>Bond never contacts anyone automatically. Your notes stay on this device unless you choose to share them.</Text></View>
  </ScrollView></Page>;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingBottom: 22 }, title: { color: palette.ink, fontSize: 29, fontWeight: '800', marginTop: 22, marginBottom: 18 },
  feature: { backgroundColor: '#fff', borderRadius: 28, padding: 20, shadowColor: '#b5c2c7', shadowOpacity: .11, shadowRadius: 20, elevation: 2 },
  badge: { alignSelf: 'flex-start', backgroundColor: '#dff8e9', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6, marginBottom: 13 }, badgeText: { color: palette.greenInk, fontSize: 10, fontWeight: '700' },
  featureTitle: { color: palette.ink, fontSize: 19, fontWeight: '800' }, featureCopy: { color: '#68758a', fontSize: 13, lineHeight: 19, marginTop: 5, maxWidth: 270 },
  featureButton: { backgroundColor: '#fff', marginTop: 20, borderRadius: 23, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8, shadowColor: '#000', shadowOpacity: .06, shadowRadius: 10 }, featureButtonText: { flex: 1, color: palette.ink, fontWeight: '700', fontSize: 13 },
  stats: { flexDirection: 'row', gap: 10, marginTop: 14 }, stat: { flex: 1, backgroundColor: '#fff', borderRadius: 21, padding: 14 }, statLabel: { color: palette.muted, fontSize: 11 }, statValue: { color: palette.ink, fontSize: 27, fontWeight: '800', marginTop: 11 }, statCopy: { color: '#607088', fontSize: 11, marginTop: 4 },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 25, marginBottom: 10 }, sectionTitleText: { color: palette.ink, fontSize: 16, fontWeight: '800' }, link: { color: palette.blueInk, fontSize: 12 },
  memory: { backgroundColor: '#fff', borderRadius: 21, padding: 16, marginBottom: 10 }, memoryHead: { flexDirection: 'row', gap: 8, alignItems: 'center' }, memoryName: { color: palette.ink, fontSize: 13, fontWeight: '700' }, memoryDate: { color: palette.muted, fontSize: 10, marginTop: 2 }, memoryText: { color: '#4a586c', fontSize: 12, lineHeight: 18, marginTop: 12 }, nextStep: { color: palette.greenInk, fontSize: 11, marginTop: 9, fontWeight: '600' },
  settings: { backgroundColor: '#fff', borderRadius: 22, paddingHorizontal: 15 }, settingRow: { minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: 10 }, settingIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#e8f5fc', alignItems: 'center', justifyContent: 'center' }, settingTitle: { color: palette.ink, fontSize: 13, fontWeight: '700' }, settingCopy: { color: palette.muted, fontSize: 10, marginTop: 2 }, separator: { height: 1, backgroundColor: '#f0f1f2' },
  privacy: { flexDirection: 'row', gap: 8, marginTop: 22, alignItems: 'flex-start', paddingBottom: 10 }, privacyText: { color: palette.muted, fontSize: 10, lineHeight: 15, flex: 1 },
});
