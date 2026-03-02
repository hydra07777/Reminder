import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import DynamicLogo from "../components/DynamicLogo";
import ObjectiveCard from "../components/ObjectiveCard";
import {
  useObjectives,
  getTodayDateString,
} from "../context/ObjectivesContext";

export default function Home() {
  const router = useRouter();
  const { objectives, getOverallPercentage, getTodayStatus, updateDayStatus } =
    useObjectives();

  const handleSwipeSuccess = (objectiveId: string) => {
    updateDayStatus(objectiveId, getTodayDateString(), "success");
  };

  const handleSwipeFail = (objectiveId: string) => {
    updateDayStatus(objectiveId, getTodayDateString(), "fail");
  };

  const overallPercentage = getOverallPercentage();

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoSection}>
          <DynamicLogo size={88} showStreakBadge showLabel />
        </View>
        <View style={styles.percentageCard}>
          <Text style={styles.percentageLabel}>Engagements globaux</Text>
          <Text style={styles.percentageValue}>{overallPercentage}%</Text>
          <Text style={styles.percentageSubtext}>
            jours réussis / jours totaux
          </Text>
        </View>

        <Pressable
          style={styles.statsCard}
          onPress={() => router.push("/stats" as never)}
        >
          <View style={styles.statsRow}>
            <View>
              <Text style={styles.statsTitle}>Statistiques globales</Text>
              <Text style={styles.statsSubtitle}>
                XP, séries, taux de réussite, activité
              </Text>
            </View>
            <Ionicons name="stats-chart" size={24} color="#38bdf8" />
          </View>
        </Pressable>

        <View style={styles.list}>
          {objectives.map((objective) => (
            <ObjectiveCard
              key={objective.id}
              objective={objective}
              todayStatus={getTodayStatus(objective.id)}
              onSwipeSuccess={() => handleSwipeSuccess(objective.id)}
              onSwipeFail={() => handleSwipeFail(objective.id)}
            />
          ))}
          <Pressable
            style={styles.addCard}
            onPress={() => router.push("/add-objective" as never)}
          >
            <Ionicons name="add-circle" size={48} color="#64748b" />
            <Text style={styles.addText}>Ajouter un objectif</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#020617",
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 16,
  },
  percentageCard: {
    backgroundColor: "#0f172a",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#334155",
  },
  percentageLabel: {
    color: "#94a3b8",
    fontSize: 14,
    marginBottom: 8,
  },
  percentageValue: {
    color: "#38bdf8",
    fontSize: 56,
    fontWeight: "bold",
  },
  percentageSubtext: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 4,
  },
  statsCard: {
    backgroundColor: "#020617",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1e293b",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  statsTitle: {
    color: "#e2e8f0",
    fontSize: 15,
    fontWeight: "600",
  },
  statsSubtitle: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 2,
  },
  list: {
    gap: 12,
  },
  addCard: {
    width: "100%",
    minHeight: 120,
    backgroundColor: "#0f172a",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#334155",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  addText: {
    color: "#64748b",
    marginTop: 8,
    fontSize: 14,
  },
});
