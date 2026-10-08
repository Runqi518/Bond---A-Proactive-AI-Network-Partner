import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, AppState, Pressable, Text, View } from 'react-native';
import { BondData, seedData } from './model';
import { requestNudgePermission, syncNudges } from './notifications';

const STORAGE_KEY = 'bond-native-v1';
let writeQueue = Promise.resolve();
type Store = { data: BondData; ready: boolean; update: (change: (current: BondData) => BondData) => void; setNudges: (enabled: boolean) => Promise<boolean> };
const StoreContext = createContext<Store | null>(null);

export function BondProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<BondData>(() => seedData());
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [loadFailed, setLoadFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (!active) return;
      if (raw) {
        const saved = JSON.parse(raw) as BondData;
        if (saved.version !== 1 || !['people', 'meetings', 'commitments', 'reflections', 'messages'].every(key => Array.isArray(saved[key as keyof BondData]))) throw new Error('Invalid local data');
        setData({ ...saved, initialized: true, decisions: saved.decisions || {} });
      }
      setReady(true);
    }).catch(() => { if (active) { setLoadFailed(true); setError('Could not read your saved data. It has not been overwritten.'); } });
    return () => { active = false; };
  }, [retry]);
  useEffect(() => {
    if (!ready || !data.initialized) return;
    const snapshot = JSON.stringify(data);
    writeQueue = writeQueue.catch(() => {}).then(() => AsyncStorage.setItem(STORAGE_KEY, snapshot));
    writeQueue.then(() => setError('')).catch(() => setError('Changes could not be saved. Keep the app open and free device storage.'));
    syncNudges(data).catch(() => setError('Reminders could not be updated. Try switching notifications off and on.'));
    const subscription = AppState.addEventListener('change', state => { if (state === 'active') syncNudges(data).catch(() => {}); });
    return () => subscription.remove();
  }, [data, ready]);

  const update = (change: (current: BondData) => BondData) => setData(previous => change(previous));
  const setNudges = async (enabled: boolean) => {
    if (enabled && !(await requestNudgePermission())) return false;
    update(current => ({ ...current, notificationsEnabled: enabled }));
    return true;
  };
  if (loadFailed) return <View style={{ flex: 1, justifyContent: 'center', padding: 30 }}><Text>{error}</Text><Pressable style={{ padding: 20 }} onPress={() => { setLoadFailed(false); setRetry(x => x + 1); }}><Text>Retry loading</Text></Pressable></View>;
  if (!ready) return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator /><Text style={{ textAlign: 'center', marginTop: 15 }}>Loading Bond…</Text></View>;
  if (!data.initialized) {
    const begin = (sample: boolean) => { const next = seedData(); setData({ ...next, initialized: true, ...(!sample ? { people: [], meetings: [], commitments: [], reflections: [], messages: [] } : {}) }); };
    return <View style={{ flex: 1, backgroundColor: '#edf8f5', justifyContent: 'center', padding: 30 }}><Text style={{ fontSize: 70, color: '#12668b' }}>∞</Text><Text style={{ fontSize: 36, fontWeight: '800', color: '#111b30' }}>Welcome to Bond</Text><Text style={{ fontSize: 16, lineHeight: 25, color: '#607088', marginVertical: 20 }}>Make one thoughtful connection at a time. Start with your own people, or explore a sample network.</Text><Pressable onPress={() => begin(false)} style={{ backgroundColor: '#111b30', padding: 18, borderRadius: 25 }}><Text style={{ color: '#fff', fontWeight: '700', textAlign: 'center' }}>Start with my people</Text></Pressable><Pressable onPress={() => begin(true)} style={{ padding: 20 }}><Text style={{ textAlign: 'center', color: '#12668b' }}>Explore sample network</Text></Pressable><Text style={{ color: '#607088', fontSize: 12, lineHeight: 19 }}>Notifications and connected AI are optional. Bond never messages your contacts automatically.</Text></View>;
  }
  return <StoreContext.Provider value={{ data, ready, update, setNudges }}>{!!error && <View style={{ backgroundColor: '#fff3d7', padding: 12 }}><Text accessibilityLiveRegion="polite">{error}</Text></View>}{children}</StoreContext.Provider>;
}

export function useBond() {
  const value = useContext(StoreContext);
  if (!value) throw new Error('BondProvider is missing');
  return value;
}
