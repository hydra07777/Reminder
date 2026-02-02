import { StyleSheet, Text, View } from "react-native";

interface MotivationType {
  quote: String;
  author?: String;
}

export default function MotivationCard({ quote, author }: MotivationType) {
  return (
    <View style={styles.card}>
      <Text style={styles.Text}>{quote}</Text>
      {author && <Text style={styles.author}>{author}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#020617",
    boxShadow: "0 2 3",
    padding: 24,
    borderRadius: 16,
  },
  Text: {
    color: "#e5e7eb",
    fontSize: 20,
    textAlign: "center",
    fontStyle: "italic",
  },
  author: {
    color: "#e5e",
    fontSize: 10,
  },
});
