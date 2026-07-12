import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Habit } from "../types/habit";

const STORAGE_KEY = "@rutinku_habits";

function todayKey(): string {
  return new Date().toISOString().split("T")[0];
}

export function calculateStreak(habit: Habit): number {
  let streak = 0;
  let cursor = new Date();

  if (!habit.completions[todayKey()]) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (true) {
    const key = cursor.toISOString().split("T")[0];
    if (habit.completions[key]) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

interface HabitsContextValue {
  habits: Habit[];
  loading: boolean;
  addHabit: (name: string, emoji: string) => Promise<void>;
  toggleToday: (habitId: string) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  reload: () => Promise<void>;
}

const HabitsContext = createContext<HabitsContextValue | undefined>(undefined);

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      setHabits(raw ? JSON.parse(raw) : []);
    } catch (e) {
      console.error("Gagal memuat habit:", e);
      setHabits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Gunakan updater function agar selalu berbasis state TERBARU,
  // bukan closure lama — ini mencegah data hilang saat operasi beruntun.
  const persist = useCallback(async (updater: (prev: Habit[]) => Habit[]) => {
    setHabits((prev) => {
      const next = updater(prev);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch((e) =>
        console.error("Gagal menyimpan habit:", e),
      );
      return next;
    });
  }, []);

  const addHabit = useCallback(
    async (name: string, emoji: string) => {
      const newHabit: Habit = {
        id: Date.now().toString(),
        name: name.trim(),
        emoji: emoji || "✅",
        createdAt: new Date().toISOString(),
        completions: {},
      };
      await persist((prev) => [newHabit, ...prev]);
    },
    [persist],
  );

  const toggleToday = useCallback(
    async (habitId: string) => {
      const key = todayKey();
      await persist((prev) =>
        prev.map((h) => {
          if (h.id !== habitId) return h;
          const completions = { ...h.completions };
          if (completions[key]) {
            delete completions[key];
          } else {
            completions[key] = true;
          }
          return { ...h, completions };
        }),
      );
    },
    [persist],
  );

  const deleteHabit = useCallback(
    async (habitId: string) => {
      await persist((prev) => prev.filter((h) => h.id !== habitId));
    },
    [persist],
  );

  return (
    <HabitsContext.Provider
      value={{
        habits,
        loading,
        addHabit,
        toggleToday,
        deleteHabit,
        reload: load,
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabits() {
  const ctx = useContext(HabitsContext);
  if (!ctx) {
    throw new Error("useHabits harus dipakai di dalam <HabitsProvider>");
  }
  return ctx;
}
