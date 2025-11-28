import textToSpeech from "@google-cloud/text-to-speech";
import { v2 as TranslateV2 } from "@google-cloud/translate";
import { promises as fs } from "fs";
import path from "path";

const { Translate } = TranslateV2;

// 🔥 Path to service account JSON (for Text-to-Speech)
const CRED_PATH = path.join(__dirname, "../../config/google-voice.json");

/**
 * ✔ Supported languages for News:
 * en = English
 * hi = Hindi
 * gu = Gujarati
 * pa = Punjabi
 * mr = Marathi
 * bn = Bengali
 */
export type LangKey = "en" | "hi" | "gu" | "pa" | "mr" | "bn";

export const LANGUAGE_CONFIG: Record<
  LangKey,
  { label: string; translateTarget: string; ttsLanguageCode: string }
> = {
  en: { label: "English", translateTarget: "en", ttsLanguageCode: "en-IN" },
  hi: { label: "Hindi", translateTarget: "hi", ttsLanguageCode: "hi-IN" },
  gu: { label: "Gujarati", translateTarget: "gu", ttsLanguageCode: "gu-IN" },
  pa: { label: "Punjabi", translateTarget: "pa", ttsLanguageCode: "pa-IN" },
  mr: { label: "Marathi", translateTarget: "mr", ttsLanguageCode: "mr-IN" },
  bn: { label: "Bengali", translateTarget: "bn", ttsLanguageCode: "bn-IN" },
};

//
// ─────────────────────────────────────────────────────────────
//   TEXT TRANSLATION (API KEY BASED)
// ─────────────────────────────────────────────────────────────
//

let translateClient: InstanceType<typeof Translate> | null = null;

function createTranslateClient() {
  if (translateClient) return translateClient;

  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_TRANSLATE_API_KEY is missing in env");

  translateClient = new Translate({ key: apiKey });
  return translateClient;
}

/**
 * Translate any text into target language
 */
export async function translateText(
  text: string,
  targetLang: string
): Promise<string> {
  try {
    const client = createTranslateClient();
    const [translated] = await client.translate(text, targetLang);

    console.log(`🔤 Translated (${targetLang}):`, translated);
    return translated;
  } catch (err: any) {
    console.error("Translation Error →", err?.message || err);
    return text; // fallback: return original
  }
}

//
// ─────────────────────────────────────────────────────────────
//   TEXT-TO-SPEECH (SERVICE ACCOUNT JSON)
// ─────────────────────────────────────────────────────────────
//

async function loadCredentials() {
  const raw = await fs.readFile(CRED_PATH, "utf8");
  return JSON.parse(raw);
}

//@ts-ignore
let ttsClientPromise: Promise<textToSpeech.TextToSpeechClient> | null = null;

async function createTTSClient() {
  if (!ttsClientPromise) {
    ttsClientPromise = (async () => {
      const credentials = await loadCredentials();
      return new textToSpeech.TextToSpeechClient({
        credentials,
        projectId: credentials.project_id,
      });
    })();
  }
  return ttsClientPromise;
}

/**
 * Convert text → MP3 (stored locally)
 */
export async function generateSpeech(
  text: string,
  outputFile: string,
  languageCode: string
): Promise<void> {
  try {
    const client = await createTTSClient();

    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: { languageCode, ssmlGender: "NEUTRAL" },
      audioConfig: { audioEncoding: "MP3" },
    });

    if (!response.audioContent) throw new Error("No audioContent received");

    await fs.mkdir(path.dirname(outputFile), { recursive: true });
    await fs.writeFile(outputFile, response.audioContent as Buffer);

    console.log(`🔊 Audio saved → ${outputFile}`);
  } catch (err: any) {
    console.error("TTS Error →", err?.message || err);
    throw err;
  }
}
