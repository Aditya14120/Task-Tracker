import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Task, SuitId, FilterStatus } from './types/todo';
import { SUITS } from './utils/suits';
import { sound } from './utils/audio';
import { loadTasks, saveTasks, loadSuit, saveSuit, INITIAL_TASKS } from './utils/storage';
import { SpiderMask } from './components/SpiderMask';
import { NeighborhoodSafetyMeter } from './components/NeighborhoodSafetyMeter';
import { TaskInput, TaskInputRef } from './components/TaskInput';
import { TaskItem } from './components/TaskItem';
import {
  Volume2,
  VolumeX,
  Search,
  Plus,
  RotateCcw,
  Flame,
  CheckCircle2,
  Trash2,
  Shield,
} from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentSuitId, setCurrentSuitId] = useState<SuitId>('classic');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  // Ref to the Add Task input field for instant focus
  const taskInputRef = useRef<TaskInputRef>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    const loadedTasks = loadTasks();
    const loadedSuit = loadSuit();
    setTasks(loadedTasks);
    setCurrentSuitId(loadedSuit);
    setIsMuted(sound.isMuted());
  }, []);

  // Save changes
  useEffect(() => {
    if (tasks.length > 0) {
      saveTasks(tasks);
    }
  }, [tasks]);

  const currentSuit = SUITS[currentSuitId] || SUITS.classic;

  const handleSuitToggle = (suitId: SuitId) => {
    sound.playThwip();
    setCurrentSuitId(suitId);
    saveSuit(suitId);
  };

  const handleToggleSound = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      sound.playThwip();
    }
  };

  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      createdAt: Date.now(),
      completed: false,
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    saveTasks(updated);
  };

  const handleToggleComplete = (id: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            const remaining = prev.filter((item) => item.id !== id && !item.completed);
            if (remaining.length === 0) {
              sound.playVictory();
            }
          }
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? Date.now() : undefined,
          };
        }
        return t;
      });
      saveTasks(updated);
      return updated;
    });
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveTasks(updated);
      return updated;
    });
  };

  const handleClearCompleted = () => {
    sound.playSnap();
    setTasks((prev) => {
      const updated = prev.filter((t) => !t.completed);
      saveTasks(updated);
      return updated;
    });
  };

  const handleTogglePin = (id: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === id ? { ...t, isPinned: !t.isPinned } : t
      );
      saveTasks(updated);
      return updated;
    });
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === updatedTask.id ? updatedTask : t));
      saveTasks(updated);
      return updated;
    });
  };

  const handleResetToPresets = () => {
    sound.playThwip();
    setTasks(INITIAL_TASKS);
    saveTasks(INITIAL_TASKS);
  };

  // Top header button action: focus & scroll to Add Task input
  const handleTopAddTaskClick = () => {
    sound.playThwip();
    taskInputRef.current?.scrollIntoView();
    taskInputRef.current?.focus();
  };

  // Filter tasks based on activeFilter and search
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(query);
        const matchDesc = task.description?.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc) return false;
      }

      if (activeFilter === 'active' && task.completed) return false;
      if (activeFilter === 'completed' && !task.completed) return false;
      if (activeFilter === 'spider_sense' && (task.completed || task.priority !== 'high')) return false;

      return true;
    });
  }, [tasks, activeFilter, searchQuery]);

  const pinnedTasks = filteredTasks.filter((t) => t.isPinned && !t.completed);
  const unpinnedTasks = filteredTasks.filter((t) => !t.isPinned || t.completed);

  const hasSpiderSenseAlert = tasks.some((t) => !t.completed && t.priority === 'high');
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div
      className="min-h-screen text-neutral-100 flex flex-col transition-colors duration-300 relative bg-comic-dots"
      style={{ backgroundColor: currentSuit.bgCanvas }}
    >
      {/* Spider Web Pattern Background Lines */}
      <div className="fixed inset-0 pointer-events-none opacity-5 overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="web-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 0 0 L 80 80 M 80 0 L 0 80" stroke="#ffffff" strokeWidth="0.8" />
              <circle cx="40" cy="40" r="24" fill="none" stroke="#ffffff" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#web-grid)" />
        </svg>
      </div>

      {/* Top Bar Header */}
      <header className="sticky top-0 z-40 bg-neutral-950/90 border-b border-neutral-800 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 py-3">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
            <SpiderMask suit={currentSuit} isSpiderSenseAlert={hasSpiderSenseAlert} size={36} />
            <a
              href="/"
              className="font-comic text-2xl tracking-wide uppercase text-neutral-100 flex items-center gap-1.5"
            >
              <span>SPIDER-TASK</span>
            </a>
          </div>

          {/* 2-Suit Theme Selector Switch (Classic vs Symbiote) */}
          <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-semibold">
            <button
              onClick={() => handleSuitToggle('classic')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                currentSuitId === 'classic'
                  ? 'bg-rose-600 text-white shadow-sm font-bold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-black/40" />
              <span>Classic Red & Blue</span>
            </button>

            <button
              onClick={() => handleSuitToggle('symbiote')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                currentSuitId === 'symbiote'
                  ? 'bg-neutral-800 text-cyan-300 ring-1 ring-cyan-500/50 shadow-sm font-bold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-black border border-cyan-400" />
              <span>Symbiote Black Suit</span>
            </button>
          </div>

          {/* Right Action Controls: Audio Toggle + Add Task Button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Audio Toggle */}
            <button
              onClick={handleToggleSound}
              title={isMuted ? 'Unmute web-shooter sound' : 'Mute sound effects'}
              className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Primary Action Button: Immediately focuses and scrolls to Add Task input */}
            <button
              onClick={handleTopAddTaskClick}
              className="px-4 py-2 text-xs font-heading font-bold uppercase text-white rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-md hover:brightness-110 active:scale-95 cursor-pointer"
              style={{ backgroundColor: currentSuit.primaryColor }}
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Spider-Sense Urgent Alert Strip (if active) */}
        {hasSpiderSenseAlert && (
          <div className="bg-amber-950/40 border border-amber-500/50 rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-lg spider-sense-glow">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              </div>
              <div className="min-w-0">
                <h4 className="font-heading font-bold text-xs uppercase text-amber-300 tracking-wide">
                  SPIDER-SENSE TINGLING! High Priority Task Pending
                </h4>
                <p className="text-xs text-neutral-300 truncate">
                  You have high-priority tasks waiting to be completed!
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveFilter('spider_sense');
                sound.playSpiderSense();
              }}
              className="px-3 py-1 text-xs font-heading font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-lg whitespace-nowrap shrink-0 transition-colors shadow cursor-pointer"
            >
              Show High Priority
            </button>
          </div>
        )}

        {/* Progress & Safety Meter */}
        <NeighborhoodSafetyMeter
          tasks={tasks}
          suit={currentSuit}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Direct Add Task Form */}
        <TaskInput ref={taskInputRef} suit={currentSuit} onAddTask={handleAddTask} />

        {/* Search & Clear Completed Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-700"
            />
          </div>

          <div className="flex items-center gap-2">
            {completedCount > 0 && (
              <button
                onClick={handleClearCompleted}
                title="Remove all completed tasks"
                className="px-3 py-1.5 text-xs font-medium bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-rose-400 hover:text-rose-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Completed ({completedCount})</span>
              </button>
            )}

            <button
              onClick={handleResetToPresets}
              title="Reset to sample tasks"
              className="px-3 py-1.5 text-xs font-medium bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Sample Tasks</span>
            </button>
          </div>
        </div>

        {/* Priority / Pinned Tasks */}
        {pinnedTasks.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-heading font-bold text-amber-400 uppercase tracking-wide">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>Priority Tasks ({pinnedTasks.length})</span>
            </div>
            <div className="space-y-2.5">
              {pinnedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  suit={currentSuit}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDeleteTask}
                  onTogglePin={handleTogglePin}
                  onUpdateTask={handleUpdateTask}
                />
              ))}
            </div>
          </div>
        )}

        {/* Regular Tasks List */}
        <div className="space-y-2.5">
          {pinnedTasks.length > 0 && unpinnedTasks.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-heading font-bold text-neutral-400 uppercase tracking-wide pt-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tasks ({unpinnedTasks.length})</span>
            </div>
          )}

          {filteredTasks.length === 0 ? (
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-8 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-neutral-800/80 flex items-center justify-center text-2xl select-none">
                🕸️
              </div>
              <h3 className="font-heading font-bold text-base text-neutral-200">
                No Tasks Found
              </h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                {searchQuery
                  ? `No tasks matching "${searchQuery}". Clear your search.`
                  : 'All caught up! Add a new task above or reset to sample tasks.'}
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleTopAddTaskClick}
                  className="px-4 py-2 text-xs font-bold text-white rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                  style={{ backgroundColor: currentSuit.primaryColor }}
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Add New Task</span>
                </button>
                <button
                  onClick={handleResetToPresets}
                  className="px-4 py-2 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Sample Tasks</span>
                </button>
              </div>
            </div>
          ) : (
            unpinnedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                suit={currentSuit}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTask}
                onTogglePin={handleTogglePin}
                onUpdateTask={handleUpdateTask}
              />
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-800/80 bg-neutral-950 py-4 text-center text-xs text-neutral-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-neutral-400">
            Spider-Task To-Do List · "With great power comes great productivity."
          </p>
          <div className="flex items-center gap-3 text-neutral-400">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-rose-500" />
              <span>Friendly Neighborhood To-Do</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
