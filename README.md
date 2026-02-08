# Gemini 3 Dialogue Director: AI Video Storyteller

**Gemini 3 Dialogue Director** is an advanced interactive web application that leverages Google's Gemini AI and Cloud Text-to-Speech technologies to create dynamic, audiovisual dialogue videos. Users can generate scripts, customize voices, and produce synchronized "talking head" videos with real-time subtitles and visual effects.

<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

---

## 🚀 Key Features

### 🎬 AI Script Generation
- **Powered by Gemini:** Supports multiple models including Gemini 3 (Flash/Pro), Gemini 2.5, and Gemini 2.0.
- **Versatile Categories:** Generate scripts for specific use cases:
  - General Conversation
  - Educational / Learning
  - Podcast / Talk Show
  - Job Interview
  - Debate / Argument
  - Storytelling
- **Customizable Control:** Adjust video length (Snippet to Deep Dive), dialogue pace (Quick, Balanced, Detailed), and target language.
- **Interactive Mode:** Review and edit the AI-generated script before producing the video.

### 🗣️ Advanced Audio & TTS
- **Google Cloud TTS:** high-quality speech synthesis using Google's Cloud Text-to-Speech API.
- **Multilingual Support:** Generate audio in over 10 languages including English, Spanish, French, German, Italian, Portuguese, Japanese, Chinese, Hindi, and Marathi.
- **Voice Variety:** Access a wide range of voice types including **Studio**, **Neural2**, and **Chirp3-HD** voices.
- **Fine-Tuning:** Adjustable speaking rate (0.5x to 1.5x) for perfect timing.

### 🎥 Video Production & Customization
- **Dual-Actor System:** Seamlessly synchronized "Man" and "Woman" actors.
- **Asset Library:** Built-in library of high-quality actor clips fetched directly from GitHub.
- **Custom Uploads:** Upload your own "talking head" video files for personalized characters.
- **Aspect Ratios:** Support for **16:9 (Landscape)** and **9:16 (Portrait)** formats.
- **Real-Time Subtitles:**
  - Fully customizable font size and colors.
  - Dynamic animations: Fade, Slide Up/Down/Left/Right, and Scale (Pop).

### ⚡ Performance & Usability
- **Client-Side Rendering:** Real-time video composition using HTML5 Canvas.
- **Live Preview:** Watch the video generation process in real-time.
- **Export:** Download the final output as `.mp4` or `.webm`.
- **Screen Wake Lock:** Prevents the device from sleeping during long generation tasks.

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- **Google Cloud Context:**
  - **Gemini API Key:** For script generation.
  - **Google Cloud Project ID & Access Token:** For text-to-speech services (or appropriate API Key configuration).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/OnkarPawar1/Gemini-3-Dialogue-Director.git
   cd Gemini-3-Dialogue-Director
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open the app:**
   Navigate to `http://localhost:5173` (or the port shown in your terminal).

---

## 📖 Usage Guide

1.  **Credentials:** Open "Manage Credentials" to input your Google Cloud Project ID, TTS API Key, and Access Token.
2.  **Select Actors:** Choose "Man" and "Woman" actors from the built-in library or upload your own video files.
3.  **Script Editor:**
    *   Open the "Script Editor".
    *   Select your AI Model, Script Category, Language, and Video Settings.
    *   Enter a topic (e.g., "The future of AI") and click **Generate Script**.
    *   (Optional) Enable "Interactive Mode" to manually tweak the dialogue.
4.  **Video Settings:** Adjust aspect ratio, subtitle styles, and animations in the right-hand panel.
5.  **Generate:** Click **Generate Video** (or "Generate From Custom Script"). The app will:
    *   Generate the script (if not already done).
    *   Synthesize audio for each line.
    *   Composite the video and audio in real-time.
6.  **Download:** Once rendering is complete, click **Download Video** to save your creation.

---

## 📦 Tech Stack

- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **AI/ML:** Google GenAI SDK, Google Cloud Text-to-Speech API
- **Core:** HTML5 Canvas, MediaRecorder API
- **Assets:** GitHub API integration for dynamic asset loading

---

## License

This project is open-source. Please check the LICENSE file for details.

---

## 📺 Demos

Check out these demo videos to see the Gemini 3 Dialogue Director in action:

[![Demo 1](https://img.youtube.com/vi/2yohlzVw1bA/0.jpg)](https://youtu.be/2yohlzVw1bA)
*Demo 1: Comprehensive Walkthrough*

[![Demo 2](https://img.youtube.com/vi/0_gOqNwYLBY/0.jpg)](https://youtu.be/0_gOqNwYLBY)
*Demo 2: Interactive Script editing*

[![Demo 3](https://img.youtube.com/vi/SnrnGrk3Zcg/0.jpg)](https://youtu.be/SnrnGrk3Zcg)
*Demo 3: Custom Actor Uploads*

[![Demo 4](https://img.youtube.com/vi/nHNRGXszywE/0.jpg)](https://youtu.be/nHNRGXszywE)
*Demo 4: Advanced Features*
