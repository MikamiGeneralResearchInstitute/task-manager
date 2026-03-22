// ─── Habit Task ───────────────────────────────────────────────────────────────

export interface HabitTask {
  id: string;
  name: string;
  completedToday: boolean;
  /** ISO date string of last completion reset */
  lastResetDate: string;
}

export interface HabitHistory {
  taskId: string;
  taskName: string;
  completedAt: string; // ISO string
}

// ─── One-off Task ─────────────────────────────────────────────────────────────

export type Priority = 'high' | 'medium' | 'low';

export interface OneOffTask {
  id: string;
  title: string;
  priority: Priority;
  dueDate: string | null;   // ISO date string (YYYY-MM-DD)
  tags: string[];
  memo: string;
  completed: boolean;
  createdAt: string;        // ISO string
}

// ─── Persisted state shape ────────────────────────────────────────────────────

export interface AppData {
  habits: HabitTask[];
  habitHistory: HabitHistory[];
  tasks: OneOffTask[];
}
