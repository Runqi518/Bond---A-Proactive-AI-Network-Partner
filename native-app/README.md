# Bond native app

Bond is now a React Native / Expo app for iOS and Android. The `mobile-app/` folder is the earlier HTML prototype; this folder contains the installable app source.

## Run

```sh
cd native-app
npm install
npx expo start
```

Use Expo Go for quick development previews. The native project uses Expo Router and SDK 57. App state is saved locally with AsyncStorage. No server or API key is required for the current flows.

## Build an installable app

```sh
npx eas-cli@latest login
npx eas-cli@latest build --platform android --profile preview
npx eas-cli@latest build --platform ios --profile preview
```

The Android preview profile creates an APK. iOS internal distribution requires Apple signing and registered test devices. These cloud builds require access to the user's Expo and Apple accounts; a local Xcode installation is not required.

## Product behavior

- Today ranks meeting preparation, unfulfilled commitments, recent meeting reflection, and overdue reconnection. Each card shows the reason for the suggestion.
- People lists and searches connections. Add person, edit context, set a cadence, and rehearse a conversation.
- Me saves real meeting reflections, turns an explicit next step into a commitment, and lets the user export local data.
- Notifications are opt in. They are local device reminders, with at most two new opportunity notifications per day. Bond never sends a message to a contact automatically.
- The chat is clearly labeled private practice. Its responses are deterministic coaching cues. A production AI service and external calendar/contact integrations are not connected yet.

The nudge rules and future integrations are specified in [PROACTIVE_MECHANISM.md](./PROACTIVE_MECHANISM.md).
