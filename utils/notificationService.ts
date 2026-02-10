import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { Objective } from "../context/ObjectivesContext";
import { areNotificationsSupported } from "./expoGoCheck";
import { getMotivationalMessage, type TimeOfDay } from "./motivationalMessages";

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const NOTIFICATION_IDS = {
  morning: "motivational-morning",
  noon: "motivational-noon",
  evening: "motivational-evening",
};

export async function requestNotificationPermissions(): Promise<boolean> {
  if (!areNotificationsSupported()) {
    console.log(
      "Les notifications ne sont pas supportées dans Expo Go sur Android. Utilisez un development build (expo run:android).",
    );
    return false;
  }

  if (!Device.isDevice) {
    console.log("Les notifications ne fonctionnent que sur un vrai appareil");
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Permission de notification refusée");
    return false;
  }

  // Configuration pour Android
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("motivational", {
      name: "Notifications d'encouragement",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#38bdf8",
      sound: "default",
    });
  }

  return true;
}

function getNotificationTime(timeOfDay: TimeOfDay): {
  hour: number;
  minute: number;
} {
  switch (timeOfDay) {
    case "morning":
      return { hour: 8, minute: 30 }; // 8h00
    case "noon":
      return { hour: 12, minute: 30 }; // 12h30
    case "evening":
      return { hour: 21, minute: 0 }; // 21h00
  }
}

export async function cancelAllMotivationalNotifications(): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(
      NOTIFICATION_IDS.morning,
    );
    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDS.noon);
    await Notifications.cancelScheduledNotificationAsync(
      NOTIFICATION_IDS.evening,
    );
    console.log("Notifications d'encouragement annulées");
  } catch (error) {
    console.error("Erreur lors de l'annulation des notifications:", error);
  }
}

export async function scheduleMotivationalNotifications(
  objectives: Objective[],
): Promise<void> {
  try {
    // Annuler les notifications existantes
    await cancelAllMotivationalNotifications();

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log("Permissions de notification non accordées");
      return;
    }

    // Utiliser le premier objectif actif pour personnaliser les messages
    const activeObjective = objectives.length > 0 ? objectives[0] : undefined;

    // Programmer les 3 notifications quotidiennes
    const times: TimeOfDay[] = ["morning", "noon", "evening"];

    for (const timeOfDay of times) {
      const { hour, minute } = getNotificationTime(timeOfDay);
      const message = getMotivationalMessage(timeOfDay, activeObjective);

      const notificationContent: Notifications.NotificationContentInput = {
        title:
          timeOfDay === "morning"
            ? "🌅 Bon matin !"
            : timeOfDay === "noon"
              ? "☀️ C'est midi !"
              : "🌙 Bonne soirée !",
        body: message,
        sound: true,
      };

      // Ajouter la priorité Android si disponible
      if (Platform.OS === "android") {
        (notificationContent as any).priority =
          Notifications.AndroidNotificationPriority?.HIGH || "high";
      }

      await Notifications.scheduleNotificationAsync({
        identifier: NOTIFICATION_IDS[timeOfDay],
        content: notificationContent,
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          channelId: "motivational",
          hour,
          minute,
        },
      });
    }

    console.log("Notifications d'encouragement programmées");
  } catch (error) {
    console.error("Erreur lors de la programmation des notifications:", error);
  }
}

export async function updateNotificationMessages(
  objectives: Objective[],
): Promise<void> {
  // Vérifier si les notifications sont déjà programmées
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const hasScheduled = scheduled.some(
    (n) =>
      n.identifier === NOTIFICATION_IDS.morning ||
      n.identifier === NOTIFICATION_IDS.noon ||
      n.identifier === NOTIFICATION_IDS.evening,
  );

  if (hasScheduled) {
    // Re-programmer avec les nouveaux messages
    await scheduleMotivationalNotifications(objectives);
  }
}
