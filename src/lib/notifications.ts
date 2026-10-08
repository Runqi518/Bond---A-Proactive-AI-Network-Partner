import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { BondData } from './model';
import { nextReminderTime, opportunities } from './proactive';

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldPlaySound: false, shouldSetBadge: false, shouldShowBanner: true, shouldShowList: true }),
});

export async function requestNudgePermission() {
  if (Platform.OS === 'web') return false;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('bond-nudges', { name: 'Bond nudges', importance: Notifications.AndroidImportance.DEFAULT });
  }
  let status = (await Notifications.getPermissionsAsync()).status;
  if (status !== 'granted') status = (await Notifications.requestPermissionsAsync()).status;
  return status === 'granted';
}

let scheduling = Promise.resolve();

export function syncNudges(data: BondData, now = new Date()) {
  scheduling = scheduling.catch(() => {}).then(() => schedule(data, now));
  return scheduling;
}

async function schedule(data: BondData, now: Date) {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!data.notificationsEnabled) return;

  // Plan once per opportunity, up to two nudges per day over the next two weeks.
  const raw = await AsyncStorage.getItem('bond-notification-history');
  const past: Record<string, string> = raw ? JSON.parse(raw) : {};
  const delivered = Object.fromEntries(Object.entries(past).filter(([, at]) => new Date(at) <= now));
  const scheduled = new Set(Object.keys(delivered));
  const plan = { ...delivered };
  const day = nextReminderTime(now);
  for (let offset = 0; offset < 14; offset++) {
    const when = new Date(day);
    when.setDate(when.getDate() + offset);
    const choices = opportunities(data, when).filter(x => !scheduled.has(x.id)).slice(0, 2);
    for (const choice of choices) {
      await Notifications.scheduleNotificationAsync({
        identifier: `bond:${choice.id}`,
        content: {
          title: 'A little nudge toward someone you know',
          body: 'A connection may need your attention in Bond.',
          data: { path: '/' },
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: when, channelId: 'bond-nudges' },
      });
      scheduled.add(choice.id);
      plan[choice.id] = when.toISOString();
    }
  }
  await AsyncStorage.setItem('bond-notification-history', JSON.stringify(plan));
}
