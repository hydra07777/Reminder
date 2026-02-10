import MotivationCard from "@/components/MotivationCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const MOTIVATIONS = [
  "la discipline bat la motivation",
  "fais aujoirud'hui ce que les autrres ne font pas",
  "la constance cree les champions.",
  "chaque jour est une nouvelle chance.",
  "tu es plus fort que tes excuses.",
];

const BUTTONTEXT = ["on continue", "ahhhe", "lets go"];

export default function Index() {
  const [quote, setQuote] = useState(MOTIVATIONS[0]);
  const [buttonT, setButtonT] = useState(BUTTONTEXT[0]);

  useEffect(() => {
    const loadQuote = async () => {
      const savedQuotes = await AsyncStorage.getItem("lastQuote");
      if (savedQuotes) setQuote(savedQuotes);
    };
    loadQuote();
  }, []);

  const changeMotivation = async () => {
    const index = Math.floor(Math.random() * MOTIVATIONS.length);
    const newQuote = MOTIVATIONS[index];

    setQuote(newQuote);
    await AsyncStorage.setItem("lastQuote", newQuote);
  };

  const changeQutote = async () => {
    const indexButton = Math.floor(Math.random() * BUTTONTEXT.length);
    let newQuote;
    do {
      newQuote = MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)];
    } while (newQuote === quote);
    setQuote(newQuote);
    await AsyncStorage.setItem("lastQuote", newQuote);
    setButtonT(BUTTONTEXT[indexButton]);
  };

  return (
    <View style={styles.container}>
      <MotivationCard quote={quote} />
      <Pressable
        style={styles.button}
        onPress={() => {
          changeMotivation;
          scheduleNotification();
        }}
      >
        <Text style={styles.buttonText}>Nouvelle motivation</Text>
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

  button: {
    marginTop: 30,
    backgroundColor: "#38bdf8",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: {
    color: "#0f172a",
    fontWeight: "bold",
  },
});
