import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- Configuration ---
const LOCATION = "us-central1";
const GITHUB_REPO = "OnkarPawar1/AI-Gen-Video-Generator";
const GITHUB_BRANCH = "main";
const GITHUB_CONTENTS_BASE = `https://api.github.com/repos/${GITHUB_REPO}/contents`;

// Unique names for the built-in actors (Expanded to 19)
const manNames = ["David", "Ethan", "Andre", "Lucas", "Marco", "James", "Omar", "Leo", "Richard", "Kai", "Samuel", "Daniel", "Chris", "Alex", "Jordan", "Ryan", "Ben", "Noah", "Elijah"];
const womanNames = ["Olivia", "Sophia", "Ava", "Isabella", "Mia", "Chloe", "Elena", "Layla", "Zara", "Evelyn", "Grace", "Lily", "Hannah", "Zoe", "Nora", "Aria", "Stella", "Maya", "Emily"];

// --- Corrected Voice Data with proper language prefixes ---
const chirpMaleVoices = [
    { name: "Achird", description: "Male (Achird)" }, { name: "Algenib", description: "Male (Algenib)" },
    { name: "Algieba", description: "Male (Algieba)" }, { name: "Alnilam", description: "Male (Alnilam)" },
    { name: "Charon", description: "Male (Charon)" }, { name: "Enceladus", description: "Male (Enceladus)" },
    { name: "Fenrir", description: "Male (Fenrir)" }, { name: "Iapetus", description: "Male (Iapetus)" },
    { name: "Orus", description: "Male (Orus)" }, { name: "Puck", description: "Male (Puck)" },
    { name: "Rasalgethi", description: "Male (Rasalgethi)" }, { name: "Sadachbia", description: "Male (Sadachbia)" },
    { name: "Sadaltager", description: "Male (Sadaltager)" }, { name: "Schedar", description: "Male (Schedar)" },
    { name: "Umbriel", description: "Male (Umbriel)" }, { name: "Zubenelgenubi", description: "Male (Zubenelgenubi)" },
];
const chirpFemaleVoices = [
    { name: "Achernar", description: "Female (Achernar)" }, { name: "Aoede", description: "Female (Aoede)" },
    { name: "Autonoe", description: "Female (Autonoe)" }, { name: "Callirrhoe", description: "Female (Callirrhoe)" },
    { name: "Despina", description: "Female (Despina)" }, { name: "Erinome", description: "Female (Erinome)" },
    { name: "Gacrux", description: "Female (Gacrux)" }, { name: "Kore", description: "Female (Kore)" },
    { name: "Laomedeia", description: "Female (Laomedeia)" }, { name: "Leda", description: "Female (Leda)" },
    { name: "Pulcherrima", description: "Female (Pulcherrima)" }, { name: "Sulafat", description: "Female (Sulafat)" },
    { name: "Vindemiatrix", description: "Female (Vindemiatrix)" }, { name: "Zephyr", description: "Female (Zephyr)" },
];

const generateChirpVoices = (langPrefix: string) => ({
    male: chirpMaleVoices.map(v => ({ name: `${langPrefix}-Chirp3-HD-${v.name}`, description: v.description })),
    female: chirpFemaleVoices.map(v => ({ name: `${langPrefix}-Chirp3-HD-${v.name}`, description: v.description }))
});

const voicesData: { [key: string]: { description: string; male?: { name: string; description: string }[]; female?: { name: string; description: string }[] } } = {
    "en-US": {
        description: "English (US)",
        male: [{ name: "en-US-Studio-M", description: "Male (Studio M)" }, ...generateChirpVoices("en-US").male],
        female: [{ name: "en-US-Studio-O", description: "Female (Studio O)" }, ...generateChirpVoices("en-US").female]
    },
    "en-GB": {
        description: "English (UK)",
        male: [{ name: "en-GB-Studio-B", description: "Male (Studio B)" }, ...generateChirpVoices("en-GB").male],
        female: [{ name: "en-GB-Studio-A", description: "Female (Studio A)" }, ...generateChirpVoices("en-GB").female]
    },
    "es-ES": {
        description: "Spanish (Spain)",
        male: [{ name: "es-ES-Neural2-B", description: "Male (Neural2 B)" }, ...generateChirpVoices("es-ES").male],
        female: [{ name: "es-ES-Neural2-F", description: "Female (Neural2 F)" }, ...generateChirpVoices("es-ES").female]
    },
    "es-US": {
        description: "Spanish (US)",
        ...generateChirpVoices("es-US")
    },
    "fr-FR": {
        description: "French (France)",
        male: [{ name: "fr-FR-Studio-D", description: "Male (Studio D)" }, ...generateChirpVoices("fr-FR").male],
        female: [{ name: "fr-FR-Studio-A", description: "Female (Studio A)" }, ...generateChirpVoices("fr-FR").female]
    },
    "fr-CA": {
        description: "French (Canada)",
        ...generateChirpVoices("fr-CA")
    },
    "de-DE": {
        description: "German (Germany)",
        male: [{ name: "de-DE-Studio-B", description: "Male (Studio B)" }, ...generateChirpVoices("de-DE").male],
        female: [{ name: "de-DE-Studio-A", description: "Female (Studio A)" }, ...generateChirpVoices("de-DE").female]
    },
    "it-IT": {
        description: "Italian (Italy)",
        ...generateChirpVoices("it-IT")
    },
    "pt-BR": {
        description: "Portuguese (Brazil)",
        ...generateChirpVoices("pt-BR")
    },
    "ja-JP": {
        description: "Japanese (Japan)",
        male: [{ name: "ja-JP-Wavenet-D", description: "Male (Wavenet D)" }, ...generateChirpVoices("ja-JP").male],
        female: [{ name: "ja-JP-Wavenet-C", description: "Female (Wavenet C)" }, ...generateChirpVoices("ja-JP").female]
    },
    "cmn-CN": {
        description: "Mandarin Chinese",
        ...generateChirpVoices("cmn-CN")
    },
    "hi-IN": {
        description: "Hindi (India)",
        male: [{ name: "hi-IN-Wavenet-B", description: "Male (Wavenet B)" }, ...generateChirpVoices("hi-IN").male],
        female: [{ name: "hi-IN-Wavenet-A", description: "Female (Wavenet A)" }, ...generateChirpVoices("hi-IN").female]
    },
    "mr-IN": {
        description: "Marathi (India)",
        ...generateChirpVoices("mr-IN")
    },
    "ar-XA": {
        description: "Arabic",
        male: chirpMaleVoices.map(v => ({ name: `ar-XA-Chirp3-HD-${v.name}`, description: v.description })),
        female: chirpFemaleVoices.map(v => ({ name: `ar-XA-Chirp3-HD-${v.name}`, description: v.description }))
    }
};

interface DialogueLine {
    speaker: 'man' | 'woman';
    text: string;
    audio: { blob: Blob; duration: number } | null;
}

interface VideoAsset {
    label: string;
    videoUrl: string;
    thumbnail: string | null;
}

interface SubtitleStyle {
    text: string;
}

interface OverlayState {
    title: string;
    showSubtitles: boolean;
    currentSubtitle: { text: string; speaker: 'man' | 'woman' | ''; startTime: number; duration: number };
    subtitleFontSize: number;
    subtitleStyles: { man: SubtitleStyle; woman: SubtitleStyle };
    subtitleAnimation: string;
}

// Generic Input Component
const InputGroup: React.FC<{ id: string; label: string; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; placeholder?: string; rows?: number; accept?: string; disabled?: boolean; className?: string }> = ({ id, label, type = "text", value, onChange, placeholder, rows, accept, disabled, className }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        {type === "textarea" ? (
            <textarea
                id={id}
                rows={rows}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${disabled ? 'bg-gray-100' : ''} ${className}`}
                aria-label={label}
            />
        ) : (
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                accept={accept}
                disabled={disabled}
                className={`mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${disabled ? 'bg-gray-100' : ''} ${className}`}
                aria-label={label}
            />
        )}
    </div>
);

// Generic Select Component
const SelectGroup: React.FC<{ id: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: { value: string; label: string; optgroup?: string; disabled?: boolean }[]; disabled?: boolean; className?: string }> = ({ id, label, value, onChange, options, disabled, className }) => {
    const renderOptions = () => {
        const optionGroups: { [key: string]: { value: string; label: string; disabled?: boolean }[] } = {};
        options.forEach(option => {
            if (option.optgroup) {
                if (!optionGroups[option.optgroup]) {
                    optionGroups[option.optgroup] = [];
                }
                optionGroups[option.optgroup].push(option);
            } else {
                if (!optionGroups[""]) {
                    optionGroups[""] = [];
                }
                optionGroups[""].push(option);
            }
        });

        return Object.entries(optionGroups).map(([groupName, groupOptions]) => {
            if (groupName) {
                return (
                    <optgroup key={groupName} label={groupName}>
                        {groupOptions.map(option => (
                            <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>
                        ))}
                    </optgroup>
                );
            } else {
                return groupOptions.map(option => (
                    <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>
                ));
            }
        });
    };

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
            <select
                id={id}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${disabled ? 'bg-gray-100' : ''} ${className}`}
                aria-label={label}
            >
                {renderOptions()}
            </select>
        </div>
    );
};

