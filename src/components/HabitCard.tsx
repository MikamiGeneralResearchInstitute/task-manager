import { useState } from 'react';
import { CheckCircle2, Circle, Trash2, Pencil, Check, X } from 'lucide-react';
import type { HabitTask } from '../types';

interface Props {
  habit: HabitTask;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export function HabitCard({ habit, onToggle, onDelete, onRename }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(habit.name);

  function commitRename() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== habit.name) onRename(habit.id, trimmed);
    setEditing(false);
  }

  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
        habit.completedToday
          ? 'bg-emerald-50 border border-emerald-200'
          : 'bg-white border border-gray-200'
      }`}
    >
      <button
        onClick={() => onToggle(habit.id)}
        className="shrink-0 text-emerald-500 hover:text-emerald-600 transition-colors"
        aria-label={habit.completedToday ? '未完了にする' : '完了にする'}
      >
        {habit.completedToday ? (
          <CheckCircle2 size={22} />
        ) : (
          <Circle size={22} className="text-gray-300" />
        )}
      </button>

      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitRename();
            if (e.key === 'Escape') setEditing(false);
          }}
          className="flex-1 text-sm bg-transparent border-b border-gray-400 outline-none"
        />
      ) : (
        <span
          className={`flex-1 text-sm ${
            habit.completedToday
              ? 'line-through text-gray-400'
              : 'text-gray-800'
          }`}
        >
          {habit.name}
        </span>
      )}

      <div className="flex gap-1 shrink-0">
        {editing ? (
          <>
            <button
              onClick={commitRename}
              className="p-1 text-emerald-500 hover:text-emerald-600"
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => setEditing(false)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setDraft(habit.name);
                setEditing(true);
              }}
              className="p-1 text-gray-300 hover:text-gray-500 transition-colors"
              aria-label="編集"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => onDelete(habit.id)}
              className="p-1 text-gray-300 hover:text-red-400 transition-colors"
              aria-label="削除"
            >
              <Trash2 size={15} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
