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
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Identifiants et canaux par créneau
const NOTIFICATION_IDS = {
  morning: "motivational-morning",
  noon: "motivational-noon",
  evening: "motivational-evening",
} as const;

// 3 canaux par créneau (Android 8+ : un son par canal)
const CHANNEL_IDS: Record<keyof typeof NOTIFICATION_IDS, string[]> = {
  morning: [
    "motivational-morning-1",
    "motivational-morning-2",
    "motivational-morning-3",
  ],
  noon: ["motivational-noon-1", "motivational-noon-2", "motivational-noon-3"],
  evening: [
    "motivational-evening-1",
    "motivational-evening-2",
    "motivational-evening-3",
  ],
};

// Sons par créneau (déclarés dans app.json plugin expo-notifications)
const SOUND_VARIANTS: Record<keyof typeof NOTIFICATION_IDS, string[]> = {
  morning: ["morning1.wav", "morning2.wav", "morning3.wav"],
  noon: ["noon1.wav", "noon2.wav", "noon3.wav"],
  evening: ["evening1.wav", "evening2.wav", "evening3.wav"],
};

function pickRandomSound(timeOfDay: keyof typeof NOTIFICATION_IDS): {
  sound: string;
  channelId: string;
} {
  const variants = SOUND_VARIANTS[timeOfDay];
  const idx = Math.floor(Math.random() * variants.length);
  const sound = variants[idx];
  const channelId = CHANNEL_IDS[timeOfDay][idx];
  return { sound, channelId };
}

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

  // Configuration pour Android : création des canaux (sons déclarés dans app.json)
  if (Platform.OS === "android") {
    const channelNames: Record<keyof typeof NOTIFICATION_IDS, string> = {
      morning: "Rappel matin",
      noon: "Rappel midi",
      evening: "Rappel soir",
    };
    for (const timeOfDay of ["morning", "noon", "evening"] as const) {
      const sounds = SOUND_VARIANTS[timeOfDay];
      const channels = CHANNEL_IDS[timeOfDay];
      for (let i = 0; i < sounds.length; i++) {
        await Notifications.setNotificationChannelAsync(channels[i], {
          name: `${channelNames[timeOfDay]} (${i + 1})`,
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#38bdf8",
          sound: sounds[i],
        });
      }
    }
  }

  return true;
}

function getNotificationTime(timeOfDay: TimeOfDay): {
  hour: number;
  minute: number;
} {
  switch (timeOfDay) {
    case "morning":
      return { hour: 8, minute: 30 };
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
      const { sound, channelId } = pickRandomSound(timeOfDay);

      const notificationContent: Notifications.NotificationContentInput = {
        title:
          timeOfDay === "morning"
            ? "🌅 Bon matin !"
            : timeOfDay === "noon"
              ? "☀️ C'est midi !"
              : "🌙 Bonne soirée !",
        body: message,
        // Pour Android < 8 et iOS, on peut spécifier le son directement ici
        sound,
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
          channelId,
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

export async function getScheduledNotificationsSummary(): Promise<string> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();

  if (!scheduled.length) {
    return "Aucune notification programmée pour le moment.";
  }

  const lines = scheduled.map((n) => {
    const id = n.identifier;
    const trigger: any = n.trigger;
    let time = "";
    if (
      trigger &&
      trigger.type === Notifications.SchedulableTriggerInputTypes.DAILY
    ) {
      const h = trigger.hour ?? "?";
      const m = trigger.minute ?? "?";
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      time = `${hh}:${mm}`;
    }
    return `• ${id}${time ? " à " + time : ""}`;
  });

  return `Total: ${scheduled.length} notification(s) programmée(s)\n\n${lines.join(
    "\n",
  )}`;
}
