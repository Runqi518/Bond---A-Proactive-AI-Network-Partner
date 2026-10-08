import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { Message, Person } from './model';
export type AISettings = { url: string; enabled: boolean };
const SETTINGS = 'bond-ai-settings'; const TOKEN = 'bond-ai-token';
let webToken = '';
export async function readAISettings(): Promise<AISettings> {
  const raw = await AsyncStorage.getItem(SETTINGS);
  return raw ? JSON.parse(raw) : { url: '', enabled: false };
}
export async function readAIToken() { return Platform.OS === 'web' ? webToken : (await SecureStore.getItemAsync(TOKEN) || ''); }
export async function saveAISettings(settings: AISettings, token: string) {
  if (Platform.OS === 'web') webToken = token;
  else if (token) await SecureStore.setItemAsync(TOKEN, token); else await SecureStore.deleteItemAsync(TOKEN);
  await AsyncStorage.setItem(SETTINGS, JSON.stringify(settings));
}
export function validateServiceURL(value: string) {
  const url = new URL(value);
  if (url.username || url.password || url.search || url.hash) throw new Error('Use a service URL without credentials, query or fragment.');
  if (url.protocol !== 'https:' && !(Platform.OS === 'web' && url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))) throw new Error('Use HTTPS for the mobile AI service.');
  return url.origin;
}
export async function coachingReply(person: Person, messages: Message[], mode: string, text: string, extra: { meeting: string; commitment: string }) {
  const settings = await readAISettings();
  if (!settings.enabled) return { text: offlineCue(person, mode, text), source: 'local' as const };
  const url = validateServiceURL(settings.url); const token = await readAIToken();
  if (!token) throw new Error('Set your service access token in Me → AI Connection.');
  const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 50000);
  try {
    const response = await fetch(`${url}/v1/coach`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, signal: controller.signal, body: JSON.stringify({ mode, text, context: { name: person.name, role: person.role, how: person.how, about: person.about, goal: person.goal, ...extra }, history: messages.filter(x => x.mode === mode && x.source !== 'local').slice(-10).map(x => ({ role: x.by === 'me' ? 'user' : 'assistant', content: x.text })) }) });
    const body = await response.json();
    if (!response.ok || typeof body.text !== 'string') throw new Error(body.error || 'AI service could not respond.');
    return { text: body.text, source: 'ai' as const };
  } catch (error) { if (controller.signal.aborted) throw new Error('The request timed out. Please try again.'); throw error; }
  finally { clearTimeout(timeout); }
}
function offlineCue(person: Person, mode: string, text: string) {
  if (mode === 'draft') return `Hi ${person.name.split(' ')[0]}, ${text.trim()}${/[.!?。！？]$/.test(text.trim()) ? '' : '.'}\n\nWould you be open to a quick catch-up when it suits you?`;
  if (mode === 'rehearse') return `Local practice checklist:\n• Start with one open question about ${person.goal || 'their recent work'}.\n• Listen for a detail you can follow up on.\n• Close with one next step you can keep.\n\nThis is a coaching checklist, not ${person.name}'s response.`;
  return `Local planning prompt: your goal is “${person.goal || 'stay in touch'}”. Turn “${text}” into one action you can take this week. You can plan a meeting or save a follow-up using the link above.`;
}
