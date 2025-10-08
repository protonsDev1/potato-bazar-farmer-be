import { SESClient } from "@aws-sdk/client-ses";

export const sesClient = new SESClient({
  region: process.env.SES_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});
