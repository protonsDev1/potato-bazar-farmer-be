import axios from "axios";
import sharp from "sharp";
import AWS from "aws-sdk";
import { Op } from "sequelize";
import News from "../database/models/news";

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
 * Extracts S3 object key from any S3 URL
 * Works for:
 * - https://bucket.s3.amazonaws.com/...
 * - https://bucket.s3.region.amazonaws.com/...
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

(async () => {
  try {
    console.log("🔄 Reprocessing news images (aligned with upload API)");

    const newsList = await News.findAll({
      where: {
        images: {
          [Op.not]: null,
        },
      },
    });

    for (const news of newsList) {
      if (!Array.isArray(news.images) || news.images.length === 0) continue;

      console.log(`📰 News ID: ${news.id}`);

      for (const imageUrl of news.images) {
        try {
          const thumbKey = getThumbnailKeyFromImageUrl(imageUrl);
          if (!thumbKey) {
            console.warn(`⚠️ Invalid image URL: ${imageUrl}`);
            continue;
          }

          // 1️⃣ Download original image
          const response = await axios.get(imageUrl, {
            responseType: "arraybuffer",
            timeout: 15000,
          });

          const buffer = Buffer.from(response.data);

          // 2️⃣ Create thumbnail (same logic as uploadDoc)
          const thumbBuffer = await sharp(buffer)
            .rotate()
            .resize({
              width: THUMB_WIDTH,
              fit: "cover",
            })
            .webp({ quality: THUMB_QUALITY })
            .toBuffer();

          // 3️⃣ Upload thumbnail to S3
          await s3
            .putObject({
              Bucket: BUCKET,
              Key: thumbKey,
              Body: thumbBuffer,
              ContentType: "image/webp",
              CacheControl: "public, max-age=31536000, immutable",
            })
            .promise();

          console.log(`✅ Thumbnail uploaded: ${BASE_URL}${thumbKey}`);
        } catch (err: any) {
          console.error(`❌ Failed for ${imageUrl}`, err.message);
        }
      }
    }

    console.log("🎉 Thumbnail reprocessing completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Script failed:", error);
    process.exit(1);
  }
})();
