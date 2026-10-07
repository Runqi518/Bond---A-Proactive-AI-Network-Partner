---
name: Luminous Glass Relational OS
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadad9'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f3'
  surface-container: '#eeeeed'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#494738'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f0'
  outline: '#7a7866'
  outline-variant: '#cbc7b3'
  surface-tint: '#656100'
  primary: '#4c4900'
  on-primary: '#ffffff'
  primary-container: '#656100'
  on-primary-container: '#e3dd77'
  inverse-primary: '#d0ca66'
  secondary: '#2c6579'
  on-secondary: '#ffffff'
  secondary-container: '#b1e8ff'
  on-secondary-container: '#31697e'
  tertiary: '#175133'
  on-tertiary: '#ffffff'
  tertiary-container: '#326949'
  on-tertiary-container: '#abe6be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ede67f'
  primary-fixed-dim: '#d0ca66'
  on-primary-fixed: '#1e1c00'
  on-primary-fixed-variant: '#4c4900'
  secondary-fixed: '#b9eaff'
  secondary-fixed-dim: '#98cee5'
  on-secondary-fixed: '#001f29'
  on-secondary-fixed-variant: '#0a4d60'
  tertiary-fixed: '#b5f0c7'
  tertiary-fixed-dim: '#99d4ac'
  on-tertiary-fixed: '#002110'
  on-tertiary-fixed-variant: '#175133'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
  luminous-yellow: '#fff500'
  icy-soft-blue: '#a9e0f7'
  mint-sage: '#b1ecc3'
  glass-surface: rgba(255, 255, 255, 0.72)
  glass-border: rgba(255, 255, 255, 0.85)
  nav-dark-surface: rgba(18, 22, 31, 0.92)
  ambient-blue: '#dcf0fa'
  ambient-mist: '#edf6fb'
  ambient-light: '#f4f8fb'
  text-primary: '#0f172a'
  text-secondary: '#475569'
  text-muted: '#94a3b8'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: '1.35'
    letterSpacing: -0.015em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13.5px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: '0'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.03em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 0.75rem
  margin: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.875rem
  space-lg: 1.25rem
  space-xl: 1.5rem
---

## Brand & Style
This design system defines an intimate, executive-grade companion designed for relational intelligence, delicate interpersonal scenarios, and intentional communication. The brand aesthetic merges Apple-inspired frosted glassmorphism with soft, tactile "clay peek-a-boo" depth. It projects emotional lucidity, warmth, quiet luxury, and discretion.

The visual direction centers on:
- **Luminous Atmospheric Diffusion:** Multi-point pastel radial glows peeking through translucent panels, creating an airy, weightless canvas.
- **Micro-Tactile Glass:** Pure white specular edges (1.5px bevel highlights), physical inset glows, and deep backdrops with optical blurs.
- **Friendly Precision:** Rounded, soft geometries balanced by crisp structural hierarchy to ensure emotionally sensitive preparation feels both safe and authoritative.

## Colors
The palette is built upon luminous ambient gradients, frosted white planes, and deep slate anchors:

- **Primary Ambient (`#fff500` / luminous-yellow):** Used at soft opacity (15–25%) within background mesh gradients and targeted warmth highlights.
- **Secondary Atmospheric (`#a9e0f7` / icy-soft-blue):** Evokes airiness, calm focus, and mental spaciousness; drives the dominant upper backdrop tints.
- **Tertiary Renewal (`#b1ecc3` / mint-sage):** Signifies personal growth, active cadence, and healthy relational states.
- **Glass Base (`glass-surface`):** High-translucency white layer (`rgba(255, 255, 255, 0.72)`) paired with high-specular reflective borders (`rgba(255, 255, 255, 0.85)`).
- **Deep Capsule Neutral (`nav-dark-surface` & `text-primary`):** Anchors high-contrast interactions, bottom navigation capsules, and typography.

## Typography
All typographic hierarchies leverage **Plus Jakarta Sans**, offering contemporary geometric balance with clear humanist legibility.

