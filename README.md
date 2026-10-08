# Bond

Bond helps you keep meaningful professional relationships warm with timely, user-controlled actions.

## Native iOS and Android app

The installable cross-platform app lives in [`native-app/`](./native-app/). It is built with React Native and Expo. Start the development app with:

```sh
cd native-app
npm install
npx expo start
```

See [`native-app/README.md`](./native-app/README.md) for builds and current feature coverage.

## Proactive relationship support

Bond ranks meeting preparation, promises, recent meeting reflections, and overdue reconnections. Suggestions include their trigger reason, can be snoozed or completed, and are limited to one per person at a time. Notifications are optional and local to the device. Bond never sends a message on the user's behalf.

See [`native-app/PROACTIVE_MECHANISM.md`](./native-app/PROACTIVE_MECHANISM.md) for the rules and next steps.

`mobile-app/` and `Bond-UI-preview.html` are the earlier browser prototypes. `server/` and `public/` contain the earlier web service and UI.
