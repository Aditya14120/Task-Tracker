export type Priority = 'high' | 'medium' | 'low';

export type SuitId = 'classic' | 'symbiote';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: number;
  priority: Priority;
  dueDate?: string;
  isPinned?: boolean;
  createdAt: number;
}

export interface SuitTheme {
  id: SuitId;
  name: string;
  alias: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgCanvas: string;
  surfaceCard: string;
  surfaceBorder: string;
  headerBg: string;
  lensColor: string;
  lensOutline: string;
  webColor: string;
  confettiColors: string[];
}

export type FilterStatus = 'all' | 'active' | 'completed' | 'spider_sense';
