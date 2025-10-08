import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "../utils/sesClient";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  const params = {
    Destination: {
      ToAddresses: [options.to],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: options.html,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: options.subject,
      },
    },
    Source: options.from || "support@potatobazaar.com",
  };

  try {
    const command = new SendEmailCommand(params);
    await sesClient.send(command);
    console.log(`Email sent successfully to ${options.to}`);
    return true;
  } catch (error) {
    console.error("SES send error:", error);
    return false;
  }
};
