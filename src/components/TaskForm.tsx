import { useState } from 'react';
import { X } from 'lucide-react';
import type { OneOffTask, Priority } from '../types';

type FormFields = Omit<OneOffTask, 'id' | 'createdAt' | 'completed'>;

interface Props {
  initialValues?: Partial<FormFields>;
  onSubmit: (fields: FormFields) => void;
  onCancel: () => void;
  submitLabel?: string;
}

const PRIORITIES: Priority[] = ['high', 'medium', 'low'];
const PRIORITY_LABEL: Record<Priority, string> = { high: '高', medium: '中', low: '低' };
const PRIORITY_ACTIVE: Record<Priority, string> = {
  high: 'bg-red-500 text-white border-red-500',
  medium: 'bg-amber-500 text-white border-amber-500',
  low: 'bg-sky-500 text-white border-sky-500',
};

export function TaskForm({ initialValues, onSubmit, onCancel, submitLabel = '追加' }: Props) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [priority, setPriority] = useState<Priority>(initialValues?.priority ?? 'medium');
  const [dueDate, setDueDate] = useState(initialValues?.dueDate ?? '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialValues?.tags ?? []);
  const [memo, setMemo] = useState(initialValues?.memo ?? '');

  function addTag() {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput('');
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    onSubmit({
      title: trimmedTitle,
      priority,
      dueDate: dueDate || null,
      tags,
      memo: memo.trim(),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-indigo-200 rounded-xl p-4 flex flex-col gap-3 shadow-sm"
    >
      {/* Title */}
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タスク名 *"
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400 transition-colors placeholder:text-gray-300"
      />

      {/* Priority */}
      <div className="flex gap-2">
        {PRIORITIES.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPriority(p)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              priority === p
                ? PRIORITY_ACTIVE[p]
                : 'border-gray-200 text-gray-500 hover:border-gray-400'
            }`}
          >
            {PRIORITY_LABEL[p]}
          </button>
        ))}
      </div>

      {/* Due date */}
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400 transition-colors text-gray-600"
      />

      {/* Tags */}
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); addTag(); }
            }}
            placeholder="タグを追加 (Enter で確定)"
            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400 transition-colors placeholder:text-gray-300"
          />
        </div>
        {tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-full"
              >
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="hover:text-indigo-900">
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Memo */}
      <textarea
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="メモ（任意）"
        rows={3}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400 transition-colors resize-none placeholder:text-gray-300"
      />

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={!title.trim()}
          className="text-sm px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-40 transition-colors"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
