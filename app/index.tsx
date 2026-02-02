import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reminder</Text>
      <Pressable
        style={styles.button}
        onPress={() => router.push("/motivation")}
      >
        <Text style={styles.buttonText}>voir la motivation</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    color: "#38bdf8",
    fontWeight: "bold",
    marginBottom: 40,
  },
  content: {
    flex: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  footer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    color: "#38bdf8",
    fontWeight: "bold",
  },
  quote: {
    fontSize: 20,
    color: "#e5e7eb",
    textAlign: "center",
    fontStyle: "italic",
  },
  button: {
    backgroundColor: "#38bdf8",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "bold",
  },
});
