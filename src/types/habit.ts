export interface Habit {
  id: string;
  name: string;
  emoji: string;
  createdAt: string; // ISO date
  // key = "YYYY-MM-DD", value = true jika sudah dikerjakan pada hari itu
  completions: Record<string, boolean>;
}
