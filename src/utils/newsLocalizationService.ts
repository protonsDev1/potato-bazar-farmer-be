import path from "path";
import { promises as fs } from "fs";
import AWS from "aws-sdk";
import crypto from "crypto";
import News from "../database/models/news";
import {
  LANGUAGE_CONFIG,
  LangKey,
  translateText,
  generateSpeech, // still imported (not removed)
} from "./translation";

/* -------------------- AWS S3 CONFIG -------------------- */

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: process.env.S3_REGION,
});

const s3 = new AWS.S3({ signatureVersion: "v4" });

async function uploadAudioToS3(buffer: Buffer, key: string): Promise<string> {
  const bucket = process.env.S3_BUCKET_NAME;
  const region = process.env.S3_REGION;

  if (!bucket) throw new Error("S3_BUCKET_NAME env is missing");
  if (!region) throw new Error("S3_REGION env is missing");

  const params: AWS.S3.PutObjectRequest = {
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: "audio/mpeg",
  };

  await s3.upload(params).promise();
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

/* -------------------- HELPERS FOR CHUNKING -------------------- */

const MAX_BYTES = 4800;

function takeBytes(text: string, maxBytes: number): [string, string] {
  if (!text) return ["", ""];

  let acc = "";
  let i = 0;

  while (i < text.length) {
    const candidate = acc + text[i];
    const bytes = Buffer.byteLength(candidate, "utf8");
    if (bytes > maxBytes) break;
    acc = candidate;
    i++;
  }

  return [acc, text.slice(i)];
}

function buildSpeechChunks(content: {
  category: string;
  dateText: string;
  title: string;
  description: string;
}): string[] {
  const chunks: string[] = [];

  const headerParts = [
    content.category?.trim(),
    content.dateText?.trim(),
    content.title?.trim(),
  ].filter(Boolean);

  let headerText = headerParts.join(". ");
  if (headerText.length > 0) {
    headerText += ". ";
  }

  const headerBytes = Buffer.byteLength(headerText, "utf8");
  let remainingDesc = content.description || "";

  if (headerBytes >= MAX_BYTES) {
    const [shortHeader] = takeBytes(headerText, MAX_BYTES);
    chunks.push(shortHeader.trim());
    return chunks;
  }

  const firstChunkDescMax = MAX_BYTES - headerBytes;
  const [firstDescChunk, rest] = takeBytes(remainingDesc, firstChunkDescMax);
  remainingDesc = rest;

  const firstChunkText = (headerText + firstDescChunk).trim();
  if (firstChunkText.length > 0) chunks.push(firstChunkText);

  while (remainingDesc && remainingDesc.length > 0) {
    const [part, restDesc] = takeBytes(remainingDesc, MAX_BYTES);
    const trimmed = part.trim();
    if (!trimmed) break;

    chunks.push(trimmed);
    remainingDesc = restDesc;
  }

  return chunks;
}

/* -------------------- MAIN FUNCTION -------------------- */

// export async function generateNewsTranslationsAndAudio(news: News) {
//   const supportedLangs: LangKey[] = ["en", "hi", "gu", "pa", "mr", "bn"];

//   const localizedContent: any = {};
//   const audioUrls: Record<string, string[]> = {};

//   const baseTitle = news.title;
//   const baseDescription = news.description;
//   const baseCategory = news.category;

//   const baseDate = news.createdAt || new Date();
//   const baseDateText = baseDate.toLocaleDateString("en-IN", {
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   });

//   /* -------------------------------------------------------
//    * 1) FULL TRANSLATION (NO TRUNCATION)
//    * -----------------------------------------------------*/
//   for (const langKey of supportedLangs) {
//     const config = LANGUAGE_CONFIG[langKey];

//     let title = baseTitle;
//     let description = baseDescription;
//     let category = baseCategory;
//     let dateText = baseDateText;

