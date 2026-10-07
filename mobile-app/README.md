# Bond mobile app preview

Open [the local preview](http://localhost:4174/) after starting the server:

```sh
python3 -m http.server 4174 --directory /Users/lirunqi2/Desktop/Bond/mobile-app
```

The app implements the mobile journey in `bond-mobile-prd-v2.md`: Today opens first; People contains the four seeded Agent conversations and the Add person flow; Me contains meeting reflection. A new person opens directly into chat after their context is saved. Today actions open the relevant person's chat or rehearsal. Context, messages, reflections, action completion, and new people persist in this browser's local storage.

The preview is sized and checked for iPhone 18 Pro (402 × 874 CSS points) and Pro Max (440 × 956 CSS points). The bottom navigation has its own reserved area, with safe-area padding on a device. Today shows two complete action cards and a `more actions` control on the first Pro-sized screen; the remaining card opens fully after tapping it. All four Agent rows fit above the navigation on the Pro-sized People screen.

`assets/today2-original.png` is an exact copy of the supplied Today2 reference image (`111.png/screen.png`). The three cartoon characters are displayed from that image, without redraw or replacement. A clean HTML calendar covers the overlapping calendar text baked into the reference image. The four chat backgrounds are copied from the supplied archive.

This is a local interactive product prototype. Chat responses use local scripted examples; connecting a production AI service and native iOS packaging are future engineering steps.
