import axios from "axios";
import sharp from "sharp";
import AWS from "aws-sdk";
import { Op } from "sequelize";
import News from "../database/models/news";
import KnowledgeHub from "../database/models/knowledgeHub";

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: process.env.S3_REGION,
});

const BUCKET = process.env.S3_BUCKET_NAME!;
const REGION = process.env.S3_REGION!;
const BASE_URL = `https://${BUCKET}.s3.${REGION}.amazonaws.com/`;

const THUMB_WIDTH = 400;
const THUMB_QUALITY = 80;

/**
 * Extract S3 object key from any S3 URL
 */
const extractS3Key = (imageUrl: string): string | null => {
  try {
    const url = new URL(imageUrl);
    return url.pathname.replace(/^\/+/, "");
  } catch {
    return null;
  }
};

/**
 * uploads/category/file.png
 * → uploads/category/thumbnails/file.png
 */
const getThumbnailKeyFromImageUrl = (imageUrl: string): string | null => {
  const originalKey = extractS3Key(imageUrl);
  if (!originalKey) return null;

  return originalKey.replace(/^uploads\/([^/]+)\//, "uploads/$1/thumbnails/");
};

/**
 * Generic processor for any model with `images: string[]`
 */
const processModelImages = async (modelName: string, Model: any) => {
  console.log(`\n📦 Processing ${modelName} images...`);

  const records = await Model.findAll({
    where: {
      images: {
        [Op.not]: null,
      },
    },
  });

  for (const record of records) {
    if (!Array.isArray(record.images) || record.images.length === 0) continue;

    console.log(`🔹 ${modelName} ID: ${record.id}`);

    for (const imageUrl of record.images) {
      try {
        const thumbKey = getThumbnailKeyFromImageUrl(imageUrl);
        if (!thumbKey) {
          console.warn(`⚠️ Invalid image URL: ${imageUrl}`);
          continue;
        }

        // Download original image
        const response = await axios.get(imageUrl, {
          responseType: "arraybuffer",
          timeout: 15000,
        });

        const buffer = Buffer.from(response.data);

        // Create thumbnail
        const thumbBuffer = await sharp(buffer)
          .rotate()
          .resize({
            width: THUMB_WIDTH,
            fit: "cover",
          })
          .webp({ quality: THUMB_QUALITY })
          .toBuffer();

        // Upload thumbnail
        await s3
          .putObject({
            Bucket: BUCKET,
            Key: thumbKey,
            Body: thumbBuffer,
            ContentType: "image/webp",
            CacheControl: "public, max-age=31536000, immutable",
          })
          .promise();

        console.log(`✅ ${BASE_URL}${thumbKey}`);
      } catch (err: any) {
        console.error(`❌ Failed for ${imageUrl}`, err.message);
      }
    }
  }
};

(async () => {
  try {
    console.log("🔄 Reprocessing thumbnails for all content models");

    await processModelImages("News", News);
    await processModelImages("KnowledgeHub", KnowledgeHub);

    console.log("\n🎉 All thumbnails reprocessed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Script failed:", error);
    process.exit(1);
  }
})();
