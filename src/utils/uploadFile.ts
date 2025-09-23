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

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: process.env.S3_REGION,
});

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const sendResponse = (
  res,
  statusCode: number,
  success: boolean,
  message: string,
  data: any = {}
) => {
  return res.status(statusCode).json({ success, message, ...data });
};

const generateFileKey = (category: string, mimeType: string): string => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 10);
  const extension = mime.extension(mimeType) || "bin";
  return `uploads/${category}/${timestamp}-${randomStr}.${extension}`;
};

export const uploadDoc = async (req, res) => {
  try {
    const file = req.file;
    const { category } = req.body;

    // Validation
    if (!file) {
      return sendResponse(res, 400, false, "File is required.");
    }

    if (!category) {
      return sendResponse(res, 400, false, "Category is required.");
    }

    if (!file.mimetype) {
      return sendResponse(res, 400, false, "Unsupported file type.");
    }

    if (file.size > MAX_FILE_SIZE) {
      return sendResponse(
        res,
        400,
        false,
        `File size exceeds limit of ${MAX_FILE_SIZE / (1024 * 1024)} MB.`
      );
    }

    const key = generateFileKey(category, file.mimetype);

    // Upload file to S3
    await s3
      .putObject({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
      .promise();

    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;

    return sendResponse(res, 200, true, "File uploaded successfully", {
      url: fileUrl,
    });
  } catch (error: any) {
    console.error("S3 Upload Error:", error);

    return sendResponse(res, 500, false, "File upload failed", {
      details: error.message,
    });
  }
};