//     if (langKey !== "en") {
//       console.log(`[News ${news.id}] Translating to ${config.label}...`);
//       [title, description, category, dateText] = await Promise.all([
//         translateText(baseTitle, config.translateTarget),
//         translateText(baseDescription, config.translateTarget),
//         translateText(baseCategory, config.translateTarget),
//         translateText(baseDateText, config.translateTarget),
//       ]);
//     }

//     localizedContent[langKey] = {
//       title,
//       description,
//       category,
//       dateText,
//     };
//   }

//   /* -------------------------------------------------------
//    * 2) AUDIO GENERATION (COMMENTED OUT — DISABLED)
//    * -----------------------------------------------------*/

//   /*
//   for (const langKey of supportedLangs) {
//     const config = LANGUAGE_CONFIG[langKey];
//     const content = localizedContent[langKey];
//     if (!config || !content) continue;

//     const chunks = buildSpeechChunks({
//       category: content.category,
//       dateText: content.dateText,
//       title: content.title,
//       description: content.description,
//     });

//     console.log(
//       `[News ${news.id}] ${langKey} → ${chunks.length} audio chunk(s)`
//     );

//     audioUrls[langKey] = [];

//     for (let index = 0; index < chunks.length; index++) {
//       const speechText = chunks[index];
//       const partNumber = index + 1;

//       const localFilePath = path.join(
//         process.cwd(),
//         "tmp",
//         "news-audio",
//         `${news.id}-${langKey}-part${partNumber}.mp3`
//       );

//       try {
//         // Generate locally
//         await generateSpeech(speechText, localFilePath, config.ttsLanguageCode);

//         // Read buffer
//         const audioBuffer = await fs.readFile(localFilePath);

//         // 🔑 Unique key using UUID (with fallback)
//         const uniqueId =
//           (crypto.randomUUID && crypto.randomUUID()) ||
//           `${Date.now()}-${Math.random().toString(36).slice(2)}`;

//         const s3Key = `news/audio/${news.id}/${langKey}-part${partNumber}-${uniqueId}.mp3`;

//         // Upload to S3
//         const audioUrl = await uploadAudioToS3(audioBuffer, s3Key);
//         audioUrls[langKey].push(audioUrl);

//         console.log(
//           `[News ${news.id}] Audio uploaded (${langKey}, part ${partNumber}) → ${audioUrl}`
//         );
//       } catch (err: any) {
//         console.error(
//           `[News ${news.id}] Audio failed for ${config.label} (part ${partNumber}):`,
//           err?.message || err
//         );
//       } finally {
//         try {
//           await fs.unlink(localFilePath);
//           console.log(
//             `[News ${news.id}] Local file deleted: ${localFilePath}`
//           );
//         } catch (err) {
//           console.warn(
//             `[News ${news.id}] Failed to delete local file: ${localFilePath}`
//           );
//         }
//       }
//     }
//   }
//   */

//   /* -------------------------------------------------------
//    * 3) SAVE TO DATABASE
//    * -----------------------------------------------------*/
//   news.localizedContent = localizedContent;

//   // @ts-ignore
//   news.audioUrls = audioUrls; // will be empty, since TTS disabled

//   await news.save();

//   console.log(`[News ${news.id}] Localization completed (TTS disabled)`);
// }

