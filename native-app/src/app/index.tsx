import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ActionButton, Avatar, Header, Icon, Page, palette, toneColor } from '../components/ui';
import { useBond } from '../lib/store';
import { Opportunity, opportunities } from '../lib/proactive';

const dayKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
function weekOf(date: Date) {
  const monday = new Date(date);
  monday.setDate(date.getDate() - (date.getDay() + 6) % 7);
  return Array.from({ length: 7 }, (_, i) => { const day = new Date(monday); day.setDate(monday.getDate() + i); return day; });
}

export default function Today() {
  const { data, update, ready } = useBond();
  const [selected, setSelected] = useState(() => new Date());
  const [expanded, setExpanded] = useState(false);
  const days = useMemo(() => weekOf(new Date()), []);
  const today = new Date();
  const shownAt = dayKey(selected) === dayKey(today) ? today : new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), 9);
  const all = opportunities(data, shownAt);
  const visible = expanded ? all : all.slice(0, 2);

  const snooze = (item: Opportunity) => update(current => {
    const until = new Date(); until.setDate(until.getDate() + (item.kind === 'reconnect' ? 7 : 1));
    return { ...current, decisions: { ...current.decisions, [item.id]: { dismissedUntil: until.toISOString() } } };
  });
  const complete = (item: Opportunity) => update(current => ({
    ...current,
    decisions: { ...current.decisions, [item.id]: { completedAt: new Date().toISOString() } },
    commitments: item.kind === 'commitment' ? current.commitments.map(x => `commitment:${x.id}` === item.id ? { ...x, completedAt: new Date().toISOString() } : x) : current.commitments,
    people: item.kind === 'reconnect' || item.kind === 'commitment' ? current.people.map(x => x.id === item.personId ? { ...x, lastContactAt: new Date().toISOString() } : x) : current.people,
  }));
  const open = (item: Opportunity) => {
    if (item.kind === 'reflection') router.push({ pathname: '/reflect', params: { personId: item.personId, meetingId: item.id.split(':')[1] } });
    else router.push({ pathname: '/person/[id]', params: { id: item.personId, mode: item.kind === 'meeting' ? 'rehearse' : item.kind === 'commitment' ? 'draft' : 'chat' } });
  };

  return <Page current="today" background="#f4f8fb"><LinearGradient colors={['#e9f7ff', '#fffde8', '#dff6ee', '#f4f8fb']} locations={[0, .35, .7, 1]} style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Header />
      <View style={styles.hero}>
        <Text style={styles.date}>{today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()}</Text>
        <Text style={styles.headline}>A little nudge toward{`\n`}someone you know.</Text>
        <Text style={styles.subtitle}>One thoughtful step at a time.</Text>
      </View>
      <View style={styles.week}>{days.map(day => {
        const active = dayKey(day) === dayKey(selected);
        return <Pressable key={dayKey(day)} onPress={() => { setSelected(day); setExpanded(false); }} style={[styles.day, active && styles.activeDay]} accessibilityLabel={day.toDateString()} accessibilityState={{ selected: active }}>
          <Text style={[styles.dayName, active && styles.activeText]}>{day.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}</Text>
          <Text style={[styles.dayNumber, active && styles.activeText]}>{day.getDate()}</Text>
          {active && <View style={styles.dayDot} />}
        </Pressable>;
      })}</View>
      <View style={styles.cards}>
        {!ready ? <Text style={styles.empty}>Loading your connections…</Text> : visible.length ? visible.map(item => <NudgeCard key={item.id} item={item} person={data.people.find(x => x.id === item.personId)!} onOpen={() => open(item)} onSnooze={() => snooze(item)} onComplete={() => complete(item)} />) : <View style={styles.emptyCard}><Icon name="checkmark-circle-outline" size={26} color={palette.greenInk} /><Text style={styles.emptyTitle}>Room to breathe today.</Text><Text style={styles.empty}>No relationship action needs attention on this day.</Text></View>}
        {all.length > 2 && !expanded && <Pressable onPress={() => setExpanded(true)} style={styles.more}><Text style={styles.moreText}>{all.length - 2} more {all.length - 2 === 1 ? 'action' : 'actions'} ↓</Text></Pressable>}
      </View>
      <View style={{ height: 24 }} />
    </ScrollView>
  </LinearGradient></Page>;
}

