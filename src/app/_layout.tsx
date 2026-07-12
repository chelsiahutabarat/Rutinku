import { Stack } from "expo-router";
import { HabitsProvider } from "../hooks/useHabits";

export default function RootLayout() {
  return (
    <HabitsProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="add-habit"
          options={{
            headerShown: true,
            title: "Tambah Rutinitas",
            presentation: "modal",
          }}
        />
      </Stack>
    </HabitsProvider>
  );
}
