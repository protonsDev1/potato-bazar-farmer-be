import axios from "axios";

const ONESIGNAL_APP_ID = process.env.ONE_SIGNAL_APP_ID;
const ONESIGNAL_API_KEY = process.env.ONE_SIGNAL_API_KEY;

const ONE_SIGNAL_API_URL = "https://onesignal.com/api/v1/notifications";

export const sendPushNotification = async ({
  title,
  message,
  playerIds,
  data = {},
}: {
  title: string;
  message: string;
  playerIds: string[]; // OneSignal device IDs
  data?: Record<string, any>;
}) => {
  try {
    const response = await axios.post(
      ONE_SIGNAL_API_URL,
      {
        app_id: ONESIGNAL_APP_ID,
        include_player_ids: playerIds,
        headings: { en: title },
        contents: { en: message },
        data, // custom data
      },
      {
        headers: {
          Authorization: `Basic ${ONESIGNAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("OneSignal error:", error?.response?.data || error);
    throw new Error("Failed to send push notification");
  }
};