// Generic Slider Component
const SliderInput: React.FC<{ id: string; label: string; min: number; max: number; value: number; step: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; unit?: string; disabled?: boolean }> = ({ id, label, min, max, value, step, onChange, unit = '', disabled }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}: <span className="font-semibold">{value.toFixed(unit ? 1 : 0)}{unit}</span>
        </label>
        <input
            type="range"
            id={id}
            min={min}
            max={max}
            value={value}
            step={step}
            onChange={onChange}
            disabled={disabled}
            className={`mt-1 w-full h-10 bg-gray-200 rounded-lg appearance-none cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label={label}
        />
    </div>
);

// Generic Color Picker Component
const ColorPicker: React.FC<{ id: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; className?: string; disabled?: boolean }> = ({ id, label, value, onChange, className, disabled }) => (
    <div>
        <label htmlFor={id} className="block text-xs font-medium text-gray-600">{label}</label>
        <input
            type="color"
            id={id}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`mt-1 p-1 h-10 w-full block border border-gray-300 rounded-md cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
            aria-label={label}
        />
    </div>
);

// Modal Base Component
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex justify-center items-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 m-auto">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close modal"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="mt-4 space-y-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

// Credentials Modal Component
const CredentialsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    isLoading: boolean;
    projectId: string;
    setProjectId: (id: string) => void;
    ttsApiKey: string;
    setTtsApiKey: (key: string) => void;
    vertexAccessToken: string;
    setVertexAccessToken: (token: string) => void;
    fillDefaultCredentials: () => void;
}> = ({ isOpen, onClose, isLoading, projectId, setProjectId, ttsApiKey, setTtsApiKey, vertexAccessToken, setVertexAccessToken, fillDefaultCredentials }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Manage Credentials">
            <div className="space-y-4">
                <InputGroup
                    id="project_id_input_modal" label="Google Cloud Project ID (Legacy for Vertex AI)" value={projectId} onChange={(e) => setProjectId(e.target.value)}
                    placeholder="e.g., PROJECT_ID-..."
                    disabled={isLoading}
                />
                <InputGroup
                    id="tts_api_key_input_modal" label="Text-to-Speech API Key" value={ttsApiKey} onChange={(e) => setTtsApiKey(e.target.value)}
                    placeholder="Your Google TTS API Key..."
                    disabled={isLoading}
                />
                <InputGroup
                    id="token_input_modal" label="Vertex AI Access Token (Legacy for Vertex AI)" type="textarea" rows={2} value={vertexAccessToken} onChange={(e) => setVertexAccessToken(e.target.value)}
                    placeholder="Paste your gcloud auth print-access-token here..."
                    disabled={isLoading}
                />
                <div className="flex justify-end pt-2">
                    <button onClick={fillDefaultCredentials} className="px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 mr-2" disabled={isLoading} aria-label="Use default credentials">Use Defaults</button>
                    {/* Changed button text to "Save & Close" */}
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300" disabled={isLoading}>Save & Close</button>
                </div>
            </div>
        </Modal>
    );
};