function NudgeCard({ item, person, onOpen, onSnooze, onComplete }: { item: Opportunity; person: NonNullable<ReturnType<typeof useBond>['data']['people'][number]>; onOpen: () => void; onSnooze: () => void; onComplete: () => void }) {
  const tone = item.kind === 'commitment' ? 'yellow' : item.kind === 'reconnect' ? 'green' : 'blue';
  const color = toneColor[tone];
  return <View style={styles.card}>
    <View style={styles.cardTop}><View style={[styles.badge, { backgroundColor: color.bg, borderColor: color.border }]}><View style={[styles.badgeDot, { backgroundColor: color.ink }]} /><Text style={[styles.badgeText, { color: color.ink }]}>{item.label}</Text></View><Pressable onPress={onSnooze} accessibilityLabel="Snooze this nudge"><Icon name="close-outline" size={22} color={palette.muted} /></Pressable></View>
    <View style={styles.personRow}><Avatar person={person} size={51} /><View style={{ flex: 1 }}><Text style={styles.personName}>{person.name}</Text><Text style={styles.actionTitle}>{item.title}</Text><Text style={styles.reason}>{item.reason}</Text></View></View>
    <View style={styles.buttons}><ActionButton label={item.action} icon={item.kind === 'meeting' ? 'chatbubbles-outline' : item.kind === 'reflection' ? 'create-outline' : item.kind === 'commitment' ? 'paper-plane-outline' : 'refresh-outline'} tone={tone} onPress={onOpen} /><Pressable onPress={item.kind === 'meeting' || item.kind === 'reflection' ? onSnooze : onComplete} style={styles.secondary}><Icon name={item.kind === 'meeting' || item.kind === 'reflection' ? 'time-outline' : 'checkmark-outline'} size={20} color={palette.ink} /></Pressable></View>
  </View>;
}

const styles = StyleSheet.create({
  content: { paddingBottom: 18 },
  hero: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 22 },
  date: { color: palette.muted, fontSize: 13, fontWeight: '800', letterSpacing: 1.1, marginBottom: 7 },
  headline: { color: palette.ink, fontFamily: 'Georgia', fontSize: 31, fontWeight: '700', lineHeight: 37, letterSpacing: -.8 },
  subtitle: { color: '#6c7b91', fontSize: 13, marginTop: 8 },
  week: { flexDirection: 'row', paddingHorizontal: 20, gap: 5, marginBottom: 19 },
  day: { flex: 1, minHeight: 64, borderRadius: 20, backgroundColor: '#ffffffc9', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#fff' },
  activeDay: { backgroundColor: '#080b0e', borderColor: '#080b0e' },
  dayName: { color: palette.muted, fontFamily: 'Georgia', fontSize: 10, fontWeight: '700' },
  dayNumber: { color: palette.ink, fontFamily: 'Georgia', fontSize: 20, fontWeight: '700', marginTop: 3 },
  activeText: { color: '#fff' }, dayDot: { position: 'absolute', bottom: 5, width: 5, height: 5, borderRadius: 3, backgroundColor: '#19d6af' },
  cards: { paddingHorizontal: 20, gap: 13 },
  card: { backgroundColor: '#ffffffee', borderRadius: 27, padding: 18, shadowColor: '#90a9b7', shadowOpacity: .11, shadowRadius: 18, elevation: 3 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 11, paddingVertical: 7, borderRadius: 20, borderWidth: 1, maxWidth: '87%' },
  badgeDot: { width: 6, height: 6, borderRadius: 3 }, badgeText: { fontFamily: 'Georgia', fontSize: 11, fontWeight: '700', letterSpacing: .5, flexShrink: 1 },
  personRow: { flexDirection: 'row', gap: 10 },
  personName: { color: palette.ink, fontFamily: 'Georgia', fontWeight: '700', fontSize: 19 },
  actionTitle: { color: '#415067', fontSize: 13, lineHeight: 19, marginTop: 3 },
  reason: { color: palette.muted, fontSize: 11, lineHeight: 16, marginTop: 4 },
  buttons: { flexDirection: 'row', gap: 9, marginTop: 17 },
  secondary: { width: 49, height: 49, borderRadius: 25, backgroundColor: '#fff', borderColor: '#f1f2f3', borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  more: { alignItems: 'center', padding: 10 }, moreText: { color: palette.ink, fontWeight: '700' },
  emptyCard: { backgroundColor: '#fff', borderRadius: 24, padding: 25, alignItems: 'center', gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: palette.ink }, empty: { textAlign: 'center', color: palette.muted, fontSize: 13 },
});
