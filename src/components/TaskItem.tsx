import React, { useState } from 'react';
import { Task, SuitTheme, Priority } from '../types/todo';
import { sound } from '../utils/audio';
import { fireWebBurst, getRandomComicWord } from '../utils/webEffect';
import {
  Pin,
  Trash2,
  Calendar,
  Flame,
  Check,
  Edit3,
  Save,
} from 'lucide-react';

interface TaskItemProps {
  task: Task;
  suit: SuitTheme;
  onToggleComplete: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onUpdateTask: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  suit,
  onToggleComplete,
  onDelete,
  onTogglePin,
  onUpdateTask,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description || '');
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  const [comicPopWord, setComicPopWord] = useState<string | null>(null);

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!task.completed) {
      sound.playThwip();
      const rect = e.currentTarget.getBoundingClientRect();
      fireWebBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, suit);

      const word = getRandomComicWord();
      setComicPopWord(word);
      setTimeout(() => setComicPopWord(null), 1000);
    } else {
      sound.playSnap();
    }
    onToggleComplete(task.id, e);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playSnap();
    onDelete(task.id);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    onUpdateTask({
      ...task,
      title: editTitle.trim(),
      description: editDesc.trim() || undefined,
      priority: editPriority,
    });
    setIsEditing(false);
  };

  // Due date calculation
  const getDueBadge = () => {
    if (!task.dueDate) return null;
    const due = new Date(task.dueDate + 'T23:59:59');
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: 'Overdue!', className: 'text-rose-400 font-bold' };
    }
    if (diffDays === 0) {
      return { label: 'Due today', className: 'text-amber-400 font-semibold' };
    }
    if (diffDays === 1) {
      return { label: 'Due tomorrow', className: 'text-neutral-300' };
    }
    return { label: `Due in ${diffDays}d`, className: 'text-neutral-400' };
  };

  const dueBadge = getDueBadge();
  const isHighPriority = task.priority === 'high' && !task.completed;

  return (
    <div
      className={`group relative rounded-xl border transition-all duration-200 overflow-hidden ${
        task.completed
          ? 'bg-neutral-900/40 border-neutral-800/60 opacity-75 web-cocoon'
          : isHighPriority
          ? 'bg-neutral-900/95 border-amber-500/50 shadow-md spider-sense-glow'
          : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 shadow-sm'
      }`}
    >
      {/* Comic Pop Action Badge */}
      {comicPopWord && (
        <div className="absolute top-2 right-12 z-30 pointer-events-none animate-comic-pop">
          <div
            className="font-comic text-xl px-3 py-1 rounded shadow-2xl border-2 border-black rotate-[-6deg] tracking-wider text-yellow-300"
            style={{
              backgroundColor: suit.primaryColor,
              textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000',
            }}
          >
            {comicPopWord}
          </div>
        </div>
      )}

      {/* Spider-Sense Aura Indicator Bar */}
      {isHighPriority && (
        <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500" />
      )}

      <div className="p-3.5 sm:p-4 flex items-start gap-3">
        {/* Custom Web-Shooter Completion Checkbox */}
        <button
          onClick={handleCheckboxClick}
          title={task.completed ? 'Click to mark as active' : 'Click to web-shoot & mark complete'}
          className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-all duration-150 cursor-pointer ${
            task.completed
              ? 'text-white shadow-sm'
              : 'border-neutral-600 bg-neutral-950 hover:border-neutral-300 hover:scale-105'
          }`}
          style={
            task.completed
              ? { backgroundColor: suit.primaryColor, borderColor: suit.primaryColor }
              : {}
          }
        >
          {task.completed ? (
            <Check className="w-4 h-4 stroke-[3]" />
          ) : (
            <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
              🕸️
            </span>
          )}
        </button>

        {/* Task Core Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <form onSubmit={handleSaveEdit} className="space-y-2 mt-1">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-sm text-neutral-100 focus:outline-none"
              />
              <textarea
                rows={2}
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                placeholder="Task description..."
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none resize-none"
              />
              <div className="flex items-center gap-2">
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value as Priority)}
                  className="bg-neutral-950 border border-neutral-700 text-xs rounded py-1 px-2 text-neutral-200 cursor-pointer"
                >
                  <option value="high">High (Spider-Sense)</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <button
                  type="submit"
                  className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" /> Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-2 py-1 text-neutral-400 hover:text-neutral-200 text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex items-start justify-between gap-2">
                <h4
                  onClick={handleCheckboxClick}
                  className={`text-sm sm:text-base font-semibold leading-snug break-words cursor-pointer select-none ${
                    task.completed
                      ? 'text-neutral-500 line-through decoration-neutral-500/80'
                      : 'text-neutral-100 hover:text-neutral-300'
                  }`}
                >
                  {task.title}
                </h4>

                {task.isPinned && !task.completed && (
                  <Pin className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0 mt-1" />
                )}
              </div>

              {task.description && (
                <p
                  className={`text-xs mt-1 leading-relaxed line-clamp-2 ${
                    task.completed ? 'text-neutral-600' : 'text-neutral-400'
                  }`}
                >
                  {task.description}
                </p>
              )}

              {/* Clean metadata */}
              <div className="flex flex-wrap items-center gap-2 text-xs mt-2 text-neutral-400 font-medium">
                {task.priority === 'high' ? (
                  <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
                    <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>Spider-Sense Priority</span>
                  </span>
                ) : (
                  <span className="text-neutral-400">{task.priority === 'medium' ? 'Standard Priority' : 'Casual'}</span>
                )}

                {dueBadge && (
                  <>
                    <span aria-hidden="true" className="text-neutral-600">·</span>
                    <span className={`inline-flex items-center gap-1 ${dueBadge.className}`}>
                      <Calendar className="w-3 h-3" />
                      <span>{dueBadge.label}</span>
                    </span>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Action Controls with clear REMOVE button */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onTogglePin(task.id)}
            title={task.isPinned ? 'Unpin task' : 'Pin task to top'}
            className={`p-1.5 rounded hover:bg-neutral-800 transition-colors cursor-pointer ${
              task.isPinned ? 'text-amber-400' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Pin className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            title="Edit task"
            className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          {/* Simple, clear Remove Task button */}
          <button
            onClick={handleDelete}
            title="Remove this task"
            className="px-2 py-1 rounded bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/50 hover:border-rose-700 text-rose-300 hover:text-rose-100 transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
};
