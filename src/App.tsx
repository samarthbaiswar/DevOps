import React, { useState, useEffect, useMemo } from 'react';
import {
  Task,
  Category,
  UserProfile,
  ActiveTab,
  FilterType,
  SortOption,
  CalendarSubTab,
} from './types/task';
import {
  loadStoredTasks,
  saveStoredTasks,
  loadStoredCategories,
  saveStoredCategories,
  loadStoredUser,
  saveStoredUser,
  loadHasSeenTutorial,
  saveHasSeenTutorial,
  getInitialTasks,
  INITIAL_CATEGORIES,
  INITIAL_USER,
} from './utils/storage';
import { getTodayString, isToday, isUpcoming, isOverdue } from './utils/dateUtils';
import { sound } from './utils/sound';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { MobileFrameWrapper } from './components/MobileFrameWrapper';
import { AddTaskModal } from './components/AddTaskModal';
import { TaskDetailModal } from './components/TaskDetailModal';
import { CategoryModal } from './components/CategoryModal';
import { TutorialModal } from './components/TutorialModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { DashboardView } from './pages/DashboardView';
import { CalendarView } from './pages/CalendarView';
import { CategoriesView } from './pages/CategoriesView';
import { ProfileView } from './pages/ProfileView';

export const App: React.FC = () => {
  // Persistent States
  const [tasks, setTasks] = useState<Task[]>(loadStoredTasks);
  const [categories, setCategories] = useState<Category[]>(loadStoredCategories);
  const [user, setUser] = useState<UserProfile>(loadStoredUser);

  // Active View States
  const [activeTab, setActiveTab] = useState<ActiveTab>('tasks');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [calendarSubTab, setCalendarSubTab] = useState<CalendarSubTab>('daily');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>('date-asc');
  const [isMobilePreview, setIsMobilePreview] = useState<boolean>(false);

  // Modals & Panels
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to localStorage
  useEffect(() => {
    saveStoredTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveStoredCategories(categories);
  }, [categories]);

  useEffect(() => {
    saveStoredUser(user);
    // Apply body theme class
    document.body.className = `theme-${user.theme} font-roboto antialiased selection:bg-brand-500 selection:text-white`;
    sound.setEnabled(user.soundEnabled);
  }, [user]);

  // Check first-time tutorial prompt
  useEffect(() => {
    const hasSeen = loadHasSeenTutorial();
    if (!hasSeen) {
      setIsTutorialOpen(true);
      saveHasSeenTutorial(true);
    }
  }, []);

  // Filter Counts
  const filterCounts = useMemo(() => {
    return {
      all: tasks.length,
      today: tasks.filter((t) => isToday(t.date)).length,
      upcoming: tasks.filter((t) => isUpcoming(t.date) && !t.completed).length,
      important: tasks.filter((t) => t.important && !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
      overdue: tasks.filter((t) => isOverdue(t.date, t.completed)).length,
    };
  }, [tasks]);

  // Filtered & Sorted Tasks for Dashboard
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategoryId) {
      result = result.filter((t) => t.categoryId === selectedCategoryId);
    }

    // Status / date filters
    if (activeFilter === 'today') {
      result = result.filter((t) => isToday(t.date));
    } else if (activeFilter === 'upcoming') {
      result = result.filter((t) => isUpcoming(t.date));
    } else if (activeFilter === 'completed') {
      result = result.filter((t) => t.completed);
    } else if (activeFilter === 'important') {
      result = result.filter((t) => t.important);
    } else if (activeFilter === 'overdue') {
      result = result.filter((t) => isOverdue(t.date, t.completed));
    }

    // Sort order
    result.sort((a, b) => {
      if (sortOption === 'date-asc') {
        return a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || '');
      } else if (sortOption === 'date-desc') {
        return b.date.localeCompare(a.date) || (b.time || '').localeCompare(a.time || '');
      } else if (sortOption === 'priority-desc') {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      } else if (sortOption === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  }, [tasks, searchQuery, selectedCategoryId, activeFilter, sortOption]);

  // Task Operations
  const handleToggleComplete = (id: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      });

      // Check if all today's tasks are now completed -> show Behance celebration screen!
      const todayRemaining = updated.filter((t) => isToday(t.date) && !t.completed);
      const todayTotal = updated.filter((t) => isToday(t.date)).length;
      if (todayTotal > 0 && todayRemaining.length === 0) {
        setTimeout(() => {
          setIsCelebrationOpen(true);
        }, 400);
      }

      return updated;
    });

    // Keep detail task in sync if open
    if (detailTask && detailTask.id === id) {
      setDetailTask((prev) => (prev ? { ...prev, completed: !prev.completed } : null));
    }
  };

  const handleToggleImportant = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, important: !t.important } : t))
    );
    if (detailTask && detailTask.id === id) {
      setDetailTask((prev) => (prev ? { ...prev, important: !prev.important } : null));
    }
  };

  const handleSaveTask = (
    taskData: Omit<Task, 'id' | 'createdAt' | 'completed' | 'completedAt'>
  ) => {
    if (taskToEdit) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskToEdit.id ? { ...t, ...taskData } : t))
      );
      addToast('Task updated successfully');
      setTaskToEdit(null);
    } else {
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}`,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
      addToast('Task created successfully');
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    addToast('Task deleted', 'info');
    if (detailTask?.id === id) {
      setDetailTask(null);
    }
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsAddTaskOpen(true);
  };

  // Category Operations
  const handleSaveCategory = (catData: Omit<Category, 'id'>) => {
    if (categoryToEdit) {
      setCategories((prev) =>
        prev.map((c) => (c.id === categoryToEdit.id ? { ...c, ...catData } : c))
      );
      addToast(`Category "${catData.name}" updated`);
      setCategoryToEdit(null);
    } else {
      const newCat: Category = {
        ...catData,
        id: `cat-${Date.now()}`,
      };
      setCategories((prev) => [...prev, newCat]);
      addToast(`Category "${catData.name}" created`);
    }
  };

  const handleDeleteCategory = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    // Reassign tasks to first category
    setTasks((prev) =>
      prev.map((t) => (t.categoryId === id ? { ...t, categoryId: categories[0]?.id || 'general' } : t))
    );
    addToast(`Category deleted`, 'info');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all tasks and categories to initial Behance demo mock data?')) {
      setTasks(getInitialTasks());
      setCategories(INITIAL_CATEGORIES);
      setUser(INITIAL_USER);
      addToast('Demo data restored to initial Behance reference', 'info');
    }
  };

  // Render Inner Content
  const renderViewContent = () => {
    switch (activeTab) {
      case 'calendar':
        return (
          <CalendarView
            tasks={tasks}
            categories={categories}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onToggleComplete={handleToggleComplete}
            onToggleImportant={handleToggleImportant}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onClickDetail={setDetailTask}
            onOpenAddTask={(d) => {
              if (d) setSelectedDate(d);
              setTaskToEdit(null);
              setIsAddTaskOpen(true);
            }}
          />
        );
      case 'categories':
        return (
          <CategoriesView
            categories={categories}
            tasks={tasks}
            onAddNewCategory={() => {
              setCategoryToEdit(null);
              setIsCategoryModalOpen(true);
            }}
            onEditCategory={(cat) => {
              setCategoryToEdit(cat);
              setIsCategoryModalOpen(true);
            }}
            onDeleteCategory={handleDeleteCategory}
            onToggleComplete={handleToggleComplete}
            onToggleImportant={handleToggleImportant}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onClickDetail={setDetailTask}
            onOpenAddTask={(d, catId) => {
              if (d) setSelectedDate(d);
              if (catId) setSelectedCategoryId(catId);
              setTaskToEdit(null);
              setIsAddTaskOpen(true);
            }}
          />
        );
      case 'profile':
        return (
          <ProfileView
            user={user}
            onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
            tasks={tasks}
            onResetData={handleResetData}
          />
        );
      case 'tasks':
      default:
        return (
          <DashboardView
            tasks={tasks}
            filteredTasks={filteredTasks}
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            calendarSubTab={calendarSubTab}
            onCalendarSubTabChange={setCalendarSubTab}
            onToggleComplete={handleToggleComplete}
            onToggleImportant={handleToggleImportant}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onClickDetail={setDetailTask}
            onOpenAddTask={() => {
              setTaskToEdit(null);
              setIsAddTaskOpen(true);
            }}
            onAddNewCategory={() => {
              setCategoryToEdit(null);
              setIsCategoryModalOpen(true);
            }}
          />
        );
    }
  };

  const appContent = (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top Header */}
      <div className="p-4 sm:p-6 pb-2">
        <Header
          user={user}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          filterCounts={filterCounts}
          sortOption={sortOption}
          onSortChange={setSortOption}
          onOpenAddTask={() => {
            setTaskToEdit(null);
            setIsAddTaskOpen(true);
          }}
          isMobilePreview={isMobilePreview}
          onToggleMobilePreview={() => setIsMobilePreview(!isMobilePreview)}
          onOpenTutorial={() => setIsTutorialOpen(true)}
        />
      </div>

      {/* Main View Area */}
      <main className="flex-1 p-4 sm:p-6 pt-2 overflow-y-auto no-scrollbar">
        {renderViewContent()}
      </main>

      {/* Mobile Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAddTask={() => {
          setTaskToEdit(null);
          setIsAddTaskOpen(true);
        }}
      />
    </div>
  );

  return (
    <>
      <MobileFrameWrapper
        isMobilePreview={isMobilePreview}
        onClosePreview={() => setIsMobilePreview(false)}
      >
        <div className={`min-h-screen flex ${isMobilePreview ? 'w-full bg-[#141A2E]' : 'bg-[#142453]'}`}>
          {/* Desktop Sidebar (hidden in Mobile Frame mode) */}
          {!isMobilePreview && (
            <div className="hidden md:block">
              <Sidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
                onAddNewCategory={() => {
                  setCategoryToEdit(null);
                  setIsCategoryModalOpen(true);
                }}
                tasks={tasks}
                user={user}
                onOpenTutorial={() => setIsTutorialOpen(true)}
              />
            </div>
          )}

          {/* Core Content */}
          {appContent}
        </div>
      </MobileFrameWrapper>

      {/* Modals & Overlays */}
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => {
          setIsAddTaskOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleSaveTask}
        categories={categories}
        taskToEdit={taskToEdit}
        onAddNewCategory={() => {
          setIsCategoryModalOpen(true);
        }}
        defaultDate={selectedDate}
        defaultCategoryId={selectedCategoryId}
      />

      <TaskDetailModal
        task={detailTask}
        category={categories.find((c) => c.id === detailTask?.categoryId)}
        isOpen={!!detailTask}
        onClose={() => setDetailTask(null)}
        onToggleComplete={handleToggleComplete}
        onToggleImportant={handleToggleImportant}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setCategoryToEdit(null);
        }}
        onSave={handleSaveCategory}
        categoryToEdit={categoryToEdit}
      />

      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        mode="onboarding"
      />

      <TutorialModal
        isOpen={isCelebrationOpen}
        onClose={() => setIsCelebrationOpen(false)}
        mode="celebration"
      />

      {/* Toast Notification Stack */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </>
  );
};
export default App;