- **Headlines (`headline-xl`, `headline-lg`, `headline-md`):** Set with negative letter-spacing for refined, modern confidence.
- **Body Text (`body-md`, `body-sm`):** Tuned for conversational scenarios, transcripts, and emotional notes with generous leading.
- **Labels (`label-md`, `label-sm`):** Slightly expanded tracking on uppercase sub-labels (`0.03em`) provides crisp badge and indicator identification.

## Layout & Spacing
The layout follows a mobile-first, centered handheld shell (max-width `28rem` / 448px) framed by standard iOS system boundaries:

- **Screen Edges & Gutters:** Fixed outer margins at `1.25rem` (20px) ensure touch targets maintain safe separation from hardware bezels. Bento and action grids rely on `0.75rem` (12px) gutters.
- **Vertical Rhythm:** Section stacks adhere to `1.25rem` gaps. Inner card items stack with `space-sm` to `space-md`.
- **System Insets:** Accommodates a standard top iOS status bar (9:41, Dynamic Island, cellular, WiFi, battery pill) and reserves `6rem` bottom clearance for the floating navigation pill.

## Elevation & Depth
Elevation is constructed via optical physics, specular highlights, and atmospheric glass rather than muddy drop shadows:

- **Hero Glass Tier:** Translucent background (`rgba(255, 255, 255, 0.72)`), backdrop filter blur of `24px`, ambient drop shadow `0 12px 32px -4px rgba(15, 23, 42, 0.06)`, and an interior top specular highlight `inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.95)` bounded by a `1px` translucent white border (`rgba(255, 255, 255, 0.85)`).
- **Secondary Cards:** Blur of `20px`, border `1px solid rgba(255, 255, 255, 0.7)`, and diffuse ambient shadow `0 8px 24px -4px rgba(15, 23, 42, 0.04)`.
- **Clay Peek-a-boo Elements:** Embedded wells and conversation pods use slightly recessed or floating fills (`bg-white/60`) paired with subtle inner shadows to evoke physical softness.
- **Floating Island Dock:** High-contrast elevation utilizing deep tinted glass (`rgba(18, 22, 31, 0.92)`), `backdrop-filter: blur(20px)`, and a grounded shadow `0 20px 40px -8px rgba(0, 0, 0, 0.25)`.

## Shapes
This design system uses a pill-shaped and continuous-curve language:

- **Containers & Major Panels:** Curved with `24px` to `32px` corner radii for smooth, organic containment.
- **Interactive Tiles & Action Cards:** Standardized on `20px` corner radii.
- **Controls, Avatars & Tags:** Full capsule pills (`rounded-full` / 9999px) for buttons, status chips, floating dock capsules, and profile masks.

## Components

### Buttons & Interactive Controls
- **Primary Tactile Pill:** White frosted base (`bg-white/90`), border `1px solid rgba(255, 255, 255, 0.9)`, inner specular highlight (`inset 0 1.5px 1px white`), and soft drop shadow. Typography is bold dark slate. Active state responds with a subtle `scale-[0.98]` depression.
- **Icon Actions:** `36x36px` rounded-full frosted circles holding centered 18px icons with soft hover and active states.

### Cards & Wells
- **Hero Scenario Card:** 28px rounded frosted surface with top status chip, bold scenario headline, contextual quote well (`bg-white/60`, rounded-2xl), and bottom primary pill CTA.
- **Contact Card:** 20px rounded frosted container featuring a 48px circular avatar with a 2px solid white border, two-line title/relationship lockup, status indicator, and right-aligned quick-action circle.

### Chips & Badges
- **Contextual Status Pills:** Semi-translucent dark tint (`rgba(15, 23, 42, 0.04)`), hairline border (`rgba(15, 23, 42, 0.06)`), and 11px uppercase label with inline status dot or mini icon.
- **Avatar Clusters:** Overlapping 32px circular images with -10px negative horizontal margins enclosed in a frosted tactile border.

### Bottom Dock
- **Fixed 3-Tab Floating Bar:** Centered pill dock (`rgba(18, 22, 31, 0.92)`) positioned above the home indicator. Contains three destinations: 'Today', 'People', and 'Me'.
- **Active Tab State:** Floating solid white pill (`bg-white`) hugging the active label in dark slate with an ambient soft glow, while inactive destinations display muted white text.