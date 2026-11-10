import React, { useState, useImperativeHandle, forwardRef, useRef } from 'react';
import { Priority, SuitTheme, Task } from '../types/todo';
import { sound } from '../utils/audio';
import { Plus, Flame, Clock, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';

export interface TaskInputRef {
  focus: () => void;
  scrollIntoView: () => void;
}

interface TaskInputProps {
  suit: SuitTheme;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
}

export const TaskInput = forwardRef<TaskInputRef, TaskInputProps>(({ suit, onAddTask }, ref) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState<string>('');
  const [showDetails, setShowDetails] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLFormElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
      setIsHighlighted(true);
      setTimeout(() => setIsHighlighted(false), 1500);
    },
    scrollIntoView: () => {
      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      inputRef.current?.focus();
      setIsHighlighted(true);
      setTimeout(() => setIsHighlighted(false), 1500);
    },
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sound.playThwip();
    onAddTask({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || undefined,
      isPinned: priority === 'high',
    });

    // Reset form
    setTitle('');
    setDescription('');
    setDueDate('');
    setShowDetails(false);
  };

  return (
    <form
      ref={containerRef}
      onSubmit={handleSubmit}
      className={`bg-neutral-900 border rounded-xl p-4 shadow-xl relative transition-all duration-300 ${
        isHighlighted
          ? 'ring-2 ring-rose-500 border-rose-400 bg-neutral-850 scale-[1.01]'
          : 'border-neutral-800'
      }`}
    >
      {/* Primary Row: Input & Clear "Add Task" Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1 flex items-center">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border border-neutral-700/80 mr-2.5 select-none"
            style={{ backgroundColor: `${suit.primaryColor}22` }}
          >
            <span className="text-lg">🕸️</span>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task name here (e.g. Study for exam, Deliver pizzas)..."
            className="w-full bg-neutral-950/70 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-600 font-medium"
          />
        </div>

        {/* Clear, obvious ADD TASK button */}
        <button
          type="submit"
          disabled={!title.trim()}
          className="px-5 py-2.5 text-xs font-heading font-bold uppercase rounded-lg text-white transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-95 shadow-md cursor-pointer"
          style={{ backgroundColor: suit.primaryColor }}
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Optional details toggle button */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-800/60 text-xs">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="text-neutral-400 hover:text-neutral-200 flex items-center gap-1.5 py-1 transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{showDetails ? 'Hide extra details' : 'Add details (Due date, Threat level, Notes)'}</span>
          {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        <span className="text-neutral-500 text-[11px] hidden sm:inline">
          Tip: Press <kbd className="bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-300 font-mono">Enter</kbd> to quickly add
        </span>
      </div>

      {/* Expandable Options Panel */}
      {showDetails && (
        <div className="mt-3 pt-3 border-t border-neutral-800/80 space-y-3">
          {/* Notes / Description */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-400 mb-1 block">
              Notes / Intel (optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about this task..."
              className="w-full bg-neutral-950/60 border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-neutral-700 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Priority Selector */}
            <div>
              <label className="text-[11px] font-semibold text-neutral-400 mb-1 flex items-center gap-1">
                <Flame className="w-3 h-3 text-neutral-400" />
                Priority Level
              </label>
              <div className="relative">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 rounded-lg py-1.5 px-2.5 pr-7 appearance-none focus:outline-none focus:border-neutral-700 cursor-pointer"
                >
                  <option value="high">High (Spider-Sense Alert)</option>
                  <option value="medium">Medium (Standard)</option>
                  <option value="low">Low (Casual)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="text-[11px] font-semibold text-neutral-400 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-neutral-400" />
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 rounded-lg py-1.5 px-2.5 focus:outline-none focus:border-neutral-700 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </form>
  );
});

TaskInput.displayName = 'TaskInput';
