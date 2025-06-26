const AWS = require("aws-sdk");
import dotenv from "dotenv";
import mime from "mime-types";

dotenv.config();

export const uploadToS3 = async (req, res) => {
  try {
    const { fileType, category } = req.query;

    if (!fileType || !category) {
      return res
        .status(400)
        .json({ error: "fileType and category are required fields." });
    }

    const mimeType = mime.lookup(fileType);
    if (!mimeType) {
      return res.status(400).json({ error: "Unsupported file type." });
    }

    AWS.config.update({
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
      region: process.env.S3_REGION,
    });

    const s3 = new AWS.S3({ signatureVersion: "v4" });

    // Generate unique file name using timestamp + random number
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 10); // 8-char random string
    const extension = mime.extension(mimeType);

    const folderPath = `uploads/${category}/`;
    const fileName = `${timestamp}-${randomStr}.${extension}`;
    const key = `${folderPath}${fileName}`;

    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: mimeType,
      Expires: 3600,
    };

    const preSignedUrl = await s3.getSignedUrlPromise(
      "putObject",
      uploadParams
    );
    const regularUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;

    return res.json({ preSignedUrl, regularUrl });
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    return res
      .status(500)
      .json({ error: "Failed to generate pre-signed URL." });
  }
};
