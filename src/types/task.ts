export type Priority = 'low' | 'medium' | 'high';

export interface Category {
  id: string;
  name: string;
  color: string; // hex color or tailwind class
  gradient?: string;
  icon?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm format e.g. "14:00"
  completed: boolean;
  important: boolean;
  remind: boolean;
  priority: Priority;
  createdAt: string;
  completedAt?: string;
}

export type FilterType = 'all' | 'today' | 'upcoming' | 'completed' | 'important' | 'overdue';

export type SortOption = 'date-asc' | 'date-desc' | 'priority-desc' | 'title-asc';

export type ActiveTab = 'tasks' | 'categories' | 'calendar' | 'profile';

export type CalendarSubTab = 'monthly' | 'daily';

export type ChartTimeframe = 'month' | 'week' | 'year';

export type ThemeMode = 'navy' | 'dark' | 'light';

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  notifications: boolean;
  soundEnabled: boolean;
  language: string;
  theme: ThemeMode;
}
