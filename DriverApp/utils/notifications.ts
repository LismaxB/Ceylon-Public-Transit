import * as Notifications from "expo-notifications";

export const sendTripNotification = async (tripDetails: { bus_no: string }) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Trip Started 🚍",
      body: `${tripDetails.bus_no}.`,
      data: { tripDetails },
    },
    trigger: null,
  });
};
