import { useState } from 'react';
import { Plus, Flame, History } from 'lucide-react';
import type { HabitTask, HabitHistory } from '../types';
import { HabitCard } from './HabitCard';

interface Props {
  habits: HabitTask[];
  history: HabitHistory[];
  onAdd: (name: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export function HabitList({ habits, history, onAdd, onToggle, onDelete, onRename }: Props) {
  const [input, setInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  function handleAdd() {
    const trimmed = input.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setInput('');
  }

  const completedCount = habits.filter((h) => h.completedToday).length;

  // Last 20 history entries, newest first
  const recentHistory = [...history]
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
    .slice(0, 20);

  return (
    <section className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame size={20} className="text-orange-400" />
          <h2 className="text-base font-semibold text-gray-700">習慣タスク</h2>
        </div>
        <span className="text-xs text-gray-400">
          {completedCount} / {habits.length} 完了
        </span>
      </div>

      {/* Progress bar */}
      {habits.length > 0 && (
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / habits.length) * 100}%` }}
          />
        </div>
      )}

      {/* Add input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="新しい習慣を追加..."
          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-400 transition-colors placeholder:text-gray-300"
        />
        <button
          onClick={handleAdd}
          disabled={!input.trim()}
          className="bg-emerald-500 text-white rounded-lg px-3 py-2 hover:bg-emerald-600 disabled:opacity-40 transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* List */}
      {habits.length === 0 ? (
        <p className="text-sm text-gray-300 text-center py-8">
          習慣タスクがありません
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {habits.map((h) => (
            <HabitCard
              key={h.id}
              habit={h}
              onToggle={onToggle}
              onDelete={onDelete}
              onRename={onRename}
            />
          ))}
        </div>
      )}

      {/* History toggle */}
      {history.length > 0 && (
        <div>
          <button
            onClick={() => setShowHistory((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <History size={14} />
            {showHistory ? '履歴を隠す' : '実行済み履歴を見る'}
          </button>

          {showHistory && (
            <ul className="mt-3 flex flex-col gap-1.5">
              {recentHistory.map((entry, i) => (
                <li key={i} className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                  <span>{entry.taskName}</span>
                  <span className="text-gray-400">
                    {new Date(entry.completedAt).toLocaleString('ja-JP', {
                      month: 'numeric',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
