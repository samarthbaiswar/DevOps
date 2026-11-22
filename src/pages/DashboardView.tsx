import React from 'react';
import { Sparkles, Calendar, CheckCircle2, Inbox } from 'lucide-react';
import { Task, Category, CalendarSubTab } from '../types/task';
import { ProgressCard } from '../components/ProgressCard';
import { CalendarStrip } from '../components/CalendarStrip';
import { CategoryCarousel } from '../components/CategoryCarousel';
import { TaskCard } from '../components/TaskCard';
import { EmptyTasksIllustration } from '../components/illustrations';
import { isToday, formatHumanDate } from '../utils/dateUtils';

interface DashboardViewProps {
  tasks: Task[];
  filteredTasks: Task[];
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  selectedDate: string;
  onSelectDate: (d: string) => void;
  calendarSubTab: CalendarSubTab;
  onCalendarSubTabChange: (tab: CalendarSubTab) => void;
  onToggleComplete: (id: string) => void;
  onToggleImportant: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onClickDetail: (task: Task) => void;
  onOpenAddTask: () => void;
  onAddNewCategory: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  filteredTasks,
  categories,
  selectedCategoryId,
  onSelectCategory,
  selectedDate,
  onSelectDate,
  calendarSubTab,
  onCalendarSubTabChange,
  onToggleComplete,
  onToggleImportant,
  onEditTask,
  onDeleteTask,
  onClickDetail,
  onOpenAddTask,
  onAddNewCategory,
}) => {
  const categoryMap = new Map(categories.map(c => [c.id, c]));

  // Split into Pending and Completed for clean hierarchy
  const pendingTasks = filteredTasks.filter(t => !t.completed);
  const completedTasks = filteredTasks.filter(t => t.completed);

  return (
    <div className="space-y-6 animate-fadeIn pb-16 md:pb-6">
      {/* 1. Daily Progress & Motivational Summary */}
      <ProgressCard tasks={tasks} onQuickAdd={onOpenAddTask} />

      {/* 2. Behance Calendar Overview Strip (Daily Week Strip / Monthly Grid) */}
      <CalendarStrip
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
        tasks={tasks}
        activeSubTab={calendarSubTab}
        onSubTabChange={onCalendarSubTabChange}
      />

      {/* 3. Horizontal Gradient Category Carousel */}
      <CategoryCarousel
        categories={categories}
        tasks={tasks}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={onSelectCategory}
        onAddNewCategory={onAddNewCategory}
      />

      {/* 4. Task List Sections */}
      <div className="space-y-5">
        {/* Active / Pending Tasks Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="font-poppins font-semibold text-base md:text-lg text-white tracking-tight">
              Tasks
            </h4>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30">
              {pendingTasks.length} active
            </span>
          </div>

          {selectedDate && (
            <span className="text-xs text-dark-muted">
              Filtered for {formatHumanDate(selectedDate)}
            </span>
          )}
        </div>

        {/* Tasks or Empty State */}
        {filteredTasks.length === 0 ? (
          <div className="rounded-2xl border border-[#2B324A] bg-[#181D2F] p-8 text-center flex flex-col items-center justify-center space-y-3">
            <EmptyTasksIllustration className="w-32 h-32" />
            <div className="space-y-1">
              <h5 className="font-poppins font-semibold text-white text-base">
                No tasks found
              </h5>
              <p className="text-xs text-dark-muted max-w-sm">
                No items match your current filter or date. Relax or create a new task to get things done!
              </p>
            </div>
            <button
              onClick={onOpenAddTask}
              className="mt-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-poppins font-semibold text-xs shadow-glow transition-all"
            >
              + Create Task
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Pending List */}
            {pendingTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                category={categoryMap.get(task.categoryId)}
                onToggleComplete={onToggleComplete}
                onToggleImportant={onToggleImportant}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onClickDetail={onClickDetail}
              />
            ))}

            {/* Completed Section (collapsible appearance) */}
            {completedTasks.length > 0 && (
              <div className="pt-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-dark-muted uppercase tracking-wider">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Completed ({completedTasks.length})</span>
                </div>
                <div className="space-y-2">
                  {completedTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      category={categoryMap.get(task.categoryId)}
                      onToggleComplete={onToggleComplete}
                      onToggleImportant={onToggleImportant}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                      onClickDetail={onClickDetail}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
