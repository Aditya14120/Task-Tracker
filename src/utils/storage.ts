import { Task, SuitId } from '../types/todo';

const TASKS_KEY = 'spidertask_missions_v2';
const SUIT_KEY = 'spidertask_suit_v2';

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Fix web-shooter pressure release valve',
    description: 'Cartridge #2 has a slight leak. Refill with high-tensile adhesive polymer.',
    completed: false,
    priority: 'high',
    dueDate: new Date(Date.now() + 3600 * 1000 * 4).toISOString().split('T')[0],
    isPinned: true,
    createdAt: Date.now() - 3600 * 1000 * 5,
  },
  {
    id: 'task-2',
    title: 'Submit rooftop photos to the newspaper',
    description: 'Get clean 35mm photos of Spidey swinging past the Chrysler building.',
    completed: false,
    priority: 'high',
    dueDate: new Date(Date.now() + 3600 * 1000 * 6).toISOString().split('T')[0],
    isPinned: true,
    createdAt: Date.now() - 3600 * 1000 * 8,
  },
  {
    id: 'task-3',
    title: "Pick up Aunt May's special groceries",
    description: "Flour for Sunday wheat cakes and fresh milk.",
    completed: false,
    priority: 'low',
    dueDate: new Date(Date.now() + 3600 * 1000 * 24).toISOString().split('T')[0],
    isPinned: false,
    createdAt: Date.now() - 3600 * 1000 * 12,
  },
  {
    id: 'task-4',
    title: "Deliver 29-minute pizza order",
    description: 'Two extra-large pizzas to 42nd street. Keep the box level while swinging!',
    completed: false,
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    isPinned: false,
    createdAt: Date.now() - 3600 * 1000 * 2,
  },
  {
    id: 'task-5',
    title: 'Study bio-genetics midterm exam notes',
    description: 'Chapters on cellular regeneration and limb regrowth biology.',
    completed: false,
    priority: 'medium',
    dueDate: new Date(Date.now() + 3600 * 1000 * 48).toISOString().split('T')[0],
    isPinned: false,
    createdAt: Date.now() - 3600 * 1000 * 20,
  },
  {
    id: 'task-6',
    title: 'Morning rooftop patrol over the neighborhood',
    description: 'Stopped a bicycle theft and helped a lost tourist find the subway.',
    completed: true,
    completedAt: Date.now() - 3600 * 1000 * 3,
    priority: 'low',
    dueDate: new Date().toISOString().split('T')[0],
    isPinned: false,
    createdAt: Date.now() - 3600 * 1000 * 24,
  },
];

export function loadTasks(): Task[] {
  if (typeof window === 'undefined') return INITIAL_TASKS;
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (!raw) return INITIAL_TASKS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_TASKS;
  } catch (err) {
    console.error('Failed to parse saved tasks:', err);
    return INITIAL_TASKS;
  }
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks:', err);
  }
}

export function loadSuit(): SuitId {
  if (typeof window === 'undefined') return 'classic';
  try {
    const raw = localStorage.getItem(SUIT_KEY);
    if (raw && ['classic', 'symbiote'].includes(raw)) {
      return raw as SuitId;
    }
    return 'classic';
  } catch {
    return 'classic';
  }
}

export function saveSuit(suit: SuitId): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SUIT_KEY, suit);
  } catch (err) {
    console.error('Failed to save suit:', err);
  }
}
