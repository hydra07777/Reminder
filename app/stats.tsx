import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  formatDateToKey,
  getDaysInRange,
  Objective,
  useObjectives,
} from "../context/ObjectivesContext";

const XP_PER_SUCCESS = 10;

type DaySummary = {
  date: string;
  successCount: number;
  failCount: number;
};

function computeGlobalStats(objectives: Objective[]) {
  let totalDays = 0;
  let successDays = 0;
  let failDays = 0;

  const perDay = new Map<string, DaySummary>();

  objectives.forEach((obj) => {
    const days = getDaysInRange(obj.startDate, obj.durationDays);
    days.forEach((dateStr) => {
      const status = obj.dailyStatus[dateStr];
      let summary = perDay.get(dateStr);
      if (!summary) {
        summary = { date: dateStr, successCount: 0, failCount: 0 };
        perDay.set(dateStr, summary);
      }

      totalDays++;
      if (status === "success") {
        successDays++;
        summary.successCount += 1;
      } else if (status === "fail") {
        failDays++;
        summary.failCount += 1;
      }
    });
  });

  const xp = successDays * XP_PER_SUCCESS;
  const successRate =
    totalDays > 0 ? Math.round((successDays / totalDays) * 100) : 0;

  // Derniers 7 jours
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const last7: DaySummary[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDateToKey(d);
    const summary = perDay.get(dateStr) ?? {
      date: dateStr,
      successCount: 0,
      failCount: 0,
    };
    last7.push(summary);
  }

  // Longue plus grande série globale (au moins un succès par jour)
  const allDatesSorted = Array.from(perDay.keys()).sort();
  let longestStreak = 0;
  let current = 0;
  let prevDate: string | null = null;
  for (const dateStr of allDatesSorted) {
    const s = perDay.get(dateStr)!;
    const hasSuccess = s.successCount > 0;
    if (!hasSuccess) {
      current = 0;
      prevDate = dateStr;
      continue;
    }
    if (!prevDate) {
      current = 1;
    } else {
      const prev = new Date(prevDate);
      const cur = new Date(dateStr);
      const diff = (cur.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        current += 1;
      } else {
        current = 1;
      }
    }
    prevDate = dateStr;
    if (current > longestStreak) longestStreak = current;
  }

  return {
    xp,
    successRate,
    totalDays,
    successDays,
    failDays,
    last7,
    longestStreak,
  };
}

