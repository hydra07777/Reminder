import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#020617" },
        headerTintColor: "#38bdf8",
      }}
    />
  );
}
