import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { Pressable } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  ObjectivesProvider,
  useObjectives,
} from "../context/ObjectivesContext";
import { SettingsProvider, useSettings } from "../context/SettingsContext";
import { updateNotificationMessages } from "../utils/notificationService";

// Composant pour synchroniser les notifications avec les objectifs
function NotificationSync() {
  const { objectives } = useObjectives();
  const { motivationalNotifications } = useSettings();

  useEffect(() => {
    const syncNotifications = async () => {
      if (motivationalNotifications) {
        if (objectives.length > 0) {
          // Mettre à jour les messages avec les objectifs actuels
          await updateNotificationMessages(objectives);
        }
      }
    };

    syncNotifications();
  }, [objectives, motivationalNotifications]);

  return null;
}

function AppContent() {
  const router = useRouter();

  return (
    <>
      <NotificationSync />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#020617" },
          headerTintColor: "#38bdf8",
          headerTitleStyle: { color: "#f8fafc" },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Mes objectifs",
            headerRight: () => (
              <Pressable
                onPress={() => router.push("/settings" as never)}
                style={{ padding: 8, marginRight: 8 }}
              >
                <Ionicons name="settings-outline" size={24} color="#94a3b8" />
              </Pressable>
            ),
          }}
        />
        <Stack.Screen
          name="add-objective"
          options={{ title: "Nouvel objectif" }}
        />
        <Stack.Screen name="objective/[id]" options={{ title: "Détails" }} />
        <Stack.Screen name="settings" options={{ title: "Paramètres" }} />
        <Stack.Screen name="stats" options={{ title: "Statistiques" }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SettingsProvider>
        <ObjectivesProvider>
          <AppContent />
        </ObjectivesProvider>
      </SettingsProvider>
    </GestureHandlerRootView>
  );
}
