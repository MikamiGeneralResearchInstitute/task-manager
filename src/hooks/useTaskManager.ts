import { useState, useEffect, useCallback } from 'react';
import type { AppData, HabitTask, HabitHistory, OneOffTask, Priority } from '../types';

// ─── LocalStorage persistence ──────────────────────────────────────────────

const STORAGE_KEY = 'task-manager-data';

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AppData;
  } catch {
    // ignore parse errors
  }
  return { habits: [], habitHistory: [], tasks: [] };
}

function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function todayString(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function uid(): string {
  return crypto.randomUUID();
}

/**
 * Reset `completedToday` for habits whose lastResetDate is before today.
 * Returns a new habits array (mutates nothing).
 */
function applyDailyReset(habits: HabitTask[]): HabitTask[] {
  const today = todayString();
  return habits.map((h) =>
    h.lastResetDate < today
      ? { ...h, completedToday: false, lastResetDate: today }
      : h
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────

export function useTaskManager() {
  const [data, setData] = useState<AppData>(() => {
    const loaded = loadData();
    return { ...loaded, habits: applyDailyReset(loaded.habits) };
  });

  // Persist on every change
  useEffect(() => {
    saveData(data);
  }, [data]);

  // Poll every minute to detect day-rollover while the tab is open
  useEffect(() => {
    const id = setInterval(() => {
      setData((prev) => {
        const resetHabits = applyDailyReset(prev.habits);
        const changed = resetHabits.some(
          (h, i) => h.completedToday !== prev.habits[i].completedToday
        );
        return changed ? { ...prev, habits: resetHabits } : prev;
      });
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  // ─── Habit actions ──────────────────────────────────────────────────────

  const addHabit = useCallback((name: string) => {
    const today = todayString();
    const habit: HabitTask = {
      id: uid(),
      name,
      completedToday: false,
      lastResetDate: today,
    };
    setData((prev) => ({ ...prev, habits: [...prev.habits, habit] }));
  }, []);

  const toggleHabit = useCallback((id: string) => {
    setData((prev) => {
      const habits = prev.habits.map((h) => {
        if (h.id !== id) return h;
        const nowCompleted = !h.completedToday;
        return { ...h, completedToday: nowCompleted };
      });

      const habit = prev.habits.find((h) => h.id === id);
      if (!habit) return { ...prev, habits };

      // Record history only when marking complete
      const habitHistory = habit.completedToday
        ? prev.habitHistory.filter(
            (entry) =>
              !(
                entry.taskId === id &&
                entry.completedAt.startsWith(todayString())
              )
          )
        : [
            ...prev.habitHistory,
            {
              taskId: id,
              taskName: habit.name,
              completedAt: new Date().toISOString(),
            } satisfies HabitHistory,
          ];

      return { ...prev, habits, habitHistory };
    });
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      habits: prev.habits.filter((h) => h.id !== id),
    }));
  }, []);

  const renameHabit = useCallback((id: string, name: string) => {
    setData((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => (h.id === id ? { ...h, name } : h)),
    }));
  }, []);

  // ─── One-off task actions ───────────────────────────────────────────────

  const addTask = useCallback(
    (fields: {
      title: string;
      priority: Priority;
      dueDate: string | null;
      tags: string[];
      memo: string;
    }) => {
      const task: OneOffTask = {
        id: uid(),
        ...fields,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setData((prev) => ({ ...prev, tasks: [...prev.tasks, task] }));
    },
    []
  );

  const updateTask = useCallback(
    (id: string, fields: Partial<Omit<OneOffTask, 'id' | 'createdAt'>>) => {
      setData((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === id ? { ...t, ...fields } : t
        ),
      }));
    },
    []
  );

  const deleteTask = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ),
    }));
  }, []);

  // ─── Export ─────────────────────────────────────────────────────────────

  /** Download the current data as a JSON file */
  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `task-manager-${todayString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  return {
    habits: data.habits,
    habitHistory: data.habitHistory,
    tasks: data.tasks,
    addHabit,
    toggleHabit,
    deleteHabit,
    renameHabit,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    exportJson,
  };
}
