# Gemini 3 Dialogue Director

🏆 Built for the **Google Gemini 3 Dialogue Challenge**

Gemini 3 Dialogue Director is a web application that lets you **create, manage, and interact with intelligent AI-powered dialogue flows**.  
Build complex conversation scenarios, attach media context (images and videos), then direct dynamic dialogues with Gemini 3. From "creating interactive storytelling experiences" to "building AI tutoring systems" to "generating multimodal content."

---

## Quick Start

### Option 1: Use Online (Recommended for testing)
1. Visit the hosted application at [Gemini 3 Dialogue Director](#)
2. Open **Settings** and paste your **Gemini API Key** ([Get one here](https://aistudio.google.com/apikey))
3. Start creating dialogue flows immediately

### Option 2: Build from source

#### Prerequisites
- **Node.js** 18+
- **npm** or **yarn**
- **Gemini API Key** ([Get one from AI Studio](https://aistudio.google.com/apikey))

#### Install and run
```bash
git clone https://github.com/OnkarPawar1/Gemini-3-Dialogue-Director.git
cd Gemini-3-Dialogue-Director

npm install
npm run dev
```

The app will be available at `http://localhost:5173`

### First run
1. Open **Settings** and paste your **Gemini API Key**
2. Try **Create Dialogue** → add text and media context
3. Ask: *"Create an engaging dialogue about this topic"*

---

## What makes Gemini 3 Dialogue Director different (not a generic chatbot)

Most dialogue builders require manual scripting. Gemini 3 Dialogue Director generates and manages context dynamically.

- **AI-Powered Dialogue Generation**. Intelligently creates multi-turn conversations based on your prompts
- **Multimodal Context**. Attach images and video assets for richer dialogue understanding
- **Interactive Preview**. Split-pane view with builder on left, live preview on right
- **Multiple Dialogue Modes**. Ask, Generate, Debate, Storytelling scenarios
- **Context-Aware Reasoning**. Maintains dialogue state across turns for coherent interactions
- **Production-Ready**. Zero-config deployment with optimized Vite builds

The product is a workflow: **define context** → **build dialogue flow** → **preview interactions** → **iterate** → **deploy**.

---

## Features

| Feature | What it does |
|---|---|
| 🎬 **Multimodal Input** | Attach images and videos as context for richer dialogue generation |
| 💬 **Dialogue Builder** | Intuitive interface for designing conversation flows and turn structures |
| 👁️ **Live Preview** | Real-time visualization of dialogue interactions as you build |
| 🧠 **Context-Aware AI** | Gemini 3 understands full conversation history and maintains coherent dialogue |
| 🎙️ **Multiple Modes** | Ask, Generate, Debate, Storytelling, Tutoring, Character Simulation |
| 📚 **Asset Management** | Organize and reuse 40+ pre-loaded character images and video assets |
| 🔒 **Safety & Validation** | Built-in prerequisite checks before API interactions |
| 📱 **Responsive Design** | Works seamlessly on desktop, tablet, and mobile devices |
| 🚀 **One-Click Deploy** | Production-ready build with optimized performance |
| 🎨 **Modern UI** | Clean, accessible interface built with React and Tailwind CSS |

---

## How Gemini 3 is used

Gemini 3 Dialogue Director leverages Gemini 3 for intelligent dialogue orchestration.

| Feature | Model Used |
|---------|-----------|
| **Dialogue Generation** | Gemini 3 API (Text) |
| **Multimodal Understanding** | Gemini 3 API (Vision) - analyzes attached images/video |
| **Context Reasoning** | Gemini 3 API - maintains conversation state across turns |
| **Character Simulation** | Gemini 3 API (Text) - generates character-specific responses |
| **Dynamic Content** | Gemini 3 API - adapts dialogue based on user interactions |

**Integration Method**: All Gemini API calls go through the `@google/genai` client library (v1.40.0) with support for streaming, multimodal inputs, and structured outputs.

---

## Dialogue Modes

### 📝 Ask Mode
Ask questions about dialogue context and get AI-generated responses.
- Input: Your question + dialogue context (text, images, video)
- Output: Contextual AI response grounded in provided materials
- Use case: Quick question resolution, content understanding

### 🎬 Generate Mode
Let Gemini 3 generate entire dialogue flows based on your prompts.
- Input: Topic, tone, character count, turn count
- Output: Complete multi-turn dialogue with character assignments
- Use case: Rapid content creation, storytelling, scriptwriting

### 🎭 Debate Mode
AI takes the opposite position and argues with you.
- Input: Your statement + supporting evidence (images/text)
- Output: Counter-arguments and reasoning from the AI
- Use case: Critical thinking, argument strengthening, idea validation

### 📖 Storytelling Mode
Create narrative-driven dialogues with character development.
- Input: Story premise, characters, plot points
- Output: Engaging multi-character dialogue that advances the story
- Use case: Interactive fiction, educational scenarios, entertainment

### 🎓 Tutoring Mode
Interactive Q&A with the AI acting as both teacher and assessor.
- Input: Topic, learning objectives, student level
- Output: Explanation, quiz generation, teach-back assessment
- Use case: Education, training, knowledge reinforcement

---

## Usage

### Create a New Dialogue Flow
1. Click **New Dialogue**
2. Set the dialogue parameters:
   - Number of turns/exchanges
   - Participating characters or roles
   - Tone and style (formal, casual, narrative, etc.)

### Add Media Context
1. Click **Add Assets**
2. Choose from **40+ pre-loaded images** (character portraits) or upload your own
3. Optionally add video context from `public/video-assets/`
4. Click **Attach** to include in dialogue generation

### Preview & Iterate
| Action | What it does |
|---|---|
| **Generate** | Creates dialogue based on current settings and context |
| **Preview** | Shows real-time dialogue interaction in split-pane view |
| **Edit Turn** | Modify individual dialogue exchanges |
| **Regenerate** | Create a new version of the dialogue with same parameters |
| **Export** | Save dialogue as JSON or text format |

### After Generation
- **Review** the generated dialogue in the preview panel
- **Export** for use in other applications
- **Iterate** by adjusting parameters and regenerating
- **Deploy** to production with one click

---

## Project Structure

```
Gemini-3-Dialogue-Director/
├── public/                          # Static assets
│   ├── favicon.svg                 # Browser tab icon
│   ├── image-assets/               # 40+ character and scene images
│   │   ├── man1.jpg - man19.jpg
│   │   ├── woman1.jpg - woman20.jpg
│   │   └── [add custom images here]
│   └── video-assets/               # Video content for storytelling
│       └── [add storytelling videos here]
├── src/
│   ├── index.tsx                   # React entry point & main app logic
│   └── index.css                   # Global styles & Tailwind imports
├── index.html                      # Main HTML document with importmap
├── vite.config.ts                  # Vite build configuration
├── tsconfig.json                   # TypeScript configuration
├── tailwind.config.cjs             # Tailwind CSS theme customization
├── postcss.config.cjs              # PostCSS configuration
├── package.json                    # Project dependencies & npm scripts
├── package-lock.json               # Locked dependency versions
└── README.md                       # This file
```

---

## Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Frontend Framework** | React | 19.2 |
| **Build Tool** | Vite | 6.2 |
| **Language** | TypeScript | 5.8 |
| **Styling** | Tailwind CSS + PostCSS | Latest |
| **UI Framework** | React Components | - |
| **AI Engine** | Google Gemini 3 API | v1.40.0 |
| **API Client** | @google/genai | 1.40.0 |
| **Module System** | ES Modules (ESM) | via esm.sh |
| **Fonts** | Google Fonts (Inter) | - |

---

## Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Clean install from lock file (CI/CD)
npm ci
```

### Environment Setup

The application uses Gemini API tokens integrated into the app. For development:

```bash
# Optional: Override built-in token (development only)
GEMINI_API_KEY=your-api-key-here npm run dev
```

**Note:** The app automatically checks for API token and displays a prerequisites modal if unavailable.

### Hot Module Reloading
Changes to React components, styles, or TypeScript files automatically reload in the browser during development.

### Build Process
```bash
npm run build
# Outputs optimized files to dist/
```

The build is production-ready and can be deployed to any static hosting provider.

---

## Customization

### Update Favicon (Browser Tab Icon)
1. Replace `public/favicon.svg` with your logo
2. Supported formats: SVG (recommended), PNG, ICO
3. Hard refresh (Ctrl+Shift+R) to see changes

### Add Custom Media Assets
1. **Images**: Add JPGs/PNGs to `public/image-assets/`
2. **Videos**: Add MP4/WebM files to `public/video-assets/`
3. Assets are automatically discoverable in the app

### Customize Theme (Tailwind CSS)
Edit `tailwind.config.cjs` to customize:
- Colors and palettes
- Spacing and sizing
- Typography and fonts
- Breakpoints and responsive design

---

## Deployment

### Build for Production
```bash
npm run build
# Artifacts generated in dist/ directory
```

### Hosting Options

| Platform | Setup Time | Best For |
|----------|-----------|----------|
| **Vercel** | 2 minutes | Zero-config, Vite-optimized |
| **Netlify** | 2 minutes | GitHub integration, auto-deploys |
| **GitHub Pages** | 5 minutes | Free, built-in CI/CD |
| **AWS S3 + CloudFront** | 15 minutes | Scalable, CDN-backed |
| **Firebase Hosting** | 5 minutes | Quick setup, automatic SSL |

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## Contributing

We welcome contributions! Here's how to help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## Troubleshooting

### Issue: "npm ci" fails with lockfile error
```bash
# Solution: Regenerate lock file
npm install
git add package-lock.json
git commit -m "Update package-lock.json"
```

### Issue: Port 5173 already in use
```bash
# Solution: Change port
npm run dev -- --port 3000
```

### Issue: Favicon not updating
- Clear browser cache: **Ctrl+Shift+R** (Windows/Linux) or **Cmd+Shift+R** (Mac)
- Ensure `public/favicon.svg` exists
- Check browser console for errors

### Issue: Gemini API Key not recognized
- Go to **Settings** and verify API key is pasted correctly
- Ensure you have an active Google Cloud account
- Get a free key at [AI Studio](https://aistudio.google.com/apikey)

---

## Performance Tips

- **Code Splitting**: Vite automatically splits code for faster loading
- **Tree Shaking**: Unused code is automatically removed in production
- **CSS Optimization**: Tailwind purges unused styles in production builds
- **Image Optimization**: Use WebP format for faster loading (if supported)
- **Lazy Loading**: Import heavy components only when needed

---

## Roadmap

- ✅ Core dialogue builder and preview
- ✅ Multimodal input support (images, video)
- ✅ Live context-aware reasoning
- 🔜 Advanced dialogue templates and presets
- 🔜 Dialogue analytics and performance tracking
- 🔜 Collaboration features (teams, sharing)
- 🔜 Custom character voice synthesis
- 🔜 Mobile app (React Native)

---

## 📄 License

This project is open source and available under the **MIT License**.

---

## 👤 Creator

**Onkar Pawar**

- GitHub: [@OnkarPawar1](https://github.com/OnkarPawar1)
- Repository: [Gemini-3-Dialogue-Director](https://github.com/OnkarPawar1/Gemini-3-Dialogue-Director)

---

## 🙏 Acknowledgments

- **Google Gemini Team** - For the powerful Gemini 3 API
- **React & Vite Communities** - For excellent tooling
- **Tailwind CSS** - For utility-first CSS framework

---

## 📞 Support & Feedback

For issues, feature requests, or questions:

- 📧 Open an issue on [GitHub Issues](https://github.com/OnkarPawar1/Gemini-3-Dialogue-Director/issues)
- 💬 Check existing discussions first
- 📚 Review this README for common solutions

---

**Last Updated:** February 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅

Made with ❤️ for the Gemini 3 Challenge
