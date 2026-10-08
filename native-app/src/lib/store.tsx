import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { BondData, seedData } from './model';
import { requestNudgePermission, syncNudges } from './notifications';

const STORAGE_KEY = 'bond-native-v1';
type Store = { data: BondData; ready: boolean; update: (change: (current: BondData) => BondData) => void; setNudges: (enabled: boolean) => Promise<boolean> };
const StoreContext = createContext<Store | null>(null);

export function BondProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<BondData>(() => seedData());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (!active) return;
      if (raw) {
        try {
          const saved = JSON.parse(raw) as BondData;
          if (saved.version === 1 && Array.isArray(saved.people)) setData(saved);
        } catch { /* An unreadable local snapshot falls back to the seed. */ }
      }
      setReady(true);
    }).catch(() => setReady(true));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => {});
    syncNudges(data).catch(() => {});
  }, [data, ready]);

  const update = (change: (current: BondData) => BondData) => setData(previous => change(previous));
  const setNudges = async (enabled: boolean) => {
    if (enabled && !(await requestNudgePermission())) return false;
    update(current => ({ ...current, notificationsEnabled: enabled }));
    return true;
  };
  return <StoreContext.Provider value={{ data, ready, update, setNudges }}>{children}</StoreContext.Provider>;
}

export function useBond() {
  const value = useContext(StoreContext);
  if (!value) throw new Error('BondProvider is missing');
  return value;
}
