import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useObjectives } from "../context/ObjectivesContext";

type TimeOfDay = "morning" | "noon" | "evening";

function getTimeOfDay(): TimeOfDay {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 18) return "noon";
  return "evening";
}

const TIME_CONFIG: Record<
  TimeOfDay,
  { emoji: string; label: string; ringColor: string }
> = {
  morning: { emoji: "🌅", label: "Bon matin", ringColor: "#fbbf24" },
  noon: { emoji: "☀️", label: "Bonne journée", ringColor: "#f59e0b" },
  evening: { emoji: "🌙", label: "Bonne soirée", ringColor: "#6366f1" },
};

type DynamicLogoProps = {
  size?: number;
  showStreakBadge?: boolean;
  showLabel?: boolean;
};

export default function DynamicLogo({
  size = 96,
  showStreakBadge = true,
  showLabel = false,
}: DynamicLogoProps) {
  const { getCurrentStreak } = useObjectives();

  const timeOfDay = useMemo(getTimeOfDay, []);
  const streak = getCurrentStreak();
  const config = TIME_CONFIG[timeOfDay];

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.logoWrapper,
          {
            width: size + 24,
            height: size + 24,
            borderRadius: (size + 24) / 2,
          },
        ]}
      >
        <View
          style={[
            styles.ring,
            {
              width: size + 24,
              height: size + 24,
              borderRadius: (size + 24) / 2,
              borderColor: config.ringColor,
            },
          ]}
        />
        <View style={[styles.logoContainer, { width: size, height: size }]}>
          <View style={styles.emojiBadge}>
            <Text style={[styles.emoji, { fontSize: size * 0.22 }]}>
              {config.emoji}
            </Text>
          </View>
          {showStreakBadge && streak >= 3 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={styles.streakCount}>{streak}</Text>
            </View>
          )}
        </View>
      </View>
      {showLabel && <Text style={styles.label}>{config.label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  ring: {
    position: "absolute",
    borderWidth: 3,
  },
  logoContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    borderRadius: 9999,
  },
  emojiBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: "#0f172a",
    borderRadius: 9999,
    padding: 4,
    borderWidth: 2,
    borderColor: "#334155",
  },
  emoji: {},
  streakBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: "#f59e0b",
    gap: 4,
  },
  streakEmoji: {
    fontSize: 14,
  },
  streakCount: {
    color: "#fbbf24",
    fontWeight: "bold",
    fontSize: 14,
  },
  label: {
    marginTop: 8,
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "600",
  },
});
