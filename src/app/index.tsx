import { useRouter } from "expo-router";
import {
  Alert,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { calculateStreak, useHabits } from "../hooks/useHabits";
import { Habit } from "../types/habit";

function todayKey(): string {
  return new Date().toISOString().split("T")[0];
}

export default function HomeScreen() {
  const { habits, loading, toggleToday, deleteHabit } = useHabits();
  const router = useRouter();
  const today = todayKey();

  const completedCount = habits.filter((h) => h.completions[today]).length;

  function confirmDelete(habit: Habit) {
    Alert.alert("Hapus Habit", `Yakin ingin menghapus "${habit.name}"?`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => deleteHabit(habit.id),
      },
    ]);
  }

  function renderItem({ item }: { item: Habit }) {
    const isDone = !!item.completions[today];
    const streak = calculateStreak(item);

    return (
      <Pressable
        onPress={() => toggleToday(item.id)}
        onLongPress={() => confirmDelete(item)}
        style={[styles.card, isDone && styles.cardDone]}
      >
        <View style={styles.cardLeft}>
          <Text style={styles.emoji}>{item.emoji}</Text>
          <View>
            <Text style={styles.habitName}>{item.name}</Text>
            <Text style={styles.streakText}>🔥 {streak} hari beruntun</Text>
          </View>
        </View>
        <View style={[styles.checkbox, isDone && styles.checkboxDone]}>
          {isDone && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <View style={styles.header}>
        <Text style={styles.title}>RutinKu</Text>
        <Text style={styles.subtitle}>
          {habits.length === 0
            ? "Belum ada rutinitas"
            : `${completedCount}/${habits.length} selesai hari ini`}
        </Text>
      </View>

      {!loading && habits.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🌱</Text>
          <Text style={styles.emptyText}>Mulai bangun rutinitas pertamamu</Text>
        </View>
      )}

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      <Pressable style={styles.fab} onPress={() => router.push("/add-habit")}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const PRIMARY = "#4F46E5";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF0F3",
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.5,
  },
  subtitle: { fontSize: 13, color: "#6B7280", marginTop: 4 },
  list: { padding: 16, paddingTop: 16, paddingBottom: 110, flexGrow: 1 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardDone: { backgroundColor: "#EEF2FF", borderColor: PRIMARY },
  cardLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  emoji: { fontSize: 28, marginRight: 4 },
  habitName: { fontSize: 16, fontWeight: "600", color: "#111827" },
  streakText: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDone: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  checkmark: { color: "#fff", fontWeight: "700" },
  emptyState: { alignItems: "center", marginTop: 80 },
  emptyEmoji: { fontSize: 48, marginBottom: 8 },
  emptyText: { color: "#6B7280", fontSize: 14 },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
  },
  fabText: { color: "#fff", fontSize: 30, fontWeight: "700", marginTop: -2 },
});
