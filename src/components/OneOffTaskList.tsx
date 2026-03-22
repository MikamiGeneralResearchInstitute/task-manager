import { useState } from 'react';
import { Plus, ListTodo } from 'lucide-react';
import type { OneOffTask, Priority } from '../types';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';

interface Props {
  tasks: OneOffTask[];
  onAdd: (fields: {
    title: string;
    priority: Priority;
    dueDate: string | null;
    tags: string[];
    memo: string;
  }) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, fields: Partial<Omit<OneOffTask, 'id' | 'createdAt'>>) => void;
}

type FilterType = 'all' | 'active' | 'completed';

export function OneOffTaskList({ tasks, onAdd, onToggle, onDelete, onUpdate }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<FilterType>('active');

  const filtered = tasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  // Sort: incomplete first, then by priority weight, then by due date
  const priorityWeight: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
  const sorted = [...filtered].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (a.priority !== b.priority)
      return priorityWeight[a.priority] - priorityWeight[b.priority];
    if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });

  const activeCount = tasks.filter((t) => !t.completed).length;

  return (
    <section className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListTodo size={20} className="text-indigo-400" />
          <h2 className="text-base font-semibold text-gray-700">対応タスク</h2>
        </div>
        <span className="text-xs text-gray-400">{activeCount} 件未完了</span>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {(['active', 'all', 'completed'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${
              filter === f
                ? 'bg-white text-gray-700 shadow-sm font-medium'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {f === 'active' ? '未完了' : f === 'completed' ? '完了済み' : 'すべて'}
          </button>
        ))}
      </div>

      {/* Add task button / form */}
      {showForm ? (
        <TaskForm
          onSubmit={(fields) => {
            onAdd(fields);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 text-sm text-indigo-500 hover:text-indigo-700 border border-dashed border-indigo-200 hover:border-indigo-400 rounded-xl px-4 py-2.5 transition-colors"
        >
          <Plus size={16} />
          タスクを追加
        </button>
      )}

      {/* List */}
      {sorted.length === 0 ? (
        <p className="text-sm text-gray-300 text-center py-8">タスクがありません</p>
      ) : (
        <div className="flex flex-col gap-2">
          {sorted.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </section>
  );
}
