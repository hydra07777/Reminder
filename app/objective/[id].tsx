import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  formatDateToKey,
  getDaysInRange,
  getObjectiveProgress,
  getTodayDateString,
  useObjectives,
} from "../../context/ObjectivesContext";

function formatDateForDisplay(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ObjectiveDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { objectives, deleteObjective, updateDayStatus, extendObjective } =
    useObjectives();

  // Trouver l'objectif et recalculer à chaque changement
  const objective = useMemo(
    () => objectives.find((o) => o.id === id),
    [objectives, id],
  );

  const today = new Date();

  // Tous les hooks doivent être appelés avant tout return conditionnel
  const { success, total, percentage } = useMemo(
    () =>
      objective
        ? getObjectiveProgress(objective)
        : { success: 0, total: 0, percentage: 0 },
    [objective],
  );

  const daysInRange = useMemo(
    () =>
      objective
        ? getDaysInRange(objective.startDate, objective.durationDays)
        : [],
    [objective?.startDate, objective?.durationDays],
  );

  const [displayMonth, setDisplayMonth] = useState(today.getMonth());
  const [displayYear, setDisplayYear] = useState(today.getFullYear());

  const objectiveStart = useMemo(() => {
    if (!objective) return new Date();
    const [year, month, day] = objective.startDate.split("-").map(Number);
    return new Date(year, month - 1, day);
  }, [objective?.startDate]);

  const objectiveEnd = useMemo(() => {
    if (!objective) return new Date();
    const [year, month, day] = objective.startDate.split("-").map(Number);
    return new Date(year, month - 1, day + objective.durationDays - 1);
  }, [objective?.startDate, objective?.durationDays]);

  // Fonctions de navigation
  const goToPreviousMonth = () => {
    setDisplayMonth((prev) => {
      if (prev === 0) {
        setDisplayYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const goToNextMonth = () => {
    setDisplayMonth((prev) => {
      if (prev === 11) {
        setDisplayYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const goToToday = () => {
    setDisplayMonth(today.getMonth());
    setDisplayYear(today.getFullYear());
  };

  const canGoPrevious = useMemo(() => {
    if (!objective) return false;
    const displayDate = new Date(displayYear, displayMonth, 1);
    return (
      displayDate >=
      new Date(objectiveStart.getFullYear(), objectiveStart.getMonth(), 1)
    );
  }, [objective, displayYear, displayMonth, objectiveStart]);

  const canGoNext = useMemo(() => {
    if (!objective) return false;
    const displayDate = new Date(displayYear, displayMonth, 1);
    const endDate = new Date(
      objectiveEnd.getFullYear(),
      objectiveEnd.getMonth(),
      1,
    );
    return displayDate <= endDate;
  }, [objective, displayYear, displayMonth, objectiveEnd]);

  const isCurrentMonth = useMemo(() => {
    return (
      displayMonth === today.getMonth() && displayYear === today.getFullYear()
    );
  }, [displayMonth, displayYear]);

  const { weeks, remainingDays, completedDays, failedDays, history } =
    useMemo(() => {
      if (!objective) {
        return {
          weeks: [],
          remainingDays: 0,
          completedDays: 0,
          failedDays: 0,
          history: [],
        };
      }
      const currentMonth = displayMonth;
      const currentYear = displayYear;

      // Obtenir le premier jour du mois et le nombre de jours
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
      const daysInMonth = lastDayOfMonth.getDate();

      // Obtenir le jour de la semaine du premier jour (0 = dimanche, 1 = lundi, etc.)
      const firstDayWeekday = firstDayOfMonth.getDay();
      // Convertir pour commencer la semaine le lundi (0 = lundi)
      const startOffset = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;

      // Créer les semaines du calendrier
      const weeks: Array<
        Array<{
          date: string;
          day: number;
          status: "success" | "fail" | null;
          isFuture: boolean;
          isInRange: boolean;
        }>
      > = [];
      let currentWeek: Array<{
        date: string;
        day: number;
        status: "success" | "fail" | null;
        isFuture: boolean;
        isInRange: boolean;
      }> = [];

      // Ajouter les jours vides au début
      for (let i = 0; i < startOffset; i++) {
        currentWeek.push({
          date: "",
          day: 0,
          status: null,
          isFuture: false,
          isInRange: false,
        });
      }

      // Ajouter tous les jours du mois (utiliser formatDateToKey pour cohérence timezone)
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        date.setHours(0, 0, 0, 0);
        const dateStr = formatDateToKey(date);
        const isFuture = date > today;

        // Vérifier si ce jour est dans la plage de l'objectif (parser en local)
        const [objYear, objMonth, objDay] = objective.startDate
          .split("-")
          .map(Number);
        const objectiveStart = new Date(objYear, objMonth - 1, objDay);
        objectiveStart.setHours(0, 0, 0, 0);
        const objectiveEnd = new Date(
          objYear,
          objMonth - 1,
          objDay + objective.durationDays - 1,
        );
        objectiveEnd.setHours(0, 0, 0, 0);
        const isInRange = date >= objectiveStart && date <= objectiveEnd;

        const status = isInRange
          ? objective.dailyStatus[dateStr] || null
          : null;

        currentWeek.push({
          date: dateStr,
          day,
          status,
          isFuture,
          isInRange,
        });

        // Si on a 7 jours, passer à la semaine suivante
        if (currentWeek.length === 7) {
          weeks.push(currentWeek);
          currentWeek = [];
        }
      }

      // Compléter la dernière semaine si nécessaire
      if (currentWeek.length > 0) {
        while (currentWeek.length < 7) {
          currentWeek.push({
            date: "",
            day: 0,
            status: null,
            isFuture: false,
            isInRange: false,
          });
        }
        weeks.push(currentWeek);
      }

      // Calculer les statistiques pour les jours dans la plage de l'objectif
      const allDaysInRange: Array<{
        date: string;
        status: "success" | "fail" | null;
        isFuture: boolean;
      }> = [];
      const [objYear, objMonth, objDay] = objective.startDate
        .split("-")
        .map(Number);
      for (let i = 0; i < objective.durationDays; i++) {
        const d = new Date(objYear, objMonth - 1, objDay + i);
        d.setHours(0, 0, 0, 0);
        const dateStr = formatDateToKey(d);
        const isFuture = d > today;
        const status = objective.dailyStatus[dateStr] || null;
        allDaysInRange.push({ date: dateStr, status, isFuture });
      }

      const remainingDays = allDaysInRange.filter((day) => day.isFuture).length;
      const completedDays = allDaysInRange.filter(
        (day) => day.status === "success",
      ).length;
      const failedDays = allDaysInRange.filter(
        (day) => day.status === "fail",
      ).length;

      const daysInRange = getDaysInRange(
        objective.startDate,
        objective.durationDays,
      );
      const history = daysInRange
        .map((dateStr) => ({
          date: dateStr,
          status: objective.dailyStatus[dateStr] || null,
        }))
        .reverse();

      return {
        weeks,
        remainingDays,
        completedDays,
        failedDays,
        history,
      };
    }, [objective, displayMonth, displayYear]);

  const handleDelete = () => {
    if (!objective) return;
    const id = objective.id;
    Alert.alert(
      "Supprimer l'objectif",
      "Êtes-vous sûr de vouloir supprimer cet objectif ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            deleteObjective(id);
            router.back();
          },
        },
      ],
    );
  };

  const handleExtend = (additionalDays: number) => {
    if (!objective) return;
    const newDuration = objective.durationDays + additionalDays;
    Alert.alert(
      "Prolonger l'objectif",
      `Tu veux passer de ${objective.durationDays} jours à ${newDuration} jours ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Confirmer",
          onPress: () => extendObjective(objective.id, additionalDays),
        },
      ],
    );
  };

  const handleDayStatusChange = (
    date: string,
    currentStatus: "success" | "fail" | null,
  ) => {
    if (!objective) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [year, month, day] = date.split("-").map(Number);
    const dayDate = new Date(year, month - 1, day);
    dayDate.setHours(0, 0, 0, 0);

    // Ne permettre que de modifier les jours passés non cochés
    if (dayDate > today || currentStatus !== null) {
      return;
    }

    // Proposer succès ou échec
    Alert.alert("Marquer la journée", "Comment s'est passée cette journée ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Réussi",
        onPress: () => updateDayStatus(objective.id, date, "success"),
      },
      {
        text: "Échoué",
        style: "destructive",
        onPress: () => updateDayStatus(objective.id, date, "fail"),
      },
    ]);
  };

  // Retour anticipé après tous les hooks (objectif supprimé = navigation en cours)
  if (!objective) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Objectif introuvable</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{objective.name}</Text>

        {/* Calendrier mensuel */}
        <View style={styles.calendarSection}>
          <View style={styles.calendarHeader}>
            <Pressable
              style={[
                styles.calendarNavButton,
                !canGoPrevious && styles.calendarNavButtonDisabled,
              ]}
              onPress={goToPreviousMonth}
              disabled={!canGoPrevious}
            >
              <Ionicons
                name="chevron-back"
                size={20}
                color={canGoPrevious ? "#38bdf8" : "#475569"}
              />
            </Pressable>

            <Pressable
              style={styles.calendarTitleContainer}
              onPress={goToToday}
            >
              <Text style={styles.calendarTitle}>
                {new Date(displayYear, displayMonth).toLocaleDateString(
                  "fr-FR",
                  {
                    month: "long",
                    year: "numeric",
                  },
                )}
              </Text>
              {!isCurrentMonth && (
                <Text style={styles.calendarTodayHint}>
                  Appuyez pour revenir
                </Text>
              )}
            </Pressable>

            <Pressable
              style={[
                styles.calendarNavButton,
                !canGoNext && styles.calendarNavButtonDisabled,
              ]}
              onPress={goToNextMonth}
              disabled={!canGoNext}
            >
              <Ionicons
                name="chevron-forward"
                size={20}
                color={canGoNext ? "#38bdf8" : "#475569"}
              />
            </Pressable>
          </View>

          {/* En-têtes des jours de la semaine */}
          <View style={styles.calendarWeekHeader}>
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(
              (dayName) => (
                <View key={dayName} style={styles.calendarHeaderDay}>
                  <Text style={styles.calendarHeaderText}>{dayName}</Text>
                </View>
              ),
            )}
          </View>

          {/* Semaines du calendrier */}
          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.calendarWeek}>
              {week.map((day, dayIndex) => {
                if (day.day === 0) {
                  return (
                    <View key={dayIndex} style={styles.calendarDayEmpty} />
                  );
                }

                const isToday = day.date === getTodayDateString();
                let dayStyleArray: any[] = [styles.calendarDay];

                if (!day.isInRange) {
                  dayStyleArray.push(styles.calendarDayOutOfRange);
                } else if (day.status === "success") {
                  dayStyleArray.push(styles.calendarDaySuccess);
                } else if (day.status === "fail") {
                  dayStyleArray.push(styles.calendarDayFail);
                } else if (day.isFuture) {
                  dayStyleArray.push(styles.calendarDayFuture);
                } else {
                  dayStyleArray.push(styles.calendarDayPending);
                }

                if (isToday) {
                  dayStyleArray.push(styles.calendarDayTodayBorder);
                }

                return (
                  <View key={dayIndex} style={dayStyleArray}>
                    <Text
                      style={[
                        styles.calendarDayText,
                        isToday && styles.calendarDayToday,
                        !day.isInRange && styles.calendarDayTextOutOfRange,
                      ]}
                    >
                      {day.day}
                    </Text>
                    {day.isInRange && day.status === "success" && (
                      <Ionicons
                        name="checkmark"
                        size={8}
                        color="#fff"
                        style={styles.calendarIcon}
                      />
                    )}
                    {day.isInRange && day.status === "fail" && (
                      <Ionicons
                        name="close"
                        size={8}
                        color="#fff"
                        style={styles.calendarIcon}
                      />
                    )}
                  </View>
                );
              })}
            </View>
          ))}
          <View style={styles.calendarLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.legendSuccess]} />
              <Text style={styles.legendText}>Réussi ({completedDays})</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.legendFail]} />
              <Text style={styles.legendText}>Échoué ({failedDays})</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.legendFuture]} />
              <Text style={styles.legendText}>Restant ({remainingDays})</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{percentage}%</Text>
            <Text style={styles.statLabel}>Réussite</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {success}/{total}
            </Text>
            <Text style={styles.statLabel}>Jours</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{objective.durationDays}</Text>
            <Text style={styles.statLabel}>Durée totale</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Date de début</Text>
          <Text style={styles.infoValue}>
            {formatDateForDisplay(objective.startDate)}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Durée</Text>
          <Text style={styles.infoValue}>{objective.durationDays} jours</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prolonger l'objectif</Text>
        <Text style={styles.extendHint}>
          Ajoute des jours à la durée actuelle ({objective.durationDays} jours).
        </Text>
        <View style={styles.extendRow}>
          <Pressable
            style={styles.extendButton}
            onPress={() => handleExtend(7)}
          >
            <Text style={styles.extendButtonText}>+7 jours</Text>
          </Pressable>
          <Pressable
            style={styles.extendButton}
            onPress={() => handleExtend(15)}
          >
            <Text style={styles.extendButtonText}>+15 jours</Text>
          </Pressable>
        </View>
        <View style={styles.extendRow}>
          <Pressable
            style={styles.extendButton}
            onPress={() => handleExtend(30)}
          >
            <Text style={styles.extendButtonText}>+1 mois</Text>
          </Pressable>
          <Pressable
            style={styles.extendButton}
            onPress={() => handleExtend(60)}
          >
            <Text style={styles.extendButtonText}>+2 mois</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Historique des jours</Text>
        {history.length === 0 ? (
          <Text style={styles.emptyText}>
            Aucun jour enregistré pour le moment.
          </Text>
        ) : (
          history.map(({ date, status }) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const [year, month, day] = date.split("-").map(Number);
            const dayDate = new Date(year, month - 1, day);
            dayDate.setHours(0, 0, 0, 0);
            const isFuture = dayDate > today;
            // Seulement les jours passés non cochés peuvent être modifiés
            const canEdit = !isFuture && status === null;

            return (
              <Pressable
                key={date}
                style={[
                  styles.historyRow,
                  canEdit && styles.historyRowPressable,
                ]}
                onPress={() => canEdit && handleDayStatusChange(date, status)}
                disabled={!canEdit}
              >
                <Text style={styles.historyDate}>
                  {formatDateForDisplay(date)}
                </Text>
                <View style={styles.historyStatusContainer}>
                  {status === "success" ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#22c55e"
                    />
                  ) : status === "fail" ? (
                    <Ionicons name="close-circle" size={24} color="#ef4444" />
                  ) : (
                    <View style={styles.historyUnchecked}>
                      <Ionicons
                        name="ellipse-outline"
                        size={20}
                        color={canEdit ? "#38bdf8" : "#64748b"}
                      />
                      {canEdit && (
                        <Text style={styles.historyUncheckedHint}>Appuyez</Text>
                      )}
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })
        )}
      </View>

      <Pressable
        style={[styles.deleteButton, { marginTop: 24 }]}
        onPress={handleDelete}
      >
        <Ionicons name="trash-outline" size={20} color="#ef4444" />
        <Text style={styles.deleteText}>Supprimer l'objectif</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  error: {
    color: "#ef4444",
    textAlign: "center",
    marginTop: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    color: "#f8fafc",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  statValue: {
    color: "#38bdf8",
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#94a3b8",
    fontSize: 14,
    marginBottom: 12,
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  infoLabel: {
    color: "#64748b",
    fontSize: 14,
  },
  infoValue: {
    color: "#f8fafc",
    fontSize: 14,
  },
  extendHint: {
    color: "#64748b",
    fontSize: 13,
    marginBottom: 12,
  },
  extendRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  extendButton: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  extendButtonText: {
    color: "#38bdf8",
    fontSize: 14,
    fontWeight: "600",
  },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  historyRowPressable: {
    opacity: 1,
  },
  historyDate: {
    color: "#f8fafc",
    fontSize: 14,
  },
  historyStatusContainer: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
  },
  historyUnchecked: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  historyUncheckedHint: {
    color: "#64748b",
    fontSize: 11,
    fontStyle: "italic",
  },
  historyPending: {
    color: "#64748b",
    fontSize: 14,
  },
  emptyText: {
    color: "#64748b",
    fontSize: 14,
    fontStyle: "italic",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.5)",
  },
  deleteText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "600",
  },
  calendarSection: {
    marginBottom: 24,
    backgroundColor: "#0f172a",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  calendarNavButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e293b",
  },
  calendarNavButtonDisabled: {
    opacity: 0.3,
  },
  calendarTitleContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 12,
  },
  calendarTitle: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  calendarTodayHint: {
    color: "#64748b",
    fontSize: 10,
    marginTop: 2,
  },
  calendarWeekHeader: {
    flexDirection: "row",
    marginBottom: 8,
  },
  calendarHeaderDay: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  calendarHeaderText: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "600",
  },
  calendarWeek: {
    flexDirection: "row",
    marginBottom: 4,
  },
  calendarDay: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
    position: "relative",
    marginHorizontal: 2,
  },
  calendarDayEmpty: {
    flex: 1,
    aspectRatio: 1,
    marginHorizontal: 2,
  },
  calendarDaySuccess: {
    backgroundColor: "#22c55e",
    borderColor: "#16a34a",
  },
  calendarDayFail: {
    backgroundColor: "#ef4444",
    borderColor: "#dc2626",
  },
  calendarDayFuture: {
    backgroundColor: "#1e293b",
    borderColor: "#475569",
    opacity: 0.5,
  },
  calendarDayPending: {
    backgroundColor: "#334155",
    borderColor: "#475569",
  },
  calendarDayOutOfRange: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    opacity: 0.3,
  },
  calendarDayTodayBorder: {
    borderWidth: 2,
    borderColor: "#38bdf8",
  },
  calendarDayText: {
    color: "#f8fafc",
    fontSize: 13,
    fontWeight: "600",
  },
  calendarDayTextOutOfRange: {
    color: "#64748b",
  },
  calendarDayToday: {
    color: "#38bdf8",
    fontWeight: "bold",
    fontSize: 14,
  },
  calendarIcon: {
    position: "absolute",
    bottom: 2,
  },
  calendarLegend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendSuccess: {
    backgroundColor: "#22c55e",
  },
  legendFail: {
    backgroundColor: "#ef4444",
  },
  legendFuture: {
    backgroundColor: "#475569",
    opacity: 0.5,
  },
  legendText: {
    color: "#94a3b8",
    fontSize: 12,
  },
});
