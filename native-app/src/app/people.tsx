import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Avatar, Header, Icon, Page, palette } from '../components/ui';
import { useBond } from '../lib/store';
import { opportunities } from '../lib/proactive';

export default function People() {
  const { data } = useBond();
  const [query, setQuery] = useState('');
  const priorities = opportunities(data);
  const sorted = data.people.filter(person => [person.name, person.role, person.how, ...person.tags].join(' ').toLowerCase().includes(query.toLowerCase())).sort((a, b) => {
    const aRank = priorities.findIndex(x => x.personId === a.id);
    const bRank = priorities.findIndex(x => x.personId === b.id);
    return (aRank < 0 ? 99 : aRank) - (bRank < 0 ? 99 : bRank);
  });
  return <Page current="people"><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <Header add />
    <View style={styles.intro}><View style={styles.introTop}><Text style={styles.title}>People</Text><Text style={styles.sort}>☷  Sorted by priority</Text></View><View style={styles.search}><Icon name="search-outline" size={20} color={palette.muted} /><TextInput value={query} onChangeText={setQuery} placeholder="Search by name, role, or connection" placeholderTextColor={palette.muted} style={styles.input} autoCapitalize="none" /></View></View>
    <View style={styles.list}>{sorted.map(person => {
      const priority = priorities.find(x => x.personId === person.id);
      const subtitle = priority ? priority.kind === 'meeting' ? priority.reason : priority.kind === 'commitment' ? 'Reading list promised' : priority.kind === 'reconnect' ? 'Time to reconnect' : 'Reflect on your meeting' : person.tags.join(' · ');
      return <Pressable key={person.id} onPress={() => router.push({ pathname: '/person/[id]', params: { id: person.id } })} style={styles.card}>
        <View style={styles.person}><Avatar person={person} size={51} /><View style={{ flex: 1 }}><Text style={styles.name}>{person.name}</Text><Text style={styles.role}>{person.role || 'New connection'}</Text></View></View>
        <View style={styles.divider} /><View style={styles.cardBottom}><View style={styles.meta}><Icon name={priority?.kind === 'meeting' ? 'calendar-outline' : priority?.kind === 'commitment' ? 'bookmark-outline' : 'time-outline'} size={17} color={palette.muted} /><Text numberOfLines={1} style={styles.subtitle}>{subtitle}</Text></View><View style={styles.connect}><Icon name="chatbubble-outline" size={17} color="#4e530f" /><Text style={styles.connectText}>Connect</Text></View></View>
      </Pressable>;
    })}{sorted.length === 0 && <View style={styles.empty}><Text style={styles.emptyTitle}>No people found</Text><Text style={styles.emptyCopy}>Try a different search or add someone new.</Text><Pressable onPress={() => router.push('/person/new')} style={styles.add}><Text style={styles.addText}>Add person +</Text></Pressable></View>}</View>
  </ScrollView></Page>;
}

const styles = StyleSheet.create({
  content: { paddingBottom: 22 }, intro: { marginHorizontal: 20, marginTop: 18, padding: 18, borderRadius: 28, backgroundColor: '#fff', shadowColor: '#a5b7c5', shadowOpacity: .08, shadowRadius: 14 },
  introTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 29, color: palette.ink, fontWeight: '800', letterSpacing: -.8 }, sort: { color: '#4c5a70', fontSize: 11, fontWeight: '600' },
  search: { backgroundColor: '#fafafa', borderRadius: 25, paddingHorizontal: 15, height: 44, flexDirection: 'row', alignItems: 'center', gap: 10 }, input: { flex: 1, color: palette.ink, fontSize: 13 },
  list: { paddingHorizontal: 20, paddingTop: 16, gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 17, shadowColor: '#8497a8', shadowOpacity: .07, shadowRadius: 13, elevation: 2 },
  person: { flexDirection: 'row', gap: 11, alignItems: 'center' }, name: { color: palette.ink, fontSize: 21, fontWeight: '800', letterSpacing: -.3 }, role: { color: '#4c5970', fontSize: 13, marginTop: 2 },
  divider: { height: 1, backgroundColor: '#ecefeb', marginVertical: 14 }, cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  meta: { flexDirection: 'row', gap: 6, alignItems: 'center', flex: 1 }, subtitle: { color: palette.muted, fontSize: 11, flex: 1 },
  connect: { backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 9, borderRadius: 18, flexDirection: 'row', gap: 5, alignItems: 'center', shadowColor: '#000', shadowOpacity: .04, shadowRadius: 5 }, connectText: { fontSize: 12, fontWeight: '700', color: palette.ink },
  empty: { backgroundColor: '#fff', borderRadius: 25, padding: 26, alignItems: 'center', gap: 8 }, emptyTitle: { fontSize: 18, color: palette.ink, fontWeight: '700' }, emptyCopy: { color: palette.muted, fontSize: 13, textAlign: 'center' }, add: { marginTop: 6, padding: 10 }, addText: { color: palette.blueInk, fontWeight: '700' },
});
