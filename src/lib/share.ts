import { Platform, Share } from 'react-native';

export async function shareText(text: string): Promise<string> {
  if (Platform.OS !== 'web') { await Share.share({ message: text }); return ''; }
  if (navigator.share) { await navigator.share({ text }); return ''; }
  if (navigator.clipboard) { await navigator.clipboard.writeText(text); return 'Copied to clipboard.'; }
  throw new Error('Sharing is unavailable in this browser. You can select and copy the text.');
}
