# Devaharsh R — 3D Portfolio

An immersive 3D developer portfolio built with React, Three.js (`@react-three/fiber`), custom GLSL shaders, and Lenis smooth scroll. Scrolling flies the camera through a dark, misty 3D world — one room per section:

| Room | What happens |
| --- | --- |
| **Smoke chamber** (Hero) | 22k particles spell *PORTFOLIO*, morph into *DEVAHARSH*, and the portrait condenses out of real-time shader smoke with 2.5D parallax |
| **Portal** (Summary) | A breathing ring of particles frames the summary; the camera flies straight through it |
| **Monolith gallery** (Work & Internships) | Black glass slabs under light shafts (`Tech Fest System`, `HashRoot Servers`, `PACELAB Training`), each with a live animated canvas screen reflected in the floor |
| **Constellation** (Toolkit) | 16 skills across Languages, Web, Databases, Tools & OS, and Core mapped as a 3D neural network with travelling signals |
| **Towers of light** (Stack Depth) | Stack depth metrics rise from the floor as glowing 3D towers alongside B.Tech CSE & QSpiders Java Full Stack credentials |
| **Corridor of time** (Journey) | Walk through lit doorways: `2024` (B.Tech CSE, CE Kallooppara) → `2026` (HashRoot & PACELAB Internships) → `2026` (Java Full Stack Developer, QSpiders) |
| **Credentials orbit** | Six holographic cards orbit a light core; hover or tap to pull one forward |
| **Horizon** (Contact) | A procedural shader moon rises over the mist with direct email, phone, GitHub, and one-click email copy |

Built-in controls in the top navigation bar also let visitors click **Play Tour** for an automated cinematic flythrough or **Record Video** to export a 60fps `.webm` showcase video directly from the browser.

## Tech Stack

- [React 18](https://react.dev) + [Vite](https://vitejs.dev)
- [Three.js](https://threejs.org) via [React Three Fiber](https://r3f.docs.pmnd.rs) and [drei](https://github.com/pmndrs/drei)
- Custom GLSL shaders (particle morph, smoke dissolve, living portrait parallax, ground mist, procedural moon)
- [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing): bloom, film grain, vignette, SMAA
- [Lenis](https://lenis.darkroom.engineering) smooth scroll
- Self-hosted fonts via Fontsource: Inter Tight, Instrument Serif, JetBrains Mono

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL printed in the terminal (default: `http://127.0.0.1:5173/`).

## Build & Deploy

```bash
npm run build
```

Deploy the generated `dist/` folder to Vercel, Netlify, GitHub Pages, or Cloudflare Pages. The Vite config uses relative paths (`base: './'`), so it works from a subpath as well.

## Project Structure

```text
src/
  content.js        all portfolio data: projects, internships, skills, stats, journey, credentials, contact
  timeline.js       camera path, 3D room positions, and responsive desktop/mobile framing
  store.js          shared per-frame mutable state
  App.jsx           WebGL canvas, HTML overlay, and scroll setup
  lib/scroll.js     Lenis smooth scroll controller
  world/            3D rooms
    Hero.jsx          particle name morph + smoke & living portrait shader
    Gate.jsx          particle portal
    Gallery.jsx       monoliths with live canvas-drawn screens
    Constellation.jsx 3D skills network
    Towers.jsx        rising stack towers
    Corridor.jsx      lit journey doorways
    CertOrbit.jsx     orbiting credential cards
    Horizon.jsx       procedural moon + horizon light
    Environment.jsx   reflective floor, drifting dust, ground mist
    World.jsx         camera rig, fog, post-processing
  ui/               HTML overlay: text panels, nav (with Play Tour & Record Video), cursor, contact
```

## Contact

- **Name**: Devaharsh R
- **Location**: Pathanamthitta, Kerala, India
- **Email**: [devaharsh14@gmail.com](mailto:devaharsh14@gmail.com)
- **Phone**: +91 9447783643
- **GitHub**: [github.com/alend66/devaharsh](https://github.com/alend66/devaharsh)
