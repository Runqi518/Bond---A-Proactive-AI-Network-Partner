import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Person, Tone } from '../lib/model';

export const palette = {
  ink: '#111b30', muted: '#92a1b8', blue: '#e4f6ff', blueInk: '#12668b', yellow: '#fff9ce', yellowInk: '#695b00', green: '#e8fbef', greenInk: '#155a3e', pink: '#ffeaf2', pinkInk: '#7c3b5b', white: '#fff', canvas: '#f6f8fa', nav: '#252831',
};
export const toneColor: Record<Tone, { bg: string; ink: string; border: string }> = {
  blue: { bg: palette.blue, ink: palette.blueInk, border: '#bcecff' },
  yellow: { bg: palette.yellow, ink: palette.yellowInk, border: '#fbe678' },
  green: { bg: palette.green, ink: palette.greenInk, border: '#a2ecc1' },
  pink: { bg: palette.pink, ink: palette.pinkInk, border: '#ffc7dd' },
};

export function Icon({ name, size = 22, color = palette.ink }: { name: React.ComponentProps<typeof Ionicons>['name']; size?: number; color?: string }) {
  return <Ionicons name={name} size={size} color={color} />;
}

export function Avatar({ person, size = 48 }: { person: Person; size?: number }) {
  const color = toneColor[person.tone];
  const initials = person.name.split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase();
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color.bg, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: palette.white }}><Text style={{ color: color.ink, fontSize: size * .36, fontWeight: '700' }}>{initials}</Text></View>;
}

export function Header({ add = false }: { add?: boolean }) {
  return <View style={styles.header}>
    <View style={styles.brand}><View style={styles.logo}><Text style={styles.logoText}>∞</Text></View><Text style={styles.brandText}>Bond</Text></View>
    <View style={styles.headerActions}>
      <Pressable accessibilityLabel="Search people" onPress={() => router.push('/people')} style={styles.circle}><Icon name="search-outline" /></Pressable>
      {add && <Pressable accessibilityLabel="Add person" onPress={() => router.push('/person/new')} style={styles.circle}><Icon name="person-add-outline" /></Pressable>}
      <Pressable accessibilityLabel="Settings" onPress={() => router.push('/me')} style={styles.circle}><Icon name="settings-outline" /></Pressable>
    </View>
  </View>;
}

export function BottomNav({ current }: { current: 'today' | 'people' | 'me' }) {
  const tabs = [
    { key: 'today', title: 'Today', icon: 'calendar-outline', href: '/' },
    { key: 'people', title: 'People', icon: 'people-outline', href: '/people' },
    { key: 'me', title: 'Me', icon: 'person-outline', href: '/me' },
  ] as const;
  return <View style={styles.nav}>{tabs.map(tab => <Pressable key={tab.key} onPress={() => router.replace(tab.href)} style={[styles.navItem, current === tab.key && styles.navSelected]} accessibilityRole="tab" accessibilityState={{ selected: current === tab.key }}>
    <Icon name={tab.icon} size={20} color={current === tab.key ? palette.ink : '#c8cbd3'} /><Text style={[styles.navText, current === tab.key && styles.navTextSelected]}>{tab.title}</Text>
  </Pressable>)}</View>;
}

export function Page({ children, current, background = palette.canvas }: { children: React.ReactNode; current?: 'today' | 'people' | 'me'; background?: string }) {
  return <SafeAreaView style={{ flex: 1, backgroundColor: background }} edges={['top', 'bottom']}><View style={{ flex: 1 }}>{children}</View>{current && <BottomNav current={current} />}</SafeAreaView>;
}

export function ActionButton({ label, icon, onPress, tone = 'blue', compact = false }: { label: string; icon?: React.ComponentProps<typeof Ionicons>['name']; onPress: () => void; tone?: Tone; compact?: boolean }) {
  const color = toneColor[tone];
  return <Pressable onPress={onPress} style={[styles.actionButton, compact && { paddingHorizontal: 18, flex: 0 }, { backgroundColor: color.bg, borderColor: color.border }]}><View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>{icon && <Icon name={icon} size={19} color={color.ink} />}<Text style={{ color: color.ink, fontWeight: '700', fontSize: 15 }}>{label}</Text></View></Pressable>;
}

const styles = StyleSheet.create({
  header: { height: 68, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  logo: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: .06, shadowRadius: 8 },
  logoText: { fontSize: 32, fontWeight: '400', color: '#05070b', marginTop: -3 },
  brandText: { fontSize: 24, fontWeight: '800', color: palette.ink, letterSpacing: -.5 },
  headerActions: { flexDirection: 'row', gap: 8 },
  circle: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#ffffffbf', alignItems: 'center', justifyContent: 'center' },
  nav: { marginHorizontal: 19, marginBottom: 5, padding: 5, height: 62, backgroundColor: palette.nav, borderRadius: 32, flexDirection: 'row', alignItems: 'center', shadowColor: '#10131a', shadowOpacity: .18, shadowRadius: 14, elevation: 5 },
  navItem: { flex: 1, height: 51, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 7, borderRadius: 27 },
  navSelected: { backgroundColor: '#fff' },
  navText: { color: '#c8cbd3', fontSize: 14, fontWeight: '600' },
  navTextSelected: { color: palette.ink, fontWeight: '800' },
  actionButton: { flex: 1, minHeight: 47, paddingHorizontal: 12, borderRadius: 27, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
});
