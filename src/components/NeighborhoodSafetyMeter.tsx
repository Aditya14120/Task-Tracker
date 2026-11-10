import React from 'react';
import { Task, SuitTheme, FilterStatus } from '../types/todo';
import { Shield, Flame, CheckCircle2, ListTodo } from 'lucide-react';

interface NeighborhoodSafetyMeterProps {
  tasks: Task[];
  suit: SuitTheme;
  activeFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
}

export const NeighborhoodSafetyMeter: React.FC<NeighborhoodSafetyMeterProps> = ({
  tasks,
  suit,
  activeFilter,
  onFilterChange,
}) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const activeCount = total - completed;
  const highPriorityActive = tasks.filter((t) => !t.completed && t.priority === 'high').length;
  const percentage = total === 0 ? 100 : Math.round((completed / total) * 100);

  const getSafetyHeadline = (pct: number) => {
    if (total === 0) return 'ALL CLEAR: No tasks in the queue. Time for a slice of pizza! 🍕';
    if (pct === 100) return 'MISSION COMPLETE: 100% of tasks webbed up and completed! 🎉';
    if (pct >= 75) return 'GREAT PROGRESS: Almost everything is finished!';
    if (pct >= 40) return 'IN PROGRESS: Knocking out tasks one by one.';
    return 'TASKS PENDING: High-priority tasks waiting for action!';
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 md:p-5 shadow-lg relative overflow-hidden">
      {/* Background Web Accent */}
      <div className="absolute -right-8 -top-8 w-32 h-32 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-white w-full h-full">
          <circle cx="100" cy="0" r="30" strokeWidth="1" />
          <circle cx="100" cy="0" r="60" strokeWidth="1" />
          <circle cx="100" cy="0" r="90" strokeWidth="1" />
          <line x1="100" y1="0" x2="0" y2="100" strokeWidth="1" />
          <line x1="100" y1="0" x2="40" y2="100" strokeWidth="1" />
          <line x1="100" y1="0" x2="0" y2="40" strokeWidth="1" />
        </svg>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-rose-500" />
            <h2 className="font-heading font-bold text-sm tracking-wide text-neutral-200 uppercase">
              Spidey Task Progress
            </h2>
            <span
              className="text-xs font-mono tabular-nums px-2 py-0.5 rounded font-bold"
              style={{
                backgroundColor: `${suit.primaryColor}22`,
                color: suit.primaryColor,
                border: `1px solid ${suit.primaryColor}44`,
              }}
            >
              {percentage}% DONE
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-medium">
            {getSafetyHeadline(percentage)}
          </p>
        </div>

        {/* Tabular Metric Counters */}
        <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
          <div className="bg-neutral-950/70 border border-neutral-800/80 px-3 py-1.5 rounded-lg">
            <span className="text-neutral-500 block text-[10px] uppercase font-sans">Active</span>
            <span className="text-neutral-200 font-bold text-sm">{activeCount}</span>
          </div>
          <div className="bg-neutral-950/70 border border-neutral-800/80 px-3 py-1.5 rounded-lg">
            <span className="text-neutral-500 block text-[10px] uppercase font-sans">High Priority</span>
            <span className={`font-bold text-sm ${highPriorityActive > 0 ? 'text-amber-400' : 'text-neutral-400'}`}>
              {highPriorityActive}
            </span>
          </div>
          <div className="bg-neutral-950/70 border border-neutral-800/80 px-3 py-1.5 rounded-lg">
            <span className="text-neutral-500 block text-[10px] uppercase font-sans">Completed</span>
            <span className="text-emerald-400 font-bold text-sm">{completed}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar with Web Tension Styling */}
      <div className="w-full bg-neutral-950 h-2.5 rounded-full overflow-hidden border border-neutral-800 p-0.5 mb-4">
        <div
          className="h-full rounded-full transition-all duration-500 relative"
          style={{
            width: `${Math.max(4, percentage)}%`,
            background: `linear-gradient(90deg, ${suit.primaryColor}, ${suit.secondaryColor})`,
          }}
        >
          <div className="absolute inset-0 bg-white/20 rounded-full" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-neutral-800/70">
        <button
          onClick={() => onFilterChange('all')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-neutral-100 text-neutral-900 font-bold shadow-sm'
              : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/60'
          }`}
        >
          <ListTodo className="w-3.5 h-3.5" />
          <span>All Tasks ({total})</span>
        </button>

        <button
          onClick={() => onFilterChange('active')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeFilter === 'active'
              ? 'bg-neutral-100 text-neutral-900 font-bold shadow-sm'
              : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/60'
          }`}
        >
          <span>Active ({activeCount})</span>
        </button>

        <button
          onClick={() => onFilterChange('spider_sense')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeFilter === 'spider_sense'
              ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
              : 'text-amber-400/90 hover:text-amber-300 hover:bg-amber-950/30'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Spider-Sense ({highPriorityActive})</span>
        </button>

        <button
          onClick={() => onFilterChange('completed')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeFilter === 'completed'
              ? 'bg-neutral-100 text-neutral-900 font-bold shadow-sm'
              : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/60'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Completed ({completed})</span>
        </button>
      </div>
    </div>
  );
};
