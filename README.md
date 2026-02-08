<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Gemini 3 Dialogue Director

Tagline: An interactive web app demonstrating multimodal reasoning and dialogue flows using the Gemini 3 API.

---

## Overview

`Gemini-3-Dialogue-Director` is a compact, user-friendly web app that demonstrates advanced reasoning and multimodal capabilities powered by the Gemini 3 API. The app lets users build, preview, and interact with dialogue flows that combine text prompts and contextual signals.

## Key features
- Interactive dialogue builder and live preview
- Multimodal prompt support (text + optional assets)
- Context-aware reasoning across turns (maintains state)
- Low-latency demo-friendly UI
- In-app prerequisites and safety checks before use

## Important note about API / token
The project is wired to use the Gemini API token implementation already included in the site. You do not need to add a local `.env` or set `GEMINI_API_KEY` unless you plan to override the built-in token behavior for development. The app performs an in-page check and will show the prerequisites modal if a required runtime token is unavailable.

---

## Run locally

**Prerequisites:** Node.js (recommended v18+), npm or yarn

1. Install dependencies:

```bash
npm install
```

2. Run the app:

```bash
npm run dev
```

3. Open `http://localhost:5173` (or the port printed by Vite).

Notes:
- If you need to provide a custom API token for development, follow the project's internal docs or contact the maintainer; the public build does not require any additional env setup.

---

## Implementation details (extracted from `index.html`)

- Page title: "Gemini 3 Dialogue Director: AI Video Storyteller" — the app is presented as an AI video storyteller and dialogue director.
- Styling and fonts:
	- TailwindCSS is loaded via CDN (`https://cdn.tailwindcss.com`) for utility-first styling.
	- The Inter font is loaded from Google Fonts.
	- A subtle radial-gradient background and a simple spinner (`.loader`) are defined inline in `index.html`.
- Module imports:
	- The app uses an `importmap` that points `react`, `react-dom`, and `@google/genai` to ESM CDN packages hosted on `esm.sh`.
	- This allows the browser to resolve modules directly from the CDN during development and lightweight deployments.
- Entry points & assets:
	- The single-page app root is the `<div id="root"></div>` element and the React entry is `index.tsx` (loaded with `type="module"`).
	- A local stylesheet `index.css` is referenced for project-specific styles.
- Notes & recommendations:
	- Using CDN-hosted modules (importmap + esm.sh) is convenient for prototypes and demo builds, but for production you may prefer bundling dependencies (Vite build) to reduce runtime CDN reliance and improve cacheability.
	- Ensure the hosting environment serves `index.html` and the static assets (`index.tsx`, `index.css`) correctly; Vite's dev server does this automatically during `npm run dev`.
