import { useState } from 'react';
import { CheckCircle2, Circle, Trash2, Pencil, ChevronDown, ChevronUp, Tag, Calendar, AlignLeft } from 'lucide-react';
import type { OneOffTask, Priority } from '../types';
import { TaskForm } from './TaskForm';

interface Props {
  task: OneOffTask;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, fields: Partial<Omit<OneOffTask, 'id' | 'createdAt'>>) => void;
}

const PRIORITY_STYLES: Record<Priority, string> = {
  high: 'bg-red-50 text-red-600 border-red-200',
  medium: 'bg-amber-50 text-amber-600 border-amber-200',
  low: 'bg-sky-50 text-sky-600 border-sky-200',
};

const PRIORITY_LABEL: Record<Priority, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

function isPastDue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return dueDate < new Date().toISOString().slice(0, 10);
}

export function TaskCard({ task, onToggle, onDelete, onUpdate }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);

  const pastDue = !task.completed && isPastDue(task.dueDate);

  if (editing) {
    return (
      <TaskForm
        initialValues={task}
        onSubmit={(fields) => {
          onUpdate(task.id, fields);
          setEditing(false);
        }}
        onCancel={() => setEditing(false)}
        submitLabel="更新"
      />
    );
  }

  return (
    <div
      className={`rounded-xl border transition-colors ${
        task.completed
          ? 'bg-gray-50 border-gray-100'
          : pastDue
          ? 'bg-red-50 border-red-200'
          : 'bg-white border-gray-200'
      }`}
    >
      {/* Main row */}
      <div className="flex items-start gap-3 px-4 py-3">
        <button
          onClick={() => onToggle(task.id)}
          className={`shrink-0 mt-0.5 transition-colors ${
            task.completed
              ? 'text-emerald-500'
              : 'text-gray-300 hover:text-emerald-400'
          }`}
        >
          {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-sm font-medium ${
                task.completed ? 'line-through text-gray-400' : 'text-gray-800'
              }`}
            >
              {task.title}
            </span>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                PRIORITY_STYLES[task.priority]
              }`}
            >
              {PRIORITY_LABEL[task.priority]}
            </span>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            {task.dueDate && (
              <span
                className={`flex items-center gap-1 text-xs ${
                  pastDue ? 'text-red-500 font-medium' : 'text-gray-400'
                }`}
              >
                <Calendar size={12} />
                {task.dueDate}
                {pastDue && ' (期限切れ)'}
              </span>
            )}
            {task.tags.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Tag size={12} />
                {task.tags.join(', ')}
              </span>
            )}
            {task.memo && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <AlignLeft size={12} />
                メモあり
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1 shrink-0">
          {(task.memo || task.tags.length > 0) && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="p-1 text-gray-300 hover:text-gray-500 transition-colors"
            >
              {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          )}
          <button
            onClick={() => setEditing(true)}
            className="p-1 text-gray-300 hover:text-gray-500 transition-colors"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-gray-300 hover:text-red-400 transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (task.memo || task.tags.length > 0) && (
        <div className="px-4 pb-3 pt-0 border-t border-gray-100 mt-1 space-y-2">
          {task.tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {task.memo && (
            <p className="text-xs text-gray-500 whitespace-pre-wrap leading-relaxed">
              {task.memo}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
