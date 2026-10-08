import { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, Switch, Text, TextInput } from 'react-native';
import { Page } from '../components/ui';
import { Field, FormHeader, formStyles as s } from '../components/forms';
import { readAISettings, readAIToken, saveAISettings, validateServiceURL } from '../lib/ai';

export default function AISettings() {
  const [url, setURL] = useState(''); const [token, setToken] = useState(''); const [enabled, setEnabled] = useState(false); const [busy, setBusy] = useState(false); const [status, setStatus] = useState('');
  useEffect(() => { Promise.all([readAISettings(), readAIToken()]).then(([settings, value]) => { setURL(settings.url); setEnabled(settings.enabled); setToken(value); }).catch(() => setStatus('Could not load AI settings.')); }, []);
  const save = async () => {
    try { if (enabled && !token.trim()) throw new Error('Enter your service access token.'); const origin = url.trim() ? validateServiceURL(url.trim()) : ''; if (enabled && !origin) throw new Error('Enter your AI service URL.'); await saveAISettings({ url: origin, enabled }, token.trim()); setStatus('Settings saved.'); }
    catch (error) { setStatus(error instanceof Error ? error.message : 'Could not save settings.'); }
  };
  const test = async () => {
    setBusy(true); setStatus('Checking service…');
    const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 10000);
    try { const origin = validateServiceURL(url.trim()); const response = await fetch(`${origin}/health`, { signal: controller.signal }); const result = await response.json(); setStatus(response.ok && result.ready ? 'Service is configured. Save to enable AI.' : 'Service is reachable but needs server configuration.'); }
    catch { setStatus('Could not reach the service. Check the URL and connection.'); } finally { clearTimeout(timer); setBusy(false); }
  };
  return <Page><FormHeader title="AI Connection" /><ScrollView contentContainerStyle={s.body} keyboardShouldPersistTaps="handled"><Text style={s.helper}>When enabled, the selected person’s context and recent conversation are sent to your configured Bond service and its AI provider when you tap Send. Other contacts and reflections are not sent.</Text><Text style={s.label}>Use connected AI</Text><Switch value={enabled} onValueChange={value => { if (value) Alert.alert('Connect AI', 'Only send information you are comfortable sharing with your service and AI provider.'); setEnabled(value); }} /><Field label="Bond service URL" value={url} onChange={setURL} /><Text style={s.label}>Service access token</Text><TextInput accessibilityLabel="Service access token" value={token} onChangeText={setToken} secureTextEntry autoCapitalize="none" autoCorrect={false} style={s.input} /><Text style={[s.helper, { marginTop: 12 }]}>{Platform.OS === 'web' ? 'Browser preview keeps the token only for this session.' : 'The service token is saved in device secure storage.'} The OpenAI API key belongs on the server.</Text><Pressable onPress={test} disabled={busy}><Text style={s.label}>Check connection</Text></Pressable><Text accessibilityLiveRegion="polite" style={s.helper}>{status}</Text><Pressable onPress={save} style={s.save}><Text style={s.saveText}>Save AI settings</Text></Pressable><Text style={[s.helper, { marginTop: 20 }]}>With AI off, Bond provides local coaching checklists and a simple editable message template. Private rehearsal is always hypothetical.</Text></ScrollView></Page>;
}
