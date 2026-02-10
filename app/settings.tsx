import { Ionicons } from "@expo/vector-icons";
import { useSettings } from "../context/SettingsContext";
import { useObjectives } from "../context/ObjectivesContext";
import { Alert, StyleSheet, Switch, Text, View } from "react-native";
import { areNotificationsSupported } from "../utils/expoGoCheck";

export default function Settings() {
  const {
    dailyMotivation,
    motivationalNotifications,
    toggleDailyMotivation,
    toggleMotivationalNotifications,
  } = useSettings();
  const { objectives } = useObjectives();

  const notificationsSupported = areNotificationsSupported();

  const handleToggleNotifications = async () => {
    if (!notificationsSupported) {
      Alert.alert(
        "Notifications non disponibles",
        "Les notifications ne fonctionnent pas dans Expo Go sur Android.\n\nPour les utiliser, créez un development build :\n\n• Lancez : npx expo run:android\n• Ou générez un APK avec EAS Build",
        [{ text: "OK" }],
      );
      return;
    }
    await toggleMotivationalNotifications(objectives);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paramètres</Text>

      {!notificationsSupported && (
        <View style={styles.warningBox}>
          <Ionicons name="warning" size={24} color="#f59e0b" />
          <Text style={styles.warningText}>
            Les notifications ne sont pas disponibles dans Expo Go sur Android.
            Utilisez "npx expo run:android" pour créer un build de
            développement.
          </Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>

        <View style={styles.row}>
          <View style={styles.rowContent}>
            <Ionicons name="notifications" size={24} color="#38bdf8" />
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Notifications d'encouragement</Text>
              <Text style={styles.description}>
                Reçois des messages de motivation matin, midi et soir
              </Text>
            </View>
          </View>
          <Switch
            value={motivationalNotifications}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: "#334155", true: "#38bdf8" }}
            thumbColor={motivationalNotifications ? "#fff" : "#94a3b8"}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.rowContent}>
            <Ionicons name="heart" size={24} color="#38bdf8" />
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Motivation quotidienne</Text>
              <Text style={styles.description}>
                Affiche des messages de motivation dans l'app
              </Text>
            </View>
          </View>
          <Switch
            value={dailyMotivation}
            onValueChange={toggleDailyMotivation}
            trackColor={{ false: "#334155", true: "#38bdf8" }}
            thumbColor={dailyMotivation ? "#fff" : "#94a3b8"}
          />
        </View>
      </View>

      {motivationalNotifications && (
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color="#38bdf8" />
          <Text style={styles.infoText}>
            Les notifications sont programmées à 8h00, 12h30 et 19h00 chaque
            jour.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 24,
  },
  title: {
    fontSize: 28,
    color: "#f8fafc",
    fontWeight: "bold",
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#94a3b8",
    fontWeight: "600",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0f172a",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  rowContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  labelContainer: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    color: "#64748b",
    fontSize: 12,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#0f172a",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
    alignItems: "flex-start",
  },
  infoText: {
    color: "#94a3b8",
    fontSize: 13,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  warningBox: {
    flexDirection: "row",
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.5)",
    marginBottom: 24,
    alignItems: "flex-start",
  },
  warningText: {
    color: "#f59e0b",
    fontSize: 13,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});
