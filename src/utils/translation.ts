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

type GenerateOpts = {
  recordId: number | string;
  recordType: string; // e.g. "KnowledgeHub"
  fields: string[]; // list of field names to translate e.g. ["title","description","category"]
  dateFields?: { key: string; format?: (d: Date) => string }[]; // optional date fields -> produce dateText translations
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

export async function generateTranslationsForRecord(
  modelInstance: any,
  opts: GenerateOpts
) {
  const supportedLangs: LangKey[] = ["en", "hi", "gu", "pa", "mr", "bn"];
  const localizedContent: Record<string, any> = {};

  const baseValues: Record<string, string> = {};
  for (const f of opts.fields) {
    baseValues[f] = (modelInstance[f] ?? "") as string;
  }

  // optional date text generation
  const baseDateTexts: Record<string, string> = {};
  if (opts.dateFields) {
    for (const df of opts.dateFields) {
      const val = (modelInstance[df.key] ?? null) as Date | null;
      if (val) {
        // default date formatting — change locale/format if needed
        baseDateTexts[df.key] = new Date(val).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      } else baseDateTexts[df.key] = "";
    }
  }

  for (const langKey of supportedLangs) {
    const config = LANGUAGE_CONFIG[langKey];
    let translations: Record<string, string> = {};
    // copy base (english)
    for (const f of opts.fields) {
      translations[f] = baseValues[f];
    }

    let dateTranslations: Record<string, string> = {};
    for (const df of opts.dateFields ?? []) {
      dateTranslations[df.key] = baseDateTexts[df.key] ?? "";
    }

    if (langKey !== "en") {
      try {
        // Translate fields in parallel
        const translatePromises = [
          ...opts.fields.map((f) =>
            translateText(baseValues[f] || "", config.translateTarget)
          ),
          ...Object.values(baseDateTexts).map((d) =>
            translateText(d || "", config.translateTarget)
          ),
        ];

        const translatedResults = await Promise.all(translatePromises);

        // assign back: first N are fields, remaining are dateTexts (if any)
        for (let i = 0; i < opts.fields.length; i++) {
          translations[opts.fields[i]] =
            translatedResults[i] || translations[opts.fields[i]];
        }
        const dateFieldKeys = Object.keys(baseDateTexts);
        for (let i = 0; i < dateFieldKeys.length; i++) {
          dateTranslations[dateFieldKeys[i]] =
            translatedResults[opts.fields.length + i] ||
            dateTranslations[dateFieldKeys[i]];
        }
      } catch (err: any) {
        console.error(
          `[${opts.recordType} ${opts.recordId}] translation failed for ${langKey}:`,
          err?.message || err
        );
        // fallback to original strings if translation fails
      }
    }

    localizedContent[langKey] = {
      ...translations,
      ...(Object.keys(dateTranslations).length
        ? { dateText: dateTranslations }
        : {}),
    };
  }

  // set and save
  modelInstance.localizedContent = localizedContent;
  await modelInstance.save();
  console.log(`[${opts.recordType} ${opts.recordId}] localization saved`);
  return localizedContent;
}