// Script Editor Modal Component
const ScriptEditorModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    isLoading: boolean;
    scriptPrompt: string;
    setScriptPrompt: (prompt: string) => void;
    modelId: string;
    setModelId: (id: string) => void;
    videoLength: string;
    setVideoLength: (length: string) => void;
    scriptLanguage: string;
    setScriptLanguage: (lang: string) => void;
    scriptCategory: string;
    setScriptCategory: (cat: string) => void;
    dialoguePace: string;
    setDialoguePace: (pace: string) => void;
    fullPrompt: string;
    setFullPrompt: (prompt: string) => void;
    isInteractiveMode: boolean;
    setIsInteractiveMode: (mode: boolean) => void;
    generatedScript: string;
    setGeneratedScript: (script: string) => void;
    handleScriptGenerationFunction: (prompt: string, modelId: string) => Promise<string>;
    scriptLanguageOptions: { value: string; label: string }[];
}> = ({
    isOpen, onClose, isLoading, scriptPrompt, setScriptPrompt,
    modelId, setModelId, videoLength, setVideoLength, scriptLanguage, setScriptLanguage,
    scriptCategory, setScriptCategory,
    dialoguePace, setDialoguePace,
    fullPrompt, setFullPrompt, isInteractiveMode, setIsInteractiveMode, generatedScript, setGeneratedScript,
    handleScriptGenerationFunction, scriptLanguageOptions
}) => {

    const handleInternalScriptGeneration = async () => {
        if (!scriptPrompt) {
            alert("Please enter a Script Topic to generate a script.");
            return;
        }
        try {
            // No explicit status message here, as modal shouldn't control global app status
            // The main app's isLoading will cover this visually.
            const script = await handleScriptGenerationFunction(fullPrompt, modelId);
            setGeneratedScript(script);
        } catch (error: any) {
            console.error("Script generation failed in modal:", error);
            alert(`Script generation failed: ${error.message}`); // Provide alert to user
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Script Editor & AI Prompt">
            <div className="space-y-4">
                <SelectGroup
                    id="model_select_modal" label="AI Model for Script" value={modelId} onChange={(e) => setModelId(e.target.value)}
                    options={[
                        { optgroup: "Gemini 3", value: "gemini-3-flash-preview", label: "Gemini 3 Flash (Preview)" },
                        { optgroup: "Gemini 3", value: "gemini-3-pro-preview", label: "Gemini 3 Pro (Preview)" },
                        { optgroup: "Gemini 2.5", value: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
                        { optgroup: "Gemini 2.5", value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
                        { optgroup: "Gemini 2.5", value: "gemini-2.5-flash-lite-preview-06-17", label: "Gemini 2.5 Flash-Lite (Preview)" },
                        { optgroup: "Gemini 2.0", value: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
                        { optgroup: "Gemini 2.0", value: "gemini-2.0-flash-lite", label: "Gemini 2.0 Flash-Lite" },
                    ]}
                    disabled={isLoading}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SelectGroup
                        id="script_category_select_modal" label="Script Category" value={scriptCategory} onChange={(e) => setScriptCategory(e.target.value)}
                        options={[
                            { value: "General", label: "General Conversation" },
                            { value: "Educational", label: "Educational / Learning" },
                            { value: "Podcast", label: "Podcast / Talk Show" },
                            { value: "Interview", label: "Job Interview" },
                            { value: "Debate", label: "Debate / Argument" },
                            { value: "Storytelling", label: "Storytelling" },
                        ]}
                        disabled={isLoading}
                    />
                     <SelectGroup
                        id="script_language_select_modal" label="Script Language" value={scriptLanguage} onChange={(e) => setScriptLanguage(e.target.value)}
                        options={scriptLanguageOptions}
                        disabled={isLoading}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SelectGroup
                        id="video_length_select_modal" label="Video Length" value={videoLength} onChange={(e) => setVideoLength(e.target.value)}
                        options={[
                            { value: "2-6", label: "Snippet (2-6 lines)" },
                            { value: "7-15", label: "Concise (7-15 lines)" },
                            { value: "16-25", label: "Brief (16-25 lines)" },
                            { value: "26-40", label: "Standard (26-40 lines)" },
                            { value: "41-70", label: "Expanded (41-70 lines)" },
                            { value: "71-110", label: "Detailed (71-110 lines)" },
                            { value: "111-150", label: "Comprehensive (111-150 lines)" },
                            { value: "151-179", label: "Extensive (151-179 lines)" },
                            { value: "180-190", label: "Long (180-190 lines)" },
                            { value: "191-250", label: "Deep Dive (191-250 lines)" },
                        ]}
                        disabled={isLoading}
                    />
                     <SelectGroup
                        id="dialogue_pace_select_modal" label="Dialogue Pace / Turn Length" value={dialoguePace} onChange={(e) => setDialoguePace(e.target.value)}
                        options={[
                            { value: "Quick", label: "Quick / Snappy (Short turns)" },
                            { value: "Balanced", label: "Natural / Balanced" },
                            { value: "Detailed", label: "Detailed / Explanatory (Longer turns)" },
                        ]}
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <InputGroup
                        id="script_prompt_input_modal" label="Script Topic" type="textarea" rows={2} value={scriptPrompt} onChange={(e) => setScriptPrompt(e.target.value)}
                        placeholder="e.g., A brief, friendly argument about whether pineapple belongs on pizza."
                        disabled={isLoading}
                    />
                    <div className="mt-3">
                        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                            <input
                                type="checkbox" id="interactive_mode_toggle_modal"
                                checked={isInteractiveMode} onChange={(e) => setIsInteractiveMode(e.target.checked)}
                                disabled={isLoading}
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            Interactive Script Mode (Edit script before generating)
                        </label>
                    </div>
                </div>
                <InputGroup
                    id="full_prompt_input_modal" label="Full AI Prompt (Editable)" type="textarea" rows={6} value={fullPrompt} onChange={(e) => setFullPrompt(e.target.value)}
                    disabled={isLoading}
                    className="bg-gray-50"
                />

                <div className="flex justify-between items-center pt-2">
                    <button
                        onClick={handleInternalScriptGeneration}
                        disabled={isLoading || !scriptPrompt}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        aria-label="Generate script preview"
                    >
                        {isLoading ? 'Generating Script...' : 'Generate Script (Preview)'}
                    </button>
                    {/* Changed button text to "Save & Close" */}
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300" disabled={isLoading}>Save & Close</button>
                </div>

                {generatedScript && (
                    <div className="w-full p-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
                        <h4 className="text-md font-semibold text-gray-800 mb-2">Generated Script Preview</h4>
                        <textarea
                            id="script_text_area_modal"
                            rows={8}
                            className="w-full text-sm text-gray-700 whitespace-pre-wrap font-sans bg-white p-3 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 resize-y"
                            value={generatedScript}
                            onChange={(e) => setGeneratedScript(e.target.value)}
                            readOnly={!isInteractiveMode}
                            aria-label="Generated script editor"
                        ></textarea>
                    </div>
                )}
            </div>
        </Modal>
    );
};


const App: React.FC = () => {
    // Refs for video and canvas elements
    const videoCanvasRef = useRef<HTMLCanvasElement>(null);
    const manVideoPlayerRef = useRef<HTMLVideoElement>(null);
    const womanVideoPlayerRef = useRef<HTMLVideoElement>(null);
    const audioPlayerRef = useRef<HTMLAudioElement>(null);

    // State for modals
    const [showCredentialsModal, setShowCredentialsModal] = useState<boolean>(false);
    const [showScriptEditorModal, setShowScriptEditorModal] = useState<boolean>(false);

    // State for credentials and main inputs
    const [projectId, setProjectId] = useState<string>('');
    const [ttsApiKey, setTtsApiKey] = useState<string>('');
    const [vertexAccessToken, setVertexAccessToken] = useState<string>('');
    const [scriptPrompt, setScriptPrompt] = useState<string>('');
    const [fullPrompt, setFullPrompt] = useState<string>('');
    const [videoTitle, setVideoTitle] = useState<string>('');

    // State for selectors and sliders
    const [modelId, setModelId] = useState<string>('gemini-2.5-flash');
    const [videoLength, setVideoLength] = useState<string>('2-6');
    const [scriptLanguage, setScriptLanguage] = useState<string>('English');
    const [scriptCategory, setScriptCategory] = useState<string>('General');
    const [dialoguePace, setDialoguePace] = useState<string>('Balanced');
    const [aspectRatio, setAspectRatio] = useState<string>('16:9');
    const [speakingRate, setSpeakingRate] = useState<number>(1.0);
    const [voiceLanguage, setVoiceLanguage] = useState<string>('en-US');
    const [manVoiceConfig, setManVoiceConfig] = useState<string>('');
    const [womanVoiceConfig, setWomanVoiceConfig] = useState<string>('');
    const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
    const [subtitleFontSize, setSubtitleFontSize] = useState<number>(26);
    const [manSubtitleTextColor, setManSubtitleTextColor] = useState<string>('#FFFFFF');
    const [womanSubtitleTextColor, setWomanSubtitleTextColor] = useState<string>('#FFFFFF');
    const [subtitleAnimation, setSubtitleAnimation] = useState<string>('fade');

    // State for built-in video library
    const [manVideoAssets, setManVideoAssets] = useState<VideoAsset[]>([]);
    const [womanVideoAssets, setWomanVideoAssets] = useState<VideoAsset[]>([]);
    const [selectedManVideo, setSelectedManVideo] = useState<string>('');
    const [selectedWomanVideo, setSelectedWomanVideo] = useState<string>('');

    // State for UI control and feedback
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [isInteractiveMode, setIsInteractiveMode] = useState<boolean>(false);
    const [generatedScript, setGeneratedScript] = useState<string>('');
    // const [displayScriptArea, setDisplayScriptArea] = useState<boolean>(false); // This is now controlled by the modal's isOpen

    // Global mutable refs for internal video/audio state
    const recordedChunks = useRef<Blob[]>([]);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const animationFrameId = useRef<number | null>(null);
    const backgroundVideoRefs = useRef<{ man: HTMLVideoElement | null; woman: HTMLVideoElement | null }>({ man: null, woman: null });
    const activeVideoRef = useRef<HTMLVideoElement | null>(null);
    const overlayStateRef = useRef<OverlayState>({
        title: '',
        showSubtitles: true,
        currentSubtitle: { text: '', speaker: '', startTime: 0, duration: 250 },
        subtitleFontSize: 26,
        subtitleStyles: { man: { text: '#FFFFFF' }, woman: { text: '#FFFFFF' } },
        subtitleAnimation: 'fade'
    });
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const audioDestinationRef = useRef<MediaStreamAudioDestinationNode | null>(null);
    const wakeLockRef = useRef<WakeLockSentinel | null>(null);

    // --- Utility Functions ---

    const fetchJsonOrThrow = useCallback(async (url: string, contextLabel: string) => {
        const response = await fetch(url, { headers: { 'Accept': 'application/vnd.github+json' } });
        if (!response.ok) {
            throw new Error(`${contextLabel} request failed (${response.status})`);
        }
        return response.json();
    }, []);

    const extractNumericSuffix = useCallback((value: string, prefix: string) => {
        const numericPart = value.replace(prefix, '').replace(/\.mp4$/i, '').replace(/\D/g, '');
        const parsed = parseInt(numericPart, 10);
        return Number.isNaN(parsed) ? 0 : parsed;
    }, []);

    const buildVideoLibrary = useCallback((videoItems: any[], prefix: 'man' | 'woman', imageMap: { [key: string]: string }) => {
        const names = prefix === 'man' ? manNames : womanNames;
        return videoItems
            .filter(item => item.name && item.name.startsWith(prefix) && item.download_url)
            .sort((a, b) => {
                const suffixA = extractNumericSuffix(a.name, prefix);
                const suffixB = extractNumericSuffix(b.name, prefix);
                return suffixA - suffixB;
            })
            .map((item, index) => {
                const baseName = item.name.replace(/\.mp4$/i, '');
                const label = names[index] || `${prefix === 'man' ? 'Man' : 'Woman'} ${index + 1}`;
                return {
                    label: label,
                    videoUrl: item.download_url,
                    thumbnail: imageMap[baseName] || null
                };
            });
    }, [extractNumericSuffix]);

    // --- Handlers for UI state updates (moved or adjusted for modals) ---

    // Note: ScriptPrompt, ModelId, VideoLength, ScriptLanguage, FullPrompt, InteractiveMode, GeneratedScript
    // are primarily handled within ScriptEditorModal state, but App still needs to own them for generation logic.

    const handleAspectRatioSelectChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setAspectRatio(e.target.value);
    }, []);

    const handleSpeakingRateSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSpeakingRate(parseFloat(e.target.value));
    }, []);

    const handleLanguageSelectChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setVoiceLanguage(e.target.value);
    }, []);

    const handleManVoiceSelectChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setManVoiceConfig(e.target.value);
    }, []);

    const handleWomanVoiceSelectChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setWomanVoiceConfig(e.target.value);
    }, []);

    const handleShowSubtitlesToggle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setShowSubtitles(e.target.checked);
    }, []);

    const handleSubtitleFontSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSubtitleFontSize(parseInt(e.target.value, 10));
    }, []);

    const handleManSubtitleTextColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setManSubtitleTextColor(e.target.value);
    }, []);

    const handleWomanSubtitleTextColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setWomanSubtitleTextColor(e.target.value);
    }, []);

    const handleSubtitleAnimationSelectChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setSubtitleAnimation(e.target.value);
    }, []);

    const handleVideoTitleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setVideoTitle(e.target.value);
    }, []);


    // --- Core Logic Functions ---

    const updateFullPrompt = useCallback(() => {
        const topic = scriptPrompt;
        const currentVideoLength = videoLength;
        const currentScriptLanguage = scriptLanguage;
        const currentCategory = scriptCategory;
        const currentPace = dialoguePace;

        let linesInstruction = "";
        switch (currentVideoLength) {
            case "2-6": linesInstruction = "between 2 and 6 lines"; break;
            case "7-15": linesInstruction = "between 7 and 15 lines"; break;
            case "16-25": linesInstruction = "between 16 and 25 lines"; break;
            case "26-40": linesInstruction = "between 26 and 40 lines"; break;
            case "41-70": linesInstruction = "between 41 and 70 lines"; break;
            case "71-110": linesInstruction = "between 71 and 110 lines"; break;
            case "111-150": linesInstruction = "between 111 and 150 lines"; break;
            case "151-179": linesInstruction = "between 151 and 179 lines"; break;
            case "180-190": linesInstruction = "between 180 and 190 lines"; break;
            case "191-250": linesInstruction = "between 191 and 250 lines"; break;
            default: linesInstruction = "a moderate number of lines";
        }

        let categoryInstruction = "";
        switch (currentCategory) {
            case "Educational":
                categoryInstruction = "Create an educational dialogue where one person explains complex concepts related to the topic to the other in a clear, engaging way. Use analogies if helpful.";
                break;
            case "Podcast":
                categoryInstruction = "Write a lively, casual podcast script. Include friendly banter, maybe a brief intro, and discuss the topic enthusiastically.";
                break;
            case "Interview":
                categoryInstruction = "Simulate a formal interview. One person is the interviewer asking insightful questions, and the other is the expert or candidate answering them.";
                break;
            case "Debate":
                categoryInstruction = "Write a civil but spirited debate. One person supports the topic/premise, while the other offers counter-arguments or a different perspective.";
                break;
            case "Storytelling":
                categoryInstruction = "The characters should be narrating or acting out a story related to the topic. It should feel narrative and descriptive through dialogue.";
                break;
            default: // General
                categoryInstruction = "Generate a natural, conversational dialogue between two people discussing the topic.";
                break;
        }

        let paceInstruction = "";
        switch (currentPace) {
            case "Quick":
                paceInstruction = "Keep the conversation fast-paced and snappy. Speakers should use short sentences (1-2 sentences max per turn). Avoid long monologues. The goal is quick back-and-forth interaction.";
                break;
            case "Detailed":
                paceInstruction = "Encourage detailed, in-depth responses. Speakers should use longer turns (paragraphs or multiple sentences of 5+ lines) to fully explain their thoughts or arguments. Do not be afraid of length per turn.";
                break;
            default: // Balanced
                paceInstruction = "Maintain a natural conversational rhythm. Use a mix of short reactions and moderate-length explanations (2-4 sentences). It should feel like a real chat with a good flow.";
                break;
        }

        const promptTemplate = `${categoryInstruction}

Strictly follow these style instructions:
Topic: "${topic}".
Language: ${currentScriptLanguage}.
Length Constraint: The script must be ${linesInstruction} long in total.
Dialogue Style: ${paceInstruction}

Strictly follow this format for every line:
Man: [Text]
Woman: [Text]

Do not include any scene directions, sound effects, or parentheticals (like *laughs*). Your response must only contain the dialogue lines starting with "Man:" or "Woman:".`;

        setFullPrompt(promptTemplate);
    }, [scriptPrompt, videoLength, scriptLanguage, scriptCategory, dialoguePace]);

    // Effect to update full prompt whenever its dependencies change
    useEffect(() => {
        updateFullPrompt();
    }, [scriptPrompt, videoLength, scriptLanguage, scriptCategory, dialoguePace, updateFullPrompt]);

    const fillDefaultCredentials = useCallback(() => {
        setProjectId('Get_PROJECT_ID');
        setTtsApiKey('Get_API_KEY');
        setVertexAccessToken('Get_ACCESS_TOKEN'); // Keeping this as a legacy input for Vertex AI usage beyond GenAI SDK.
    }, []);

    const populateScriptLanguages = useCallback(() => {
        const languages = {
            "English": "English", "Spanish": "Spanish", "French": "French",
            "German": "German", "Italian": "Italian", "Portuguese": "Portuguese",
            "Japanese": "Japanese", "Mandarin Chinese": "Mandarin Chinese", "Hindi": "Hindi", "Marathi": "Marathi", "Arabic": "Arabic"
        };
        return Object.entries(languages).map(([name, value]) => ({ value, label: name }));
    }, []);

    const populateVoices = useCallback((langCode: string) => {
        const language = voicesData[langCode];
        if (!language) return { manOptions: [], womanOptions: [] };

        const createVoiceOptions = (voices: { name: string; description: string }[]) => {
            if (!voices || voices.length === 0) {
                return [{ value: '', label: "No voices available", disabled: true }];
            }
            return voices.map(voice => ({
                value: JSON.stringify({ languageCode: langCode, name: voice.name }),
                label: voice.description
            }));
        };

        return {
            manOptions: createVoiceOptions(language.male || []),
            womanOptions: createVoiceOptions(language.female || [])
        };
    }, []);

    // Effect to populate voice options when voiceLanguage changes
    useEffect(() => {
        const { manOptions, womanOptions } = populateVoices(voiceLanguage);
        if (manOptions.length > 0) {
            setManVoiceConfig(manOptions[0].value);
        } else {
            setManVoiceConfig('');
        }
        if (womanOptions.length > 0) {
            setWomanVoiceConfig(womanOptions[0].value);
        } else {
            setWomanVoiceConfig('');
        }
    }, [voiceLanguage, populateVoices]);


    const setupCanvasAndContainer = useCallback(() => {
        const canvas = videoCanvasRef.current;
        if (!canvas) return;

        const container = canvas.parentElement; // Assuming parent is output_container
        if (!container) return;

        container.classList.remove('aspect-[9/16]', 'aspect-[16/9]');
        container.classList.add(`aspect-[${aspectRatio.replace(':', '/')}]`);

        if (aspectRatio === '16:9') {
            canvas.width = 1280;
            canvas.height = 720;
        } else { // 9:16
            canvas.width = 720;
            canvas.height = 1280;
        }
    }, [aspectRatio]);

    const handleVideoUpload = useCallback((file: File | null, speaker: 'man' | 'woman') => {
        const playerElement = speaker === 'man' ? manVideoPlayerRef.current : womanVideoPlayerRef.current;
        if (file && playerElement) {
            const fileURL = URL.createObjectURL(file);
            playerElement.crossOrigin = 'anonymous';
            playerElement.src = fileURL;
            playerElement.load();
            playerElement.classList.remove('hidden');
            backgroundVideoRefs.current[speaker] = playerElement;

            if (speaker === 'man') {
                setSelectedManVideo('');
            } else {
                setSelectedWomanVideo('');
            }
        }
    }, []);

    const handleVideoLibrarySelection = useCallback((value: string, speaker: 'man' | 'woman') => {
        // Update the selected state
        if (speaker === 'man') {
            setSelectedManVideo(value);
            // Clear custom upload input visually
            (document.getElementById('man_video_input') as HTMLInputElement).value = '';
        } else {
            setSelectedWomanVideo(value);
            // Clear custom upload input visually
            (document.getElementById('woman_video_input') as HTMLInputElement).value = '';
        }

        const playerElement = speaker === 'man' ? manVideoPlayerRef.current : womanVideoPlayerRef.current;
        if (!playerElement) return;

        if (!value) {
            playerElement.src = '';
            playerElement.classList.add('hidden');
            backgroundVideoRefs.current[speaker] = null;
            return;
        }

        let assetConfig: VideoAsset | null = null;
        try {
            assetConfig = JSON.parse(value); // Parses the stringified asset
        } catch (err) {
            console.error('Invalid library selection payload', err);
            return;
        }
        if (!assetConfig?.videoUrl) return;

        playerElement.crossOrigin = 'anonymous';
        playerElement.src = assetConfig.videoUrl; // Sets the video source
        playerElement.load();
        playerElement.classList.remove('hidden');
        backgroundVideoRefs.current[speaker] = playerElement;
    }, []);

    const initializeVideoLibrary = useCallback(async () => {
        try {
            const [videoItems, imageItems] = await Promise.all([
                fetchJsonOrThrow(`${GITHUB_CONTENTS_BASE}/video-assets?ref=${GITHUB_BRANCH}`, 'video assets'),
                fetchJsonOrThrow(`${GITHUB_CONTENTS_BASE}/image-assets?ref=${GITHUB_BRANCH}`, 'image assets')
            ]);
            const imageMap = imageItems.reduce((acc: { [key: string]: string }, file: any) => {
                const key = file.name ? file.name.replace(/\.[^/.]+$/, '') : '';
                if (key) acc[key] = file.download_url;
                return acc;
            }, {});

            const manAssets = buildVideoLibrary(videoItems, 'man', imageMap);
            const womanAssets = buildVideoLibrary(videoItems, 'woman', imageMap);

            setManVideoAssets(manAssets);
            setWomanVideoAssets(womanAssets);

            // Select initial values and load videos after assets are fully loaded and set
            if (manAssets.length > 0) {
                const defaultManVideo = JSON.stringify(manAssets[0]);
                setSelectedManVideo(defaultManVideo);
                handleVideoLibrarySelection(defaultManVideo, 'man');
            }
            if (womanAssets.length > 0) {
                const defaultWomanVideo = JSON.stringify(womanAssets[0]);
                setSelectedWomanVideo(defaultWomanVideo);
                handleVideoLibrarySelection(defaultWomanVideo, 'woman');
            }

        } catch (error: any) {
            console.error('Failed to load built-in assets:', error);
            setErrorMessage(`Failed to load built-in actors: ${error.message}`);
            setManVideoAssets([]);
            setWomanVideoAssets([]);
        }
    }, [fetchJsonOrThrow, buildVideoLibrary, handleVideoLibrarySelection]);

    const handleScriptGeneration = useCallback(async (prompt: string, modelId: string) => {
        // Initialize GoogleGenAI with process.env.API_KEY as per guidelines
        // The `tokenInput` and `projectIdInput` are NOT used for this as they are for Vertex AI direct calls.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const geminiModel = modelId; // The model ID from state

        try {
            // setStatusMessage('Generating AI script...'); // This status message will be handled by the main app
            const response = await ai.models.generateContent({
                model: geminiModel,
                contents: [{ role: "user", parts: [{ text: prompt }] }],
            });

            const script = response.text?.trim();

            if (!script) {
                throw new Error("AI Script Generation returned no content. The model may be unavailable.");
            }
            return script;
        } catch (error: any) {
            if (error.message.includes("403") || error.message.includes("API key")) {
                throw new Error("AI Script Generation failed. Please check your API key and ensure it has access to the Gemini API. Error: " + error.message);
            }
            throw new Error(`AI Script Generation failed: ${error.message}`);
        }
    }, []);

    const getAudioDuration = useCallback(async (audioBlob: Blob): Promise<number> => {
        const audioUrl = URL.createObjectURL(audioBlob);
        return new Promise((resolve, reject) => {
            const tempAudio = new Audio(audioUrl);
            tempAudio.addEventListener('loadedmetadata', () => {
                URL.revokeObjectURL(audioUrl);
                resolve(tempAudio.duration);
            });
            tempAudio.addEventListener('error', (e) => {
                URL.revokeObjectURL(audioUrl);
                // Fix: Access media error details from tempAudio.error, as 'e' (Event) does not have 'message'.
                const mediaError = tempAudio.error;
                let errorMessage = 'unknown media error';
                if (mediaError) {
                    switch (mediaError.code) {
                        case MediaError.MEDIA_ERR_ABORTED:
                            errorMessage = 'Playback aborted.';
                            break;
                        case MediaError.MEDIA_ERR_NETWORK:
                            errorMessage = 'Network error during download.';
                            break;
                        case MediaError.MEDIA_ERR_DECODE:
                            errorMessage = 'Media decoding error.';
                            break;
                        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                            errorMessage = 'Media source not supported.';
                            break;
                        default:
                            errorMessage = `Media error (code: ${mediaError.code})`;
                    }
                }
                reject(new Error(`Could not determine audio duration: ${errorMessage}`));
            });
        });
    }, []);

    const generateAudio = useCallback(async (text: string, currentTtsApiKey: string, speaker: 'man' | 'woman') => {
        const voiceSelectValue = speaker === 'man' ? manVoiceConfig : womanVoiceConfig;
        if (!voiceSelectValue) {
            throw new Error(`Cannot generate audio: No ${speaker} voices selected for the current language.`);
        }
        const voiceConfig = JSON.parse(voiceSelectValue);
        const currentSpeakingRate = speakingRate;

        const base64 = await fetchTTS(text, currentTtsApiKey, voiceConfig, currentSpeakingRate);
        const audioBlob = await (await fetch(`data:audio/mp3;base64,${base64}`)).blob();
        const duration = await getAudioDuration(audioBlob);
        return { blob: audioBlob, duration };
    }, [manVoiceConfig, womanVoiceConfig, speakingRate, getAudioDuration]);

    const fetchTTS = useCallback(async (text: string, currentTtsApiKey: string, voiceConfig: any, currentSpeakingRate: number) => {
        const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${currentTtsApiKey}`;
        const body = {
            input: { text },
            voice: voiceConfig,
            audioConfig: {
                audioEncoding: 'MP3',
                speakingRate: currentSpeakingRate
            }
        };
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            const errorJson = await response.json();
            throw new Error(`TTS API failed: ${errorJson.error.message}`);
        }
        const result = await response.json();
        if (!result.audioContent) throw new Error("TTS API did not return audio content.");
        return result.audioContent;
    }, []);

    const wrapText = useCallback((ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
        if (!text) return [];
        const words = text.split(/\s+/);
        const lines = [];
        let currentLine = '';
        words.forEach(word => {
            const tentativeLine = currentLine ? `${currentLine} ${word}` : word;
            if (ctx.measureText(tentativeLine).width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = tentativeLine;
            }
        });
        if (currentLine) lines.push(currentLine);
        return lines;
    }, []);

    const drawTitleOverlay = useCallback((ctx: CanvasRenderingContext2D) => {
        const currentOverlayState = overlayStateRef.current;
        if (!currentOverlayState.title) return;
        const canvasWidth = ctx.canvas.width;
        ctx.save();
        ctx.font = '700 32px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        const maxTextWidth = canvasWidth * 0.85;
        const lineHeight = 40;
        const lines = wrapText(ctx, currentOverlayState.title, maxTextWidth);
        const widestLine = lines.reduce((max, line) => Math.max(max, ctx.measureText(line).width), 0);
        const paddingX = 24;
        const paddingY = 14;
        const blockWidth = Math.min(widestLine + paddingX * 2, canvasWidth - 32);
        const blockHeight = lines.length * lineHeight + paddingY * 2;
        const x = (canvasWidth - blockWidth) / 2;
        const y = 24;
        ctx.fillStyle = 'rgba(220, 38, 38, 0.95)'; // Red color for title background
        ctx.fillRect(x, y, blockWidth, blockHeight);
        ctx.fillStyle = '#ffffff';
        lines.forEach((line, index) => {
            const textY = y + paddingY + index * lineHeight;
            ctx.fillText(line, canvasWidth / 2, textY);
        });
        ctx.restore();
    }, [wrapText]);

    const drawSubtitleOverlay = useCallback((ctx: CanvasRenderingContext2D) => {
        const currentOverlayState = overlayStateRef.current;
        if (!currentOverlayState.showSubtitles || !currentOverlayState.currentSubtitle.text) return;

        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;
        ctx.save();

        const fontSize = currentOverlayState.subtitleFontSize || 26;
        ctx.font = `600 ${fontSize}px "Inter", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        const maxTextWidth = canvasWidth * 0.9;
        const lineHeight = fontSize + 8;
        const lines = wrapText(ctx, currentOverlayState.currentSubtitle.text, maxTextWidth);
        const currentSpeaker = currentOverlayState.currentSubtitle.speaker;
        const textColor = currentOverlayState.subtitleStyles[currentSpeaker]?.text || '#FFFFFF';

        // Animation Logic
        const elapsed = performance.now() - currentOverlayState.currentSubtitle.startTime;
        const progress = Math.min(elapsed / currentOverlayState.currentSubtitle.duration, 1.0);
        let alpha = 1.0;
        let yOffset = 0;
        let xOffset = 0;

        switch (currentOverlayState.subtitleAnimation) {
            case 'fade':
                alpha = progress;
                break;
            case 'slide-up':
                alpha = progress;
                yOffset = (1 - progress) * 50;
                break;
            case 'slide-down':
                alpha = progress;
                yOffset = -(1 - progress) * 50;
                break;
            case 'slide-left':
                alpha = progress;
                xOffset = -(1 - progress) * 100;
                break;
            case 'slide-right':
                alpha = progress;
                xOffset = (1 - progress) * 100;
                break;
            case 'scale':
                ctx.save();
                const initialBlockHeight = lines.length * lineHeight + 18 * 2;
                const initialY = canvasHeight - initialBlockHeight - 28;
                ctx.translate(canvasWidth / 2, initialY + initialBlockHeight / 2);
                ctx.scale(progress, progress);
                ctx.translate(-(canvasWidth / 2), -(initialY + initialBlockHeight / 2));
                alpha = progress;
                break;
            // 'typewriter' animation is removed from options
        }

        ctx.globalAlpha = alpha;

        const widestLine = lines.reduce((max, line) => Math.max(max, ctx.measureText(line).width), 0);
        const paddingX = 24;
        const paddingY = 18;
        const blockWidth = Math.min(widestLine + paddingX * 2, canvasWidth - 32);
        const blockHeight = lines.length * lineHeight + paddingY * 2;
        const x = (canvasWidth - blockWidth) / 2;
        const y = canvasHeight - blockHeight - 28 + yOffset;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.8)'; // Dark background for subtitles
        ctx.fillRect(x, y, blockWidth, blockHeight);
        ctx.fillStyle = textColor;
        lines.forEach((line, index) => {
            const textY = y + paddingY + index * lineHeight;
            ctx.fillText(line, canvasWidth / 2 + xOffset, textY);
        });

        if (currentOverlayState.subtitleAnimation === 'scale') {
            ctx.restore(); // Restore context if we did a scale transform
        }
        ctx.restore();
    }, [wrapText]);


    const simpleRenderLoop = useCallback(() => {
        const canvas = videoCanvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (activeVideoRef.current && activeVideoRef.current.readyState >= 2) {
            ctx.drawImage(activeVideoRef.current, 0, 0, canvas.width, canvas.height);
        }
        drawTitleOverlay(ctx);
        drawSubtitleOverlay(ctx);
        animationFrameId.current = requestAnimationFrame(simpleRenderLoop);
    }, [drawTitleOverlay, drawSubtitleOverlay]);


    const recordAndPlaySequence = useCallback(async (dialogueLines: DialogueLine[]) => {
        const canvas = videoCanvasRef.current;
        const audioPlayer = audioPlayerRef.current;
        if (!canvas || !audioPlayer) {
            throw new Error("Video canvas or audio player not found.");
        }

        setStatusMessage("Initializing video recorder...");
        canvas.classList.remove('hidden');

        // Update overlay state ref
        overlayStateRef.current = {
            title: videoTitle.trim(),
            showSubtitles: showSubtitles,
            currentSubtitle: { text: '', speaker: '', startTime: 0, duration: 250 },
            subtitleFontSize: subtitleFontSize,
            subtitleStyles: { man: { text: manSubtitleTextColor }, woman: { text: womanSubtitleTextColor } },
            subtitleAnimation: subtitleAnimation,
        };

        if (!audioContextRef.current) {
            try {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
                audioSourceRef.current = audioContextRef.current.createMediaElementSource(audioPlayer);
                audioDestinationRef.current = audioContextRef.current.createMediaStreamDestination();
                audioSourceRef.current.connect(audioDestinationRef.current);
                audioSourceRef.current.connect(audioContextRef.current.destination);
            } catch (e: any) {
                throw new Error(`Could not initialize audio: ${e.message}. Please click the page and try again.`);
            }
        }

        const canvasStream = canvas.captureStream(30);
        const combinedStream = new MediaStream([...canvasStream.getTracks(), ...(audioDestinationRef.current?.stream.getTracks() || [])]);
        const mimeType = MediaRecorder.isTypeSupported('video/mp4; codecs=avc1.42E01E,mp4a.40.2') ? 'video/mp4' : 'video/webm';
        const fileExtension = mimeType.includes('mp4') ? 'mp4' : 'webm';

        if (!MediaRecorder.isTypeSupported(mimeType)) {
            throw new Error(`Video format ${mimeType} is not supported by your browser.`);
        }

        recordedChunks.current = [];
        mediaRecorderRef.current = new MediaRecorder(combinedStream, { mimeType, videoBitsPerSecond: 2500000 });
        mediaRecorderRef.current.ondataavailable = (event) => { if (event.data.size > 0) recordedChunks.current.push(event.data); };
        mediaRecorderRef.current.onerror = (event) => { throw new Error(`Video recording failed: ${event.error.name}`); };

        const recordingPromise = new Promise<void>(resolve => {
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.onstop = () => {
                    const blob = new Blob(recordedChunks.current, { type: mimeType });
                    setDownloadUrl(URL.createObjectURL(blob));
                    setStatusMessage(`${fileExtension.toUpperCase()} ready for download!`);
                    setIsLoading(false);
                    resolve();
                };
            }
        });

        mediaRecorderRef.current.start();
        animationFrameId.current = requestAnimationFrame(simpleRenderLoop);

        for (let i = 0; i < dialogueLines.length; i++) {
            const line = dialogueLines[i];
            setStatusMessage(`Scene ${i + 1}/${dialogueLines.length}: ${line.speaker.charAt(0).toUpperCase() + line.speaker.slice(1)}`);

            const currentSpeakerVideo = backgroundVideoRefs.current[line.speaker];
            if (!currentSpeakerVideo) {
                throw new Error(`Video for ${line.speaker} is not loaded.`);
            }

            activeVideoRef.current = currentSpeakerVideo;
            activeVideoRef.current.currentTime = 0;
            activeVideoRef.current.loop = true;
            await activeVideoRef.current.play();

            let animDuration = 250;
            // 'typewriter' animation is removed from options
            overlayStateRef.current.currentSubtitle = { text: line.text, speaker: line.speaker, startTime: performance.now(), duration: animDuration };


            if (line.audio?.blob) {
                audioPlayer.src = URL.createObjectURL(line.audio.blob);
                await audioPlayer.play();

                await new Promise<void>(resolve => {
                    audioPlayer.onended = () => {
                        if (activeVideoRef.current) {
                            activeVideoRef.current.loop = false;
                            activeVideoRef.current.pause();
                            activeVideoRef.current.currentTime = 0;
                        }
                        overlayStateRef.current.currentSubtitle = { text: '', speaker: '', startTime: 0, duration: 250 };
                        setTimeout(resolve, 200); // Small pause between lines
                    };
                });
            } else {
                // If no audio, just show subtitle and then pause
                await new Promise(resolve => setTimeout(resolve, line.audio?.duration ? line.audio.duration * 1000 : 2000)); // Default 2s if no audio duration
                if (activeVideoRef.current) {
                    activeVideoRef.current.loop = false;
                    activeVideoRef.current.pause();
                    activeVideoRef.current.currentTime = 0;
                }
                overlayStateRef.current.currentSubtitle = { text: '', speaker: '', startTime: 0, duration: 250 };
            }
        }

        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
        }
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
        }
        activeVideoRef.current = null;

        return recordingPromise;
    }, [videoTitle, showSubtitles, subtitleFontSize, manSubtitleTextColor, womanSubtitleTextColor, subtitleAnimation, simpleRenderLoop, ttsApiKey]);


    const requestWakeLock = useCallback(async () => {
        if ('wakeLock' in navigator) {
            try {
                wakeLockRef.current = await navigator.wakeLock.request('screen');
                setStatusMessage('Screen wake lock active. Keep tab visible.');
                wakeLockRef.current.addEventListener('release', () => {
                    console.log('Screen Wake Lock was released');
                });
                console.log('Screen Wake Lock is active');
            } catch (err: any) {
                console.warn(`Wake Lock failed: ${err.name}, ${err.message}`);
                // Don't set error message as this is non-critical
            }
        } else {
            console.warn('Wake Lock API not supported.');
        }
    }, []);

    const releaseWakeLock = useCallback(() => {
        if (wakeLockRef.current !== null) {
            wakeLockRef.current.release();
            wakeLockRef.current = null;
        }
    }, []);


    const commonGenerationSetup = useCallback(() => {
        setErrorMessage('');
        setDownloadUrl(null);
        setIsLoading(true);
        setStatusMessage('Starting...');
        // Hide existing players and show message area
        manVideoPlayerRef.current?.classList.add('hidden');
        womanVideoPlayerRef.current?.classList.add('hidden');
        videoCanvasRef.current?.classList.add('hidden');
        // displayScriptArea is now controlled by the modal, so no need to manage it here
        // if (!isInteractiveMode) { setDisplayScriptArea(false); setGeneratedScript(''); }
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
        }
    }, []); // isInteractiveMode is not a direct dependency for setup


    const commonGenerationTeardown = useCallback((error: any) => {
        releaseWakeLock();
        if (error) {
            setErrorMessage(`Error: ${error.message}`);
            console.error("Generation failed:", error);
        }
        setIsLoading(false);
        setStatusMessage(error ? `Error: ${error.message}` : 'Generation complete!');
    }, [releaseWakeLock]);

    const handleGenerateScriptThenVideo = useCallback(async () => {
        if (!scriptPrompt || !ttsApiKey || !backgroundVideoRefs.current.man || !backgroundVideoRefs.current.woman) {
            alert("Please provide a Script Topic, TTS API Key, and upload/select both Man's and Woman's Videos.");
            return;
        }

        commonGenerationSetup();
        try {
            await requestWakeLock();
            setupCanvasAndContainer();

            setStatusMessage('Loading video files...');
            await new Promise<void>((resolve, reject) => {
                const manVideo = backgroundVideoRefs.current.man;
                const womanVideo = backgroundVideoRefs.current.woman;

                if (!manVideo || !womanVideo) {
                    reject(new Error("One or both video elements are missing."));
                    return;
                }

                const loadVideo = (video: HTMLVideoElement, speakerName: string) => new Promise<void>((res, rej) => {
                    if (video.readyState >= 3) { res(); return; }
                    const canPlayHandler = () => { cleanup(); res(); };
                    const errorHandler = (e: Event) => {
                        cleanup();
                        const videoElement = e.target as HTMLVideoElement;
                        let errorMessage = 'unknown error';
                        if (videoElement.error) {
                            switch (videoElement.error.code) {
                                case MediaError.MEDIA_ERR_ABORTED:
                                    errorMessage = 'Playback aborted.';
                                    break;
                                case MediaError.MEDIA_ERR_NETWORK:
                                    errorMessage = 'Network error during download.';
                                    break;
                                case MediaError.MEDIA_ERR_DECODE:
                                    errorMessage = 'Media decoding error.';
                                    break;
                                case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                                    errorMessage = 'Media source not supported.';
                                    break;
                                default:
                                    errorMessage = `Media error (code: ${videoElement.error.code})`;
                            }
                        }
                        rej(new Error(`Failed to load ${speakerName}'s video: ${errorMessage}`));
                    };
                    const cleanup = () => { video.removeEventListener('canplaythrough', canPlayHandler); video.removeEventListener('error', errorHandler); };
                    video.addEventListener('canplaythrough', canPlayHandler);
                    video.addEventListener('error', errorHandler);
                });

                Promise.all([loadVideo(manVideo, 'man'), loadVideo(womanVideo, 'woman')])
                    .then(() => resolve())
                    .catch(err => reject(err));
            });


            setStatusMessage('Generating AI script...');
            const script = await handleScriptGeneration(fullPrompt, modelId);
            setGeneratedScript(script); // Update generated script even if not in interactive mode

            const dialogueLines = script.split('\n')
                .filter(line => line.trim() !== '' && (line.startsWith('Man:') || line.startsWith('Woman:')))
                .map(line => {
                    const [speaker, ...text] = line.split(':');
                    const sanitizedText = text.join(':').trim().replace(/[`*]/g, '');
                    return { speaker: speaker.trim().toLowerCase() as 'man' | 'woman', text: sanitizedText, audio: null };
                });

            if (dialogueLines.length === 0) throw new Error("AI failed to generate a valid script.");

            setStatusMessage('Generating all audio...');
            for (let line of dialogueLines) {
                setStatusMessage(`Generating audio for "${line.speaker}"...`);
                line.audio = await generateAudio(line.text, ttsApiKey, line.speaker);
            }

            setStatusMessage('All assets generated. Preparing video...');
            await recordAndPlaySequence(dialogueLines);

        } catch (error: any) {
            commonGenerationTeardown(error);
        } finally {
            commonGenerationTeardown(null);
        }
    }, [scriptPrompt, ttsApiKey, fullPrompt, modelId, requestWakeLock, setupCanvasAndContainer, handleScriptGeneration, generateAudio, recordAndPlaySequence, commonGenerationSetup, commonGenerationTeardown]);


    const handleGenerateCustomVideo = useCallback(async () => {
        if (!generatedScript || !ttsApiKey || !backgroundVideoRefs.current.man || !backgroundVideoRefs.current.woman) {
            alert("Please ensure a script is generated/written, TTS API Key is provided, and both videos are loaded.");
            return;
        }

        commonGenerationSetup();
        try {
            await requestWakeLock();
            setupCanvasAndContainer();

            setStatusMessage('Loading video files...');
            await new Promise<void>((resolve, reject) => {
                const manVideo = backgroundVideoRefs.current.man;
                const womanVideo = backgroundVideoRefs.current.woman;

                if (!manVideo || !womanVideo) {
                    reject(new Error("One or both video elements are missing."));
                    return;
                }

                const loadVideo = (video: HTMLVideoElement, speakerName: string) => new Promise<void>((res, rej) => {
                    if (video.readyState >= 3) { res(); return; }
                    const canPlayHandler = () => { cleanup(); res(); };
                    const errorHandler = (e: Event) => {
                        cleanup();
                        const videoElement = e.target as HTMLVideoElement;
                        let errorMessage = 'unknown error';
                        if (videoElement.error) {
                            switch (videoElement.error.code) {
                                case MediaError.MEDIA_ERR_ABORTED:
                                    errorMessage = 'Playback aborted.';
                                    break;
                                case MediaError.MEDIA_ERR_NETWORK:
                                    errorMessage = 'Network error during download.';
                                    break;
                                case MediaError.MEDIA_ERR_DECODE:
                                    errorMessage = 'Media decoding error.';
                                    break;
                                case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                                    errorMessage = 'Media source not supported.';
                                    break;
                                default:
                                    errorMessage = `Media error (code: ${videoElement.error.code})`;
                            }
                        }
                        rej(new Error(`Failed to load ${speakerName}'s video: ${errorMessage}`));
                    };
                    const cleanup = () => { video.removeEventListener('canplaythrough', canPlayHandler); video.removeEventListener('error', errorHandler); };
                    video.addEventListener('canplaythrough', canPlayHandler);
                    video.addEventListener('error', errorHandler);
                });

                Promise.all([loadVideo(manVideo, 'man'), loadVideo(womanVideo, 'woman')])
                    .then(() => resolve())
                    .catch(err => reject(err));
            });

            const dialogueLines = generatedScript.split('\n')
                .filter(line => line.trim() !== '' && (line.startsWith('Man:') || line.startsWith('Woman:')))
                .map(line => {
                    const [speaker, ...text] = line.split(':');
                    const sanitizedText = text.join(':').trim().replace(/[`*]/g, '');
                    return { speaker: speaker.trim().toLowerCase() as 'man' | 'woman', text: sanitizedText, audio: null };
                });

            if (dialogueLines.length === 0) {
                throw new Error("The custom script does not contain any valid 'Man:' or 'Woman:' dialogue lines.");
            }

            setStatusMessage('Generating audio from custom script...');
            for (let line of dialogueLines) {
                setStatusMessage(`Generating audio for "${line.speaker}"...`);
                line.audio = await generateAudio(line.text, ttsApiKey, line.speaker);
            }

            setStatusMessage('All assets generated. Preparing video...');
            await recordAndPlaySequence(dialogueLines);

        } catch (error: any) {
            commonGenerationTeardown(error);
        } finally {
            commonGenerationTeardown(null);
        }
    }, [generatedScript, ttsApiKey, requestWakeLock, setupCanvasAndContainer, generateAudio, recordAndPlaySequence, commonGenerationSetup, commonGenerationTeardown]);


    // --- Initializations and Effects ---

    useEffect(() => {
        initializeVideoLibrary();
        setupCanvasAndContainer(); // Initial canvas setup
        // Set default voices initially
        const { manOptions, womanOptions } = populateVoices(voiceLanguage);
        if (manOptions.length > 0) setManVoiceConfig(manOptions[0].value);
        if (womanOptions.length > 0) setWomanVoiceConfig(womanOptions[0].value);
    }, [initializeVideoLibrary, setupCanvasAndContainer, populateVoices, voiceLanguage]); // Removed manVideoAssets.length, womanVideoAssets.length as they are handled inside initializeVideoLibrary now

    // Cleanup function for media recorder and wake lock
    useEffect(() => {
        return () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stop();
            }
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            releaseWakeLock();
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, [releaseWakeLock]);


    const scriptLanguageOptions = populateScriptLanguages();
    const { manOptions: availableManVoices, womanOptions: availableWomanVoices } = populateVoices(voiceLanguage);

    return (
        <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl p-8 space-y-8 my-8">

            <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-6">Gemini 3 Dialogue Director: AI Video Storyteller</h1>
            <p className="text-center text-gray-600 mb-8">Craft dynamic video conversations with Gemini AI, featuring custom actors, voices, and real-time subtitles.</p>


            {/* Top Section: Output Display */}
            <div className="flex flex-col space-y-4">
                <div id="output_container" className={`w-full bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden border-2 border-gray-300 aspect-[${aspectRatio.replace(':', '/')}]`}>
                    {isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-75 z-20">
                            <div className="loader mb-4"></div>
                            <p className="text-gray-200 text-lg font-medium text-center px-4">{statusMessage}</p>
                        </div>
                    )}
                    {!isLoading && !errorMessage && !downloadUrl && (!backgroundVideoRefs.current.man || !backgroundVideoRefs.current.woman) && (
                        <div className="text-gray-400 px-4 text-center z-10">Upload both videos and open the Script Editor to begin.</div>
                    )}
                    {errorMessage && !isLoading && (
                         <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900 bg-opacity-75 z-20 p-4">
                            <p className="text-red-100 text-lg font-semibold mb-2">Generation Failed!</p>
                            <p className="text-red-200 text-sm text-center max-w-md">{errorMessage}</p>
                        </div>
                    )}
                    <video ref={manVideoPlayerRef} className="absolute top-0 left-0 w-full h-full object-cover hidden" muted playsInline aria-label="Man's video playback"></video>
                    <video ref={womanVideoPlayerRef} className="absolute top-0 left-0 w-full h-full object-cover hidden" muted playsInline aria-label="Woman's video playback"></video>
                    <canvas ref={videoCanvasRef} className="absolute top-0 left-0 w-full h-full object-cover hidden" aria-label="Combined video output"></canvas>
                    <audio ref={audioPlayerRef} className="hidden" crossOrigin="anonymous" aria-label="Dialogue audio playback"></audio>
                </div>
                {!isLoading && !errorMessage && <div className="text-center text-sm text-gray-600 h-5" aria-live="polite">{statusMessage}</div>}
            </div>

            {/* Middle Section: Two Columns for Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Column: Actor Library */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Actors & Videos</h2>

                    <div className="space-y-4">
                        <p className="text-sm font-semibold text-gray-800 mb-2">Upload Custom Talking Heads</p>
                        <div>
                            <label htmlFor="man_video_input" className="block text-sm font-medium text-gray-700">Man's Video (Talking)</label>
                            <input
                                type="file" id="man_video_input" accept="video/mp4,video/webm"
                                onChange={(e) => handleVideoUpload(e.target.files ? e.target.files[0] : null, 'man')}
                                disabled={isLoading}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                aria-label="Upload man's video"
                            />
                        </div>
                        <div>
                            <label htmlFor="woman_video_input" className="block text-sm font-medium text-gray-700">Woman's Video (Talking)</label>
                            <input
                                type="file" id="woman_video_input" accept="video/mp4,video/webm"
                                onChange={(e) => handleVideoUpload(e.target.files ? e.target.files[0] : null, 'woman')}
                                disabled={isLoading}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                                aria-label="Upload woman's video"
                            />
                        </div>
                    </div>

                    <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4">
                        <p className="text-sm font-semibold text-gray-800 mb-3">Built-in Talking Head Library</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <SelectGroup
                                id="man_video_select" label="Select Man Actor" value={selectedManVideo}
                                onChange={(e) => handleVideoLibrarySelection(e.target.value, 'man')}
                                options={[{ value: '', label: manVideoAssets.length === 0 ? 'Loading...' : 'Select a built-in man clip' }, ...manVideoAssets.map(asset => ({ value: JSON.stringify(asset), label: asset.label }))]}
                                disabled={isLoading || manVideoAssets.length === 0}
                            />
                            <SelectGroup
                                id="woman_video_select" label="Select Woman Actor" value={selectedWomanVideo}
                                onChange={(e) => handleVideoLibrarySelection(e.target.value, 'woman')}
                                options={[{ value: '', label: womanVideoAssets.length === 0 ? 'Loading...' : 'Select a built-in woman clip' }, ...womanVideoAssets.map(asset => ({ value: JSON.stringify(asset), label: asset.label }))]}
                                disabled={isLoading || womanVideoAssets.length === 0}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-3">These clips are loaded directly from the <span className="font-semibold">AI-Gen-Video-Generator</span> GitHub repository.</p>

                        <div className="mt-6 space-y-4">
                            <div>
                                <h3 className="text-md font-medium text-gray-700 mb-2">Men</h3>
                                <div id="man_gallery" className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                    {manVideoAssets.length === 0 ? (
                                        <p className="text-sm text-gray-500 col-span-full">Loading man actors...</p>
                                    ) : (
                                        manVideoAssets.map((asset, index) => (
                                            <div
                                                key={`man-${index}`}
                                                className={`gallery-item rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer ${selectedManVideo === JSON.stringify(asset) ? 'ring-2 ring-indigo-500' : ''}`}
                                                onClick={() => handleVideoLibrarySelection(JSON.stringify(asset), 'man')}
                                                role="button"
                                                tabIndex={0}
                                                aria-pressed={selectedManVideo === JSON.stringify(asset)}
                                                aria-label={`Select man actor ${asset.label}`}
                                            >
                                                <img src={asset.thumbnail || `https://via.placeholder.com/150/f0f2f5/4f46e5?text=${asset.label.charAt(0)}`} alt={asset.label} className="w-full h-auto object-cover aspect-square" />
                                                <div className="p-2 text-center text-xs font-medium text-gray-600">{asset.label}</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-md font-medium text-gray-700 mb-2">Women</h3>
                                <div id="woman_gallery" className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                    {womanVideoAssets.length === 0 ? (
                                        <p className="text-sm text-gray-500 col-span-full">Loading woman actors...</p>
                                    ) : (
                                        womanVideoAssets.map((asset, index) => (
                                            <div
                                                key={`woman-${index}`}
                                                className={`gallery-item rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer ${selectedWomanVideo === JSON.stringify(asset) ? 'ring-2 ring-pink-500' : ''}`}
                                                onClick={() => handleVideoLibrarySelection(JSON.stringify(asset), 'woman')}
                                                role="button"
                                                tabIndex={0}
                                                aria-pressed={selectedWomanVideo === JSON.stringify(asset)}
                                                aria-label={`Select woman actor ${asset.label}`}
                                            >
                                                <img src={asset.thumbnail || `https://via.placeholder.com/150/f0f2f5/4f46e5?text=${asset.label.charAt(0)}`} alt={asset.label} className="w-full h-auto object-cover aspect-square" />
                                                <div className="p-2 text-center text-xs font-medium text-gray-600">{asset.label}</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Video Settings */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Video & Audio Settings</h2>

                    <div className="space-y-4">
                        <InputGroup
                            id="video_title_input" label="Video Title (optional)" value={videoTitle} onChange={handleVideoTitleInputChange}
                            placeholder="e.g., AI Interview Practice Session"
                            disabled={isLoading}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <SelectGroup
                                id="aspect_ratio_select" label="Aspect Ratio" value={aspectRatio} onChange={handleAspectRatioSelectChange}
                                options={[
                                    { value: "9:16", label: "9:16 (Portrait)" },
                                    { value: "16:9", label: "16:9 (Landscape)" },
                                ]}
                                disabled={isLoading}
                            />
                            <SliderInput
                                id="speaking_rate_slider" label="Speaking Speed" min={0.5} max={1.5} value={speakingRate} step={0.1}
                                onChange={handleSpeakingRateSliderChange} unit="x"
                                disabled={isLoading}
                            />
                        </div>
                        <SelectGroup
                            id="language_select" label="Voice Language" value={voiceLanguage} onChange={handleLanguageSelectChange}
                            options={Object.keys(voicesData).sort((a, b) => voicesData[a].description.localeCompare(voicesData[b].description)).map(langCode => ({ value: langCode, label: voicesData[langCode].description }))}
                            disabled={isLoading}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <SelectGroup
                                id="man_voice_select" label="Man's Voice" value={manVoiceConfig} onChange={handleManVoiceSelectChange}
                                options={availableManVoices}
                                disabled={isLoading || availableManVoices.length === 0 || !manVoiceConfig}
                            />
                            <SelectGroup
                                id="woman_voice_select" label="Woman's Voice" value={womanVoiceConfig} onChange={handleWomanVoiceSelectChange}
                                options={availableWomanVoices}
                                disabled={isLoading || availableWomanVoices.length === 0 || !womanVoiceConfig}
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Subtitle Styling</h3>
                        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                            <input
                                type="checkbox" id="show_subtitles_toggle"
                                checked={showSubtitles} onChange={handleShowSubtitlesToggle}
                                disabled={isLoading}
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            Show subtitles inside the video
                        </label>
                        <SliderInput
                            id="subtitle_font_slider" label="Subtitle Font Size" min={16} max={44} value={subtitleFontSize} step={1}
                            onChange={handleSubtitleFontSliderChange} unit="px"
                            disabled={isLoading || !showSubtitles}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Man's Subtitles</h4>
                                <ColorPicker
                                    id="man_subtitle_text_color" label="Text Color" value={manSubtitleTextColor}
                                    onChange={handleManSubtitleTextColorChange}
                                    disabled={isLoading || !showSubtitles}
                                />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Woman's Subtitles</h4>
                                <ColorPicker
                                    id="woman_subtitle_text_color" label="Text Color" value={womanSubtitleTextColor}
                                    onChange={handleWomanSubtitleTextColorChange}
                                    disabled={isLoading || !showSubtitles}
                                />
                            </div>
                        </div>
                        <SelectGroup
                            id="subtitle_animation_select" label="Subtitle Animation" value={subtitleAnimation} onChange={handleSubtitleAnimationSelectChange}
                            options={[
                                { value: "none", label: "None" },
                                { value: "fade", label: "Fade In" },
                                { value: "slide-up", label: "Slide Up" },
                                { value: "slide-down", label: "Slide Down" },
                                { value: "slide-left", label: "Slide from Left" },
                                { value: "slide-right", label: "Slide from Right" },
                                { value: "scale", label: "Scale In (Pop)" },
                            ]}
                            disabled={isLoading || !showSubtitles}
                        />
                    </div>

                    <div className="pt-4 border-t space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Advanced Options</h3>
                        <button
                            onClick={() => setShowCredentialsModal(true)}
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            disabled={isLoading}
                            aria-label="Open credentials settings"
                        >
                            Manage Credentials
                        </button>
                        <button
                            onClick={() => setShowScriptEditorModal(true)}
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            disabled={isLoading}
                            aria-label="Open script editor and AI prompt settings"
                        >
                            Open Script Editor
                        </button>
                    </div>

                </div>
            </div>

            {/* Bottom Section: Action Buttons */}
            <div className="space-y-4 pt-8 border-t-2 border-gray-200">
                {!isInteractiveMode ? (
                    <button
                        onClick={handleGenerateScriptThenVideo}
                        disabled={isLoading || !scriptPrompt || !ttsApiKey || !selectedManVideo || !selectedWomanVideo}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Generate video"
                    >
                        {isLoading ? 'Generating Video...' : 'Generate Video'}
                    </button>
                ) : (
                    <button
                        onClick={handleGenerateCustomVideo}
                        disabled={isLoading || !generatedScript || !ttsApiKey || !selectedManVideo || !selectedWomanVideo}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Generate video from custom script"
                    >
                        {isLoading ? 'Generating Custom Video...' : 'Generate From Custom Script'}
                    </button>
                )}

                {downloadUrl && (
                    <a
                        href={downloadUrl}
                        download={`Gemini3_Dialogue_Video_${aspectRatio.replace(':', '_')}.mp4`}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        aria-label="Download generated video"
                    >
                        Download Video
                    </a>
                )}
            </div>

            {/* Demos Section */}
            <div className="pt-8 border-t-2 border-gray-200">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">See It In Action</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
                            <iframe 
                                src="https://www.youtube.com/embed/2yohlzVw1bA" 
                                title="Comprehensive Walkthrough"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        </div>
                        <p className="text-sm text-center text-gray-600 font-medium">Comprehensive Walkthrough</p>
                    </div>
                    <div className="space-y-2">
                        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
                            <iframe 
                                src="https://www.youtube.com/embed/0_gOqNwYLBY" 
                                title="Interactive Script Editing"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        </div>
                        <p className="text-sm text-center text-gray-600 font-medium">Interactive Script Editing</p>
                    </div>
                    <div className="space-y-2">
                        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
                            <iframe 
                                src="https://www.youtube.com/embed/SnrnGrk3Zcg" 
                                title="Custom Actor Uploads"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        </div>
                        <p className="text-sm text-center text-gray-600 font-medium">Custom Actor Uploads</p>
                    </div>
                    <div className="space-y-2">
                        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
                            <iframe 
                                src="https://www.youtube.com/embed/nHNRGXszywE" 
                                title="Advanced Features"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        </div>
                        <p className="text-sm text-center text-gray-600 font-medium">Advanced Features</p>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <CredentialsModal
                isOpen={showCredentialsModal}
                onClose={() => setShowCredentialsModal(false)}
                isLoading={isLoading}
                projectId={projectId} setProjectId={setProjectId}
                ttsApiKey={ttsApiKey} setTtsApiKey={setTtsApiKey}
                vertexAccessToken={vertexAccessToken} setVertexAccessToken={setVertexAccessToken}
                fillDefaultCredentials={fillDefaultCredentials}
            />

            <ScriptEditorModal
                isOpen={showScriptEditorModal}
                onClose={() => setShowScriptEditorModal(false)}
                isLoading={isLoading}
                scriptPrompt={scriptPrompt} setScriptPrompt={setScriptPrompt}
                modelId={modelId} setModelId={setModelId}
                videoLength={videoLength} setVideoLength={setVideoLength}
                scriptLanguage={scriptLanguage} setScriptLanguage={setScriptLanguage}
                scriptCategory={scriptCategory} setScriptCategory={setScriptCategory}
                dialoguePace={dialoguePace} setDialoguePace={setDialoguePace}
                fullPrompt={fullPrompt} setFullPrompt={setFullPrompt}
                isInteractiveMode={isInteractiveMode} setIsInteractiveMode={setIsInteractiveMode}
                generatedScript={generatedScript} setGeneratedScript={setGeneratedScript}
                handleScriptGenerationFunction={handleScriptGeneration}
                scriptLanguageOptions={scriptLanguageOptions}
            />
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
