import * as Notifications from "expo-notifications";

export const sendTripNotification = async (tripDetails: { bus_no: string }) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Trip Started 🚍",
      body: `Bus No. - ${tripDetails.bus_no}.\n`,
      data: { tripDetails },
    },
    trigger: null,
  });
};