export default function StatsScreen() {
  const { objectives, getCurrentStreak } = useObjectives();
  const stats = computeGlobalStats(objectives);
  const currentStreak = getCurrentStreak();

  const level = Math.floor(stats.xp / 100) + 1;
  const xpInLevel = stats.xp % 100;
  const xpProgress = Math.min(1, xpInLevel / 100);

  const maxSuccessInLast7 = Math.max(
    1,
    ...stats.last7.map((d) => d.successCount),
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>XP & niveau</Text>
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.xpLabel}>XP total</Text>
              <Text style={styles.xpValue}>{stats.xp}</Text>
            </View>
            <View style={styles.levelPill}>
              <Text style={styles.levelLabel}>Niveau</Text>
              <Text style={styles.levelValue}>{level}</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { flex: xpProgress, minWidth: 8 }]}
            />
            <View style={{ flex: 1 - xpProgress }} />
          </View>
          <Text style={styles.progressText}>
            {xpInLevel}/100 XP avant le prochain niveau
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance globale</Text>
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={styles.statBlock}>
              <Text style={styles.statValue}>{stats.successRate}%</Text>
              <Text style={styles.statLabel}>Taux de réussite</Text>
            </View>
            <View style={styles.statBlock}>
              <Text style={styles.statValue}>{currentStreak}</Text>
              <Text style={styles.statLabel}>Série actuelle 🔥</Text>
            </View>
            <View style={styles.statBlock}>
              <Text style={styles.statValue}>{stats.longestStreak}</Text>
              <Text style={styles.statLabel}>Meilleure série</Text>
            </View>
          </View>

          <View style={styles.barContainer}>
            <View style={styles.barBackground}>
              <View
                style={[
                  styles.barSuccess,
                  {
                    flex:
                      stats.totalDays === 0
                        ? 0
                        : stats.successDays / stats.totalDays,
                  },
                ]}
              />
              <View
                style={[
                  styles.barFail,
                  {
                    flex:
                      stats.totalDays === 0
                        ? 0
                        : stats.failDays / stats.totalDays,
                  },
                ]}
              />
            </View>
            <View style={styles.barLegend}>
              <View style={styles.barLegendItem}>
                <View style={[styles.legendDot, styles.legendSuccess]} />
                <Text style={styles.legendText}>
                  Réussis ({stats.successDays})
                </Text>
              </View>
              <View style={styles.barLegendItem}>
                <View style={[styles.legendDot, styles.legendFail]} />
                <Text style={styles.legendText}>
                  Échoués ({stats.failDays})
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Activité (7 derniers jours)</Text>
          <Ionicons name="calendar" size={18} color="#64748b" />
        </View>
        <View style={styles.card}>
          <View style={styles.last7Row}>
            {stats.last7.map((day) => {
              const total = day.successCount + day.failCount;
              const h =
                total === 0
                  ? 10
                  : 20 + (day.successCount / maxSuccessInLast7) * 50;
              const date = new Date(day.date);
              const label = date.toLocaleDateString("fr-FR", {
                weekday: "short",
              });
              return (
                <View key={day.date} style={styles.dayColumn}>
                  <View style={[styles.dayBar, { height: h }]}>
                    <View
                      style={[
                        styles.dayBarInner,
                        day.successCount > 0
                          ? styles.dayBarSuccess
                          : day.failCount > 0
                            ? styles.dayBarFail
                            : styles.dayBarEmpty,
                      ]}
                    />
                  </View>
                  <Text style={styles.dayLabel}>{label}</Text>
                </View>
              );
            })}
          </View>
          <Text style={styles.last7Hint}>
            Barre pleine = au moins un objectif réussi ce jour-là.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 20,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    color: "#e2e8f0",
    fontSize: 16,
    fontWeight: "600",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#0f172a",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1e293b",
    gap: 12,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  xpLabel: {
    color: "#94a3b8",
    fontSize: 13,
  },
  xpValue: {
    color: "#38bdf8",
    fontSize: 32,
    fontWeight: "bold",
  },
  levelPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#020617",
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#334155",
    gap: 6,
  },
  levelLabel: {
    color: "#64748b",
    fontSize: 12,
  },
  levelValue: {
    color: "#facc15",
    fontWeight: "bold",
    fontSize: 16,
  },
  progressBar: {
    flexDirection: "row",
    backgroundColor: "#020617",
    borderRadius: 9999,
    overflow: "hidden",
    height: 10,
  },
  progressFill: {
    backgroundColor: "#22c55e",
    borderRadius: 9999,
  },
  progressText: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 4,
  },
  statBlock: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    color: "#38bdf8",
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#94a3b8",
    fontSize: 11,
    marginTop: 2,
    textAlign: "center",
  },
  barContainer: {
    marginTop: 12,
    gap: 8,
  },
  barBackground: {
    flexDirection: "row",
    backgroundColor: "#020617",
    borderRadius: 9999,
    overflow: "hidden",
    height: 14,
  },
  barSuccess: {
    backgroundColor: "#22c55e",
  },
  barFail: {
    backgroundColor: "#ef4444",
  },
  barLegend: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  barLegendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendSuccess: {
    backgroundColor: "#22c55e",
  },
  legendFail: {
    backgroundColor: "#ef4444",
  },
  legendText: {
    color: "#64748b",
    fontSize: 12,
  },
  last7Row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 8,
  },
  dayColumn: {
    alignItems: "center",
    flex: 1,
  },
  dayBar: {
    width: 16,
    borderRadius: 9999,
    justifyContent: "flex-end",
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1e293b",
    overflow: "hidden",
  },
  dayBarInner: {
    width: "100%",
  },
  dayBarSuccess: {
    backgroundColor: "#22c55e",
  },
  dayBarFail: {
    backgroundColor: "#ef4444",
  },
  dayBarEmpty: {
    backgroundColor: "#1e293b",
  },
  dayLabel: {
    marginTop: 4,
    color: "#64748b",
    fontSize: 11,
  },
  last7Hint: {
    marginTop: 8,
    color: "#64748b",
    fontSize: 12,
  },
});

