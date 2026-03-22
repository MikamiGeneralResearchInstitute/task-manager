import { useState } from 'react';
import { Download, Flame, ListTodo } from 'lucide-react';
import { useTaskManager } from './hooks/useTaskManager';
import { HabitList } from './components/HabitList';
import { OneOffTaskList } from './components/OneOffTaskList';

type Tab = 'habits' | 'tasks';

export default function App() {
  const {
    habits,
    habitHistory,
    tasks,
    addHabit,
    toggleHabit,
    deleteHabit,
    renameHabit,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    exportJson,
  } = useTaskManager();

  const [activeTab, setActiveTab] = useState<Tab>('habits');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-gray-800 tracking-tight">
            Task Manager
          </span>
          <button
            onClick={exportJson}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-400 rounded-lg px-3 py-1.5 transition-colors"
          >
            <Download size={14} />
            JSONで出力
          </button>
        </div>
      </header>

      {/* Mobile tab bar */}
      <div className="lg:hidden sticky top-14 z-10 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 flex">
          <button
            onClick={() => setActiveTab('habits')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'habits'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <Flame size={16} />
            習慣タスク
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'tasks'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <ListTodo size={16} />
            対応タスク
          </button>
        </div>
      </div>

      {/* Main layout */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Desktop: 2-column side-by-side */}
        <div className="hidden lg:grid grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <HabitList
              habits={habits}
              history={habitHistory}
              onAdd={addHabit}
              onToggle={toggleHabit}
              onDelete={deleteHabit}
              onRename={renameHabit}
            />
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <OneOffTaskList
              tasks={tasks}
              onAdd={addTask}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onUpdate={updateTask}
            />
          </div>
        </div>

        {/* Mobile: tab-based single column */}
        <div className="lg:hidden">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            {activeTab === 'habits' ? (
              <HabitList
                habits={habits}
                history={habitHistory}
                onAdd={addHabit}
                onToggle={toggleHabit}
                onDelete={deleteHabit}
                onRename={renameHabit}
              />
            ) : (
              <OneOffTaskList
                tasks={tasks}
                onAdd={addTask}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onUpdate={updateTask}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