export async function generateNewsTranslationsAndAudio(news: News) {
  const supportedLangs: LangKey[] = ["en", "hi", "gu", "pa", "mr", "bn"];

  const localizedContent: any = {};

  // Fields that should be translated (if present)
  const fieldsToTranslate = [
    "title",
    "description",
    "category",
    "introduction",
    "keyNumbers",
    "changesThisWeek",
    "supplyAnalysis",
    "demandSignals",
    "regionalSnapshot",
    "policyRisks",
    "faqs",
    "source",
    "tags",
  ];

  // Pick only fields that exist on the record
  const baseValues: Record<string, any> = {};
  for (const f of fieldsToTranslate) {
    if (news[f] !== undefined && news[f] !== null) {
      baseValues[f] = news[f];
    }
  }

  // Base dateText
  const baseDate = news.createdAt || new Date();
  const baseDateText = baseDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  /* -------------------------------------------------------
   * TRANSLATION
   * ----------------------------------------------------- */
  for (const langKey of supportedLangs) {
    const config = LANGUAGE_CONFIG[langKey];

    // Copy English as-is (do not translate)
    if (langKey === "en") {
      localizedContent[langKey] = {
        ...baseValues,
        dateText: baseDateText,
      };
      continue;
    }

    console.log(`[News ${news.id}] Translating into ${config.label}...`);

    const translated: Record<string, any> = {};

    try {
      /* -------------------------------------------------------
       * 1) Translate scalar string fields (exclude faqs & keyNumbers)
       * ----------------------------------------------------- */
      const scalarFields = Object.keys(baseValues).filter(
        (f) =>
          f !== "faqs" &&
          f !== "tags" &&
          f !== "keyNumbers" &&
          typeof baseValues[f] === "string"
      );

      const scalarPromises = scalarFields.map((f) =>
        translateText(baseValues[f], config.translateTarget).catch(
          () => baseValues[f]
        )
      );

      const scalarResults = await Promise.all(scalarPromises);
      scalarFields.forEach((f, i) => {
        translated[f] = scalarResults[i];
      });

      /* -------------------------------------------------------
       * 2) Translate FAQ array
       * ----------------------------------------------------- */
      if (Array.isArray(baseValues["faqs"])) {
        const faqs = baseValues["faqs"];

        const translatedFaqs = await Promise.all(
          faqs.map(async (faq) => {
            const q = faq.question || "";
            const a = faq.answer || "";

            const [translatedQ, translatedA] = await Promise.all([
              translateText(q, config.translateTarget).catch(() => q),
              translateText(a, config.translateTarget).catch(() => a),
            ]);

            return {
              ...faq, // keep any extra keys (id, order, etc.)
              question: translatedQ,
              answer: translatedA,
            };
          })
        );

        translated["faqs"] = translatedFaqs;
      }

      if (Array.isArray(baseValues["tags"])) {
        const tags = baseValues["tags"];

        const translatedTags = await Promise.all(
          tags.map((tag: string) =>
            translateText(tag, config.translateTarget).catch(() => tag)
          )
        );

        translated["tags"] = translatedTags;
      }

      /* -------------------------------------------------------
       * 3) Translate keyNumbers object (if present)
       *    keep keys unchanged, translate values
       * ----------------------------------------------------- */
      if (
        baseValues["keyNumbers"] &&
        typeof baseValues["keyNumbers"] === "object"
      ) {
        const pairs = Object.entries(baseValues["keyNumbers"]); // [ [k,v], ... ]

        const translatedPairs = await Promise.all(
          pairs.map(async ([k, v]) => {
            const translatedVal = await translateText(
              String(v || ""),
              config.translateTarget
            ).catch(() => v);
            return [k, translatedVal];
          })
        );

        const keyNumbersTranslated: Record<string, string> = {};
        translatedPairs.forEach(([k, v]) => {
          keyNumbersTranslated[String(k)] = String(v);
        });

        translated["keyNumbers"] = keyNumbersTranslated;
      }

      /* -------------------------------------------------------
       * 4) Translate date text
       * ----------------------------------------------------- */
      const transDateText = await translateText(
        baseDateText,
        config.translateTarget
      ).catch(() => baseDateText);

      localizedContent[langKey] = {
        ...translated,
        dateText: transDateText,
      };
    } catch (err) {
      console.error(
        `[News ${news.id}] Translation failed for ${langKey}:`,
        err?.message || err
      );

      // fallback → use English values
      localizedContent[langKey] = {
        ...baseValues,
        dateText: baseDateText,
      };
    }
  }

  news.localizedContent = localizedContent;

  await news.save();

  console.log(`[News ${news.id}] Localization completed`);
}
