import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useObjectives } from "../context/ObjectivesContext";

const DURATION_OPTIONS = [
  { label: "7 jours", value: 7 },
  { label: "21 jours", value: 21 },
  { label: "30 jours", value: 30 },
  { label: "90 jours", value: 90 },
  { label: "180 jours", value: 180 },
  { label: "365 jours", value: 365 },
];

export default function AddObjective() {
  const router = useRouter();
  const { addObjective } = useObjectives();
  const [name, setName] = useState("");
  const [durationDays, setDurationDays] = useState(30);

  const handleAdd = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert("Erreur", "Veuillez entrer un nom pour l'objectif.");
      return;
    }
    await addObjective(trimmed, durationDays);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <Text style={styles.label}>Nom de l'objectif</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 3 mois sans Windows"
          placeholderTextColor="#64748b"
          value={name}
          onChangeText={setName}
          autoFocus
        />

        <Text style={styles.label}>Durée</Text>
        <View style={styles.durationGrid}>
          {DURATION_OPTIONS.map((opt) => (
            <Pressable
              key={opt.value}
              style={[
                styles.durationOption,
                durationDays === opt.value && styles.durationOptionActive,
              ]}
              onPress={() => setDurationDays(opt.value)}
            >
              <Text
                style={[
                  styles.durationText,
                  durationDays === opt.value && styles.durationTextActive,
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.addButton} onPress={handleAdd}>
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Ajouter l'objectif</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
  content: {
    flex: 1,
    padding: 24,
  },
  label: {
    color: "#94a3b8",
    fontSize: 14,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 12,
    padding: 16,
    color: "#f8fafc",
    fontSize: 16,
  },
  durationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },
  durationOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#0f172a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  durationOptionActive: {
    borderColor: "#38bdf8",
    backgroundColor: "rgba(56, 189, 248, 0.15)",
  },
  durationText: {
    color: "#94a3b8",
    fontSize: 14,
  },
  durationTextActive: {
    color: "#38bdf8",
    fontWeight: "600",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#38bdf8",
    padding: 16,
    borderRadius: 12,
    marginTop: 32,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
