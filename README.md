# Bond — A Proactive AI Network Partner

**This repository's main application is a React Native / Expo app for iOS and Android.**

The application source is now at the repository root: [`src/app/`](src/app), [`package.json`](package.json), [`app.json`](app.json), and [`eas.json`](eas.json). Earlier HTML prototypes are preserved in [`legacy/`](legacy) for reference.

## Run the app

Requires Node 22.18+ (24 LTS recommended).

```sh
npm ci
npm start
```

Open the development app on your phone with Expo Go, or use a development build. `npm run web` opens an optional browser preview of the same React Native screens.

## What works

- First launch: choose an empty personal network or a sample network.
- Today: ranked meeting preparation, promises, post-meeting reflections, and overdue reconnection; snooze or complete actions.
- People: search, add, edit contact context, relationship goals and cadence; delete a connection and its local records.
- Meetings & follow-ups: create/edit/cancel meetings with start/end times; create/edit/complete/reopen/remove commitments.
- Reflection: save real conversation notes and explicitly create the next follow-up.
- Private coaching: local checklists and editable templates offline; connect a real AI service in Me → AI Connection for contextual coaching, rehearsal, and drafting. Rehearsal is always hypothetical.
- Optional local notifications: up to two opportunities per day, replanned when data changes or the app returns to the foreground.
- Local persistence and data export. AI service access tokens use device secure storage; browser tokens are session only. No automatic contact outreach.

## Connect real AI

The mobile app calls the small Node service in [`api/server.mjs`](api/server.mjs). The OpenAI key stays on the server.

```sh
cp api/.env.example api/.env
# Set OPENAI_API_KEY, OPENAI_MODEL and a strong random BOND_API_TOKEN in api/.env.
npm run api
```

Deploy this service behind HTTPS, then enter its URL and the **Bond service token** in Me → AI Connection. Do not enter the OpenAI key in the app. A browser preview can use localhost HTTP; phone builds require HTTPS. Browser use requires an exact origin in `BOND_ALLOWED_ORIGINS`.

When connected AI is enabled, tapping Send shares only the selected person's context, upcoming meeting, open commitments, and up to ten recent messages with the configured service and OpenAI. The service uses Responses API with `store: false`; this does not imply zero provider data retention. It does not persist request bodies or log private text.

This is a personal service with a shared access token and a basic request limit. Multi-user account authentication, cloud backup, remote push, and external calendar/contact integrations are still future work. Live provider calls require your API configuration and have not been verified without credentials.

## Build an installable app

```sh
npx eas-cli@latest login
npx eas-cli@latest build --platform android --profile preview
npx eas-cli@latest build --platform ios --profile preview
```

Android preview generates an APK. iOS internal distribution requires Apple signing and registered test devices. EAS account access is required. Bundling JavaScript does not produce a signed APK/IPA.

## Verify

```sh
npm run typecheck
npm run lint
npm test
npx expo export --platform all
```

The tests cover proactive timing/cadence behavior and AI service authorization, input limits, provider responses and failures. See [`PROACTIVE_MECHANISM.md`](PROACTIVE_MECHANISM.md) for the product rules.
