import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHabits } from "../hooks/useHabits";

const EMOJI_OPTIONS = [
  "✅",
  "💧",
  "🏃",
  "📖",
  "🧘",
  "🥗",
  "😴",
  "💻",
  "🙏",
  "🎯",
];

export default function AddHabitScreen() {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(EMOJI_OPTIONS[0]);
  const { addHabit } = useHabits();
  const router = useRouter();

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert(
        "Nama kosong",
        "Beri nama untuk rutinitasmu terlebih dahulu.",
      );
      return;
    }
    await addHabit(name, emoji);
    router.back();
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Rutinitas Baru</Text>

          <Text style={styles.label}>Nama Rutinitas</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Misal: Minum air 2 liter"
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.label}>Pilih Ikon</Text>
          <View style={styles.emojiGrid}>
            {EMOJI_OPTIONS.map((e) => (
              <Pressable
                key={e}
                onPress={() => setEmoji(e)}
                style={[
                  styles.emojiOption,
                  emoji === e && styles.emojiOptionSelected,
                ]}
              >
                <Text style={styles.emojiText}>{e}</Text>
              </Pressable>
            ))}
          </View>

          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Simpan Rutinitas</Text>
          </Pressable>

          <Pressable style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>Batal</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const PRIMARY = "#4F46E5";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  content: { padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
  },
  emojiGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 4 },
  emojiOption: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  emojiOptionSelected: { borderColor: PRIMARY, backgroundColor: "#EEF2FF" },
  emojiText: { fontSize: 22 },
  saveButton: {
    backgroundColor: PRIMARY,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 28,
  },
  saveButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  cancelButton: { paddingVertical: 14, alignItems: "center" },
  cancelButtonText: { color: "#6B7280", fontSize: 14 },
});
