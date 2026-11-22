import { Task, Category, UserProfile } from '../types/task';
import { getTodayString, formatDateToISO } from './dateUtils';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'work',
    name: 'Work',
    color: '#F67A7A',
    gradient: 'from-[#F67A7A] to-[#F59E0B]',
    icon: 'briefcase',
  },
  {
    id: 'meet',
    name: 'Meet',
    color: '#246BFD',
    gradient: 'from-[#246BFD] to-[#3B82F6]',
    icon: 'users',
  },
  {
    id: 'personal',
    name: 'Personal',
    color: '#A855F7',
    gradient: 'from-[#8B5CF6] to-[#EC4899]',
    icon: 'user',
  },
  {
    id: 'home',
    name: 'Home',
    color: '#22C55E',
    gradient: 'from-[#10B981] to-[#14B8A6]',
    icon: 'home',
  },
  {
    id: 'study',
    name: 'Study',
    color: '#06B6D4',
    gradient: 'from-[#06B6D4] to-[#3B82F6]',
    icon: 'book',
  },
];

export function getInitialTasks(): Task[] {
  const today = getTodayString();
  
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = formatDateToISO(tomorrowDate);

  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = formatDateToISO(yesterdayDate);

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 3);
  const future = formatDateToISO(futureDate);

  return [
    {
      id: 'task-1',
      title: 'Meeting with friends',
      description: 'Catch up over coffee at Blue Tokai roastery and discuss weekend trip ideas.',
      categoryId: 'meet',
      date: today,
      time: '14:00',
      completed: false,
      important: true,
      remind: true,
      priority: 'high',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-2',
      title: 'Meeting with colleagues to discuss a new project',
      description: 'Review system design architecture, timeline breakdown, and assign feature ownership.',
      categoryId: 'work',
      date: today,
      time: '15:30',
      completed: false,
      important: true,
      remind: true,
      priority: 'high',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-3',
      title: 'Morning running',
      description: '5km jog around the central park track at steady pace.',
      categoryId: 'personal',
      date: today,
      time: '07:00',
      completed: true,
      important: false,
      remind: false,
      priority: 'medium',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    },
    {
      id: 'task-4',
      title: 'Drink 2L of water',
      description: 'Stay hydrated throughout the day; keep water bottle filled.',
      categoryId: 'personal',
      date: today,
      time: '10:00',
      completed: true,
      important: false,
      remind: true,
      priority: 'low',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    },
    {
      id: 'task-5',
      title: 'Walking the dog',
      description: 'Evening 30-minute walk around the block.',
      categoryId: 'home',
      date: today,
      time: '18:00',
      completed: false,
      important: false,
      remind: true,
      priority: 'medium',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-6',
      title: 'Feed the cat',
      description: 'Give wet food portion and clean fresh water bowl.',
      categoryId: 'home',
      date: today,
      time: '19:30',
      completed: false,
      important: false,
      remind: false,
      priority: 'low',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-7',
      title: 'Prepare design presentation deck',
      description: 'Finalize Figma design components, user flows, and interactive prototype slides.',
      categoryId: 'work',
      date: tomorrow,
      time: '11:00',
      completed: false,
      important: true,
      remind: true,
      priority: 'high',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-8',
      title: 'Grocery shopping',
      description: 'Almond milk, avocados, whole grain sourdough bread, eggs, and Greek yogurt.',
      categoryId: 'home',
      date: tomorrow,
      time: '17:00',
      completed: false,
      important: false,
      remind: false,
      priority: 'medium',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-9',
      title: 'Submit monthly financial expense report',
      description: 'Itemize all software subscriptions and client invoices for accounting.',
      categoryId: 'work',
      date: yesterday,
      time: '16:00',
      completed: false,
      important: true,
      remind: true,
      priority: 'high',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-10',
      title: 'Read 20 pages of clean architecture book',
      description: 'Chapters on domain driven design boundaries and entity segregation.',
      categoryId: 'study',
      date: future,
      time: '21:00',
      completed: false,
      important: false,
      remind: false,
      priority: 'low',
      createdAt: new Date().toISOString(),
    },
  ];
}

export const INITIAL_USER: UserProfile = {
  name: 'NiranjanYadav',
  email: 'johnwilliams@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  notifications: true,
  soundEnabled: true,
  language: 'English',
  theme: 'navy',
};

const STORAGE_KEYS = {
  TASKS: 'planify_tasks_v1',
  CATEGORIES: 'planify_categories_v1',
  USER: 'planify_user_v1',
  ONBOARDED: 'planify_onboarded_v1',
};

export function loadStoredTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) return getInitialTasks();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : getInitialTasks();
  } catch {
    return getInitialTasks();
  }
}

export function saveStoredTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks to localStorage', err);
  }
}

export function loadStoredCategories(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) return INITIAL_CATEGORIES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_CATEGORIES;
  } catch {
    return INITIAL_CATEGORIES;
  }
}

export function saveStoredCategories(categories: Category[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (err) {
    console.error('Failed to save categories to localStorage', err);
  }
}

export function loadStoredUser(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) return INITIAL_USER;

    const parsed = JSON.parse(raw) as Partial<UserProfile>;
    const resolved: UserProfile = { ...INITIAL_USER, ...parsed };

    if (
      typeof resolved.name === 'string' &&
      ['John Williams', 'jhon williams', 'Jhon Williams'].includes(resolved.name.trim())
    ) {
      resolved.name = INITIAL_USER.name;
    }

    return resolved;
  } catch {
    return INITIAL_USER;
  }
}

export function saveStoredUser(user: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to save user to localStorage', err);
  }
}

export function loadHasSeenTutorial(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.ONBOARDED) === 'true';
  } catch {
    return false;
  }
}

export function saveHasSeenTutorial(hasSeen: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ONBOARDED, String(hasSeen));
  } catch (err) {
    console.error('Failed to save tutorial status', err);
  }
}
