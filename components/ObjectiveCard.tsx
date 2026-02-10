import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { DayStatus, Objective } from "../context/ObjectivesContext";
import { getObjectiveProgress } from "../context/ObjectivesContext";

const SWIPE_THRESHOLD = 80;
const SPRING_CONFIG = { damping: 20, stiffness: 200 };

interface ObjectiveCardProps {
  objective: Objective;
  onSwipeSuccess: () => void;
  onSwipeFail: () => void;
  todayStatus: DayStatus;
}

export default function ObjectiveCard({
  objective,
  onSwipeSuccess,
  onSwipeFail,
  todayStatus,
}: ObjectiveCardProps) {
  const router = useRouter();
  const translateX = useSharedValue(0);
  const { success, total, percentage } = getObjectiveProgress(objective);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-15, 15])
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      if (e.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(-400, {}, () => {
          runOnJS(onSwipeSuccess)();
          translateX.value = withSpring(0);
        });
      } else if (e.translationX > SWIPE_THRESHOLD) {
        translateX.value = withTiming(400, {}, () => {
          runOnJS(onSwipeFail)();
          translateX.value = withSpring(0);
        });
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const leftOverlayStyle = useAnimatedStyle(() => ({
    opacity: Math.min(
      1,
      Math.max(0, -translateX.value / SWIPE_THRESHOLD) * 0.8,
    ),
  }));

  const rightOverlayStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, Math.max(0, translateX.value / SWIPE_THRESHOLD) * 0.8),
  }));

  const handlePress = () => {
    router.push(`/objective/${objective.id}`);
  };

  return (
    <View style={styles.wrapper}>
      <Pressable onPress={handlePress} style={styles.pressable}>
        <View style={styles.cardContainer}>
          <Animated.View style={[styles.successOverlay, leftOverlayStyle]}>
            <Ionicons name="checkmark-circle" size={40} color="#22c55e" />
            <Text style={styles.overlayText}>OK</Text>
          </Animated.View>
          <Animated.View style={[styles.failOverlay, rightOverlayStyle]}>
            <Ionicons name="close-circle" size={40} color="#ef4444" />
            <Text style={styles.overlayText}>Non</Text>
          </Animated.View>
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.card, animatedStyle]}>
              <Text style={styles.objectiveName} numberOfLines={2}>
                {objective.name}
              </Text>
              <View style={styles.statsRow}>
                <Text style={styles.percentage}>{percentage}%</Text>
                <Text style={styles.daysText}>
                  {success}/{total} jours
                </Text>
              </View>
              {todayStatus && (
                <View
                  style={[
                    styles.todayBadge,
                    todayStatus === "success"
                      ? styles.todaySuccess
                      : styles.todayFail,
                  ]}
                >
                  <Text style={styles.todayBadgeText}>
                    Aujourd'hui: {todayStatus === "success" ? "✓" : "✗"}
                  </Text>
                </View>
              )}
              <Text style={styles.hint}>Glisse ← OK | Non →</Text>
            </Animated.View>
          </GestureDetector>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginBottom: 12,
  },
  pressable: {
    width: "100%",
  },
  cardContainer: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
    borderRadius: 16,
  },
  card: {
    backgroundColor: "#0f172a",
    padding: 18,
    borderRadius: 16,
    minHeight: 120,
    borderWidth: 1,
    borderColor: "#334155",
  },
  successOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "50%",
    backgroundColor: "rgba(34, 197, 94, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  failOverlay: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "50%",
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  overlayText: {
    color: "#fff",
    fontWeight: "bold",
    marginTop: 4,
  },
  objectiveName: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  percentage: {
    color: "#38bdf8",
    fontSize: 24,
    fontWeight: "bold",
  },
  daysText: {
    color: "#94a3b8",
    fontSize: 12,
  },
  todayBadge: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  todaySuccess: {
    backgroundColor: "rgba(34, 197, 94, 0.3)",
  },
  todayFail: {
    backgroundColor: "rgba(239, 68, 68, 0.3)",
  },
  todayBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  hint: {
    marginTop: 8,
    color: "#64748b",
    fontSize: 10,
  },
});
