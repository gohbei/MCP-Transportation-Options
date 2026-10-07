# Project Prompts & Requirements

This document archives all prompt instructions used in the creation and iteration of the **Urban Pulse Transit** application.

---

## Prompt 1: Initial Application Specification & Design System

```text
Build me an app with screens that look like this. You can hotlink images from the HTML provided.

---
name: Urban Pulse Transit
colors:
  surface: '#0f131c'
  surface-dim: '#0f131c'
  surface-bright: '#353942'
  surface-container-lowest: '#0a0e16'
  surface-container-low: '#181c24'
  surface-container: '#1c2028'
  surface-container-high: '#262a33'
  surface-container-highest: '#31353e'
  on-surface: '#dfe2ee'
  on-surface-variant: '#bdcac0'
  inverse-surface: '#dfe2ee'
  inverse-on-surface: '#2c3039'
  outline: '#87948b'
  outline-variant: '#3e4942'
  surface-tint: '#71dba6'
  primary: '#71dba6'
  on-primary: '#003823'
  primary-container: '#00875a'
  on-primary-container: '#ffffff'
  inverse-primary: '#006c47'
  secondary: '#43dde6'
  on-secondary: '#003739'
  secondary-container: '#00c1ca'
  on-secondary-container: '#00494d'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#a66900'
  on-tertiary-container: '#ffffff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#8df7c1'
  primary-fixed-dim: '#71dba6'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005235'
  secondary-fixed: '#6bf6ff'
  secondary-fixed-dim: '#3edae3'
  on-secondary-fixed: '#002022'
  on-secondary-fixed-variant: '#004f53'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#0f131c'
  on-background: '#dfe2ee'
  surface-variant: '#31353e'
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 26px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-countdown:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 26px
    letterSpacing: -0.02em
  label-countdown-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.03em
  label-badge:
    fontFamily: Hanken Grotesk
    fontSize: 13px
    fontWeight: '800'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 0.75rem
  gutter-md: 1rem
  margin: 1rem
  margin-md: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system is engineered for ultra-fast, high-stress visual processing in dynamic urban environments. Designed for commuters navigating bustling terminals, direct sunlight, and low-light night travel, the visual aesthetic fuses High-Contrast Utilitarianism with Modern Crisp Ergonomics. Drawing inspiration from canonical transit systems like Transport for London (TfL), Citymapper, and Transit App, the interface minimizes decorative friction in favor of immediate glanceability.

The emotional tone is reliable, urgent yet calm, authoritative, and frictionless. Key interface markers—such as route pills, arrival countdowns, platform badges, and delay statuses—take center stage against clean, structural canvas layers. Micro-interactions are deliberate and snappy, reinforcing real-time kinetic awareness without overwhelming cognitive load.

## Colors

The color system is optimized for high-contrast environmental readability across day and night conditions. The default dark mode deploys a midnight charcoal foundation (#0B0F17) that minimizes glare and battery draw on OLED mobile screens, while the daylight mode offers an ultra-crisp off-white canvas (#F8FAFC) with deep obsidian slate text (#0F172A).

### Primary & Accent Palette
- Transit Emerald (#00875A): Core action driver, punctuality indicator, and on-time validation token.
- Electric Cyan (#00C2CB): Real-time GPS location beacon, active path indicator, and telemetry highlights.
- Urgent Amber (#F59E0B): Cautions, minor delays, crowded vehicles, and service advisory alerts.
- Signal Red (#DC2626): Severe disruptions, route cancellations, out-of-service alerts, and critical transit line identifiers.

### Wayfinding Route Badges
Route badges require pure distinct hues with locked high-contrast foreground pairings:
- Bus Red: #E11D48 (Foreground: #FFFFFF)
- Metro Cyan / Blue: #0284C7 (Foreground: #FFFFFF)
- Tram Emerald: #059669 (Foreground: #FFFFFF)
- Express Amber: #D97706 (Foreground: #FFFFFF)
- Night Owl Violet: #7C3AED (Foreground: #FFFFFF)

### Functional Tokens & Dark/Light Adapters
In dark mode, elevated surfaces utilize subtle shifts: Level 1 (#131B26), Level 2 (#1A2433), and Borders (#26354A). In light mode, surfaces use #FFFFFF on #F8FAFC backgrounds, with hairline dividers rendered in #E2E8F0).

## Typography

The typographic hierarchy prioritizes scan-speed, spatial economy, and numeric precision under varying ambient light conditions.
- Primary Heading Face: Hanken Grotesk gives destinations, platform headers, and wayfinding signage a contemporary, authoritative transit character.
- Body & Numerical Interface Face: Inter handles high-density schedule readouts, route instructions, service advisories, and tabular metadata.

### Tabular Numbers Requirement
All instances of real-time telemetry (countdown clocks, arrival deltas, distance estimations, platform numbers, vehicle occupancy percentages) must enable tabular figures (font-variant-numeric: tabular-nums; font-feature-settings: "tnum" 1;). This prevents layout jitter during real-time countdown increments.

## Layout & Spacing

The layout model is anchored on an 8pt spatial grid (with a strict 4pt sub-grid for badge micro-alignments). Mobile web viewport ergonomics rule the layout hierarchy: primary controls, search sheets, and line switchers occupy the lower 60% thumb-zone of the interface, with map layers and directional overviews pinned to the top.

### Responsive Breakpoints & Grids
- Mobile (<640px): Single-column fluid stack with 1rem outer canvas padding and 0.75rem vertical spacing between arrival cards. Bottom-anchored draggable bottom sheet pattern with sticky navigation triggers.
- Tablet / Split View (640px - 1024px): 2-column layout. A 380px fixed-width schedule sidebar alongside a responsive interactive map viewport. Canvas margin expands to 1.5rem.
- Desktop (>1024px): Fixed utility rails (420px max-width) floating over full-screen interactive route geometry, using 1.5rem outer margins.

## Elevation & Depth

To maximize outdoors legibility and eliminate muddy UI rendering, this system departs from fuzzy drop shadows in favor of Crisp Structural Layering, Frosted Backdrops, and Subtle Boundary Borders.

### Depth Layers
1. Canvas (Base): #0B0F17 (Dark) / #F8FAFC (Light). Hosts the map layer and underlying station layout canvas.
2. Surface Container 1 (Cards & Lists): #131B26 (Dark) / #FFFFFF (Light). Bound by a crisp 1px border (#26354A in Dark, #E2E8F0 in Light).
3. Surface Container 2 (Elevated Sheets & Floating Badges): #1A2433 (Dark) / #FFFFFF (Light). In Dark mode, this layer carries a directional ambient glow: 0px 8px 24px rgba(0, 0, 0, 0.45).
4. Frosted Translucent Headers & Nav Bars: Glassmorphism is deployed only where visibility of the map underneath is critical. Apply rgba(11, 15, 23, 0.82) with backdrop-filter: blur(16px) and a bottom border of 1px solid rgba(255, 255, 255, 0.08).

## Shapes

The design system maintains a modern, ergonomic roundedness (0.5rem / 8px base) that matches tactile handheld hardware without looking toy-like or cartoonish.
- Cards & Bottom Sheets: rounded-lg (1rem / 16px) for primary cards and floating sheets; bottom sheets clip top corners with 1.25rem (20px).
- Route Badges & Status Chips: Fully pill-shaped (9999px) to create an immediate mental model distinction between informative wayfinding metadata and interactive rectangular cards.
- Interactive Buttons: rounded-md (0.5rem / 8px) to maintain strong architectural structure.

## Components

### Buttons
- Touch Target: Minimum 48px height across all mobile configurations.
- Primary Action (Go / Start Trip): Emerald background (#00875A), #FFFFFF text, font-weight: 700. Active state scales down to 0.98 for tactile feedback.
- Secondary (Locate / Filter): Surface container 2 with a 1px border (#26354A). Text in #F8FAFC.
- Icon Button: 44x44px container, centered icon with a 20px bounding box.

### Route Badges & Chips
- Route Pill: High-contrast pill (height: 28px, padding: 0 10px, border-radius: 9999px) with bold Hanken Grotesk uppercase text.
- Glanceable Status Tags:
  - Arriving Now: Emerald tint background (rgba(0, 135, 90, 0.2)), #00C2CB or #34D399 text, pulsing live indicator dot (8px).
  - On Time / X Min: Neutral high-contrast text (#F8FAFC), Inter Tabular countdown (label-countdown).
  - Delayed: Amber background (rgba(245, 158, 11, 0.15)), text #FBBF24.
  - Crowd Levels: Three vertical bar icons (1 active bar = Green 'Low Crowd', 2 active bars = Amber 'Moderate', 3 active bars = Red 'Crowded').

### Arrival List Cards
- Structure: Two-row split format. Top row displays Route Pill, Destination title, and real-time live arrival clock right-aligned. Bottom row displays next upcoming departures (e.g., +6m, +14m), live occupancy chip, and transit mode icon (Bus, Train, Ferry).
- Interactive State: Hover/Focus elevates border color to #00C2CB. Active tap responds with immediate #1A2433 fill.

### Input Fields & Search Bars
- Height: 52px for thumb accessibility.
- Background: #131B26 (Dark) / #FFFFFF (Light) with an embedded #00C2CB search icon.
- States: Focus replaces the default border with a 2px Electric Cyan ring (#00C2CB) and box-shadow: 0 0 0 1px #00C2CB. Placeholder text styled in #64748B.

### Live Countdown Clocks
- Displayed with label-countdown-lg using Tabular Numbers.
- When an arrival is less than 60 seconds away, the numerical minutes switch to an animated pulsing "ARRIVING" pill tag with high-contrast emerald illumination.
```

---

## Prompt 2: GitHub Repository Push

```text
git push http://[GITHUB_PAT_TOKEN]@https://github.com/gohbei/MCP-Transportation-Options.git
```

---

## Prompt 3: API Architecture & Singapore LTA DataMall Integration

```text
1) create a /api folder under the project main to store all the apis
2) create a /api/health.js to monitor if the apis are working
3) integrate the LTA bus information api endpoint GET 

GET https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=04121
Header:  AccountKey: [your key from the email]

# BusStopCode is the only required parameter.
# Add &ServiceNo=7 to ask about one service only.
# Refreshes every 20 seconds. JSON comes back by default.
```

---

## Prompt 4: Git Push Verification

```text
git push
```

---

## Prompt 5: Archive Prompts Document

```text
Create a prompt.md containing all my prompts located at project main
```
