import React, { useState } from 'react';
import { Plus, Edit2, Trash2, FolderKanban, CheckCircle2 } from 'lucide-react';
import { Task, Category } from '../types/task';
import { TaskCard } from '../components/TaskCard';
import { EmptyTasksIllustration } from '../components/illustrations';
import { sound } from '../utils/sound';

interface CategoriesViewProps {
  categories: Category[];
  tasks: Task[];
  onAddNewCategory: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onToggleImportant: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onClickDetail: (task: Task) => void;
  onOpenAddTask: (date?: string, categoryId?: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  tasks,
  onAddNewCategory,
  onEditCategory,
  onDeleteCategory,
  onToggleComplete,
  onToggleImportant,
  onEditTask,
  onDeleteTask,
  onClickDetail,
  onOpenAddTask,
}) => {
  const [selectedCatId, setSelectedCatId] = useState<string>(categories[0]?.id ?? '');

  const activeCategory = categories.find(c => c.id === selectedCatId) || categories[0];
  const categoryTasks = tasks.filter(t => t.categoryId === activeCategory?.id);
  const categoryMap = new Map(categories.map(c => [c.id, c]));

  const pendingCount = categoryTasks.filter(t => !t.completed).length;
  const completedCount = categoryTasks.filter(t => t.completed).length;

  return (
    <div className="space-y-6 animate-fadeIn pb-16 md:pb-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-poppins font-bold text-xl md:text-2xl text-white">
            Categories & Project Lists
          </h2>
          <p className="text-xs md:text-sm text-dark-muted">
            Organize and isolate tasks into dedicated workspaces.
          </p>
        </div>

        <button
          onClick={onAddNewCategory}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-poppins font-semibold text-xs md:text-sm shadow-glow transition-all self-start"
        >
          <Plus size={16} className="stroke-[3]" />
          <span>New Category</span>
        </button>
      </div>

      {/* Grid of Category Summary Cards matching Behance Image 4 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {categories.map((cat) => {
          const isSelected = cat.id === activeCategory?.id;
          const catPending = tasks.filter(t => t.categoryId === cat.id && !t.completed).length;

          return (
            <div
              key={cat.id}
              onClick={() => setSelectedCatId(cat.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 relative group overflow-hidden ${
                isSelected
                  ? 'border-white shadow-card scale-[1.02]'
                  : 'border-[#2C334D] bg-[#181D2F] hover:border-slate-500'
              }`}
              style={{
                background: isSelected
                  ? `linear-gradient(135deg, ${cat.color}EE 0%, ${cat.color}88 100%)`
                  : undefined,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: isSelected ? '#FFFFFF' : cat.color }}
                />
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full font-poppins ${
                    isSelected ? 'bg-black/30 text-white' : 'bg-white/10 text-slate-300'
                  }`}
                >
                  {catPending}
                </span>
              </div>

              <div className="font-poppins font-semibold text-sm text-white truncate drop-shadow-sm">
                {cat.name}
              </div>
              <div
                className={`text-[11px] font-medium mt-0.5 ${
                  isSelected ? 'text-white/80' : 'text-dark-muted'
                }`}
              >
                {catPending} active items
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Category Tasks Area */}
      {activeCategory && (
        <div className="bg-[#181D2F] border border-[#2B324A] rounded-2xl p-5 shadow-card space-y-5">
          {/* Header of Active Category */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <span
                className="w-4 h-4 rounded-full shadow-glow-sm"
                style={{ backgroundColor: activeCategory.color }}
              />
              <h3 className="font-poppins font-bold text-lg md:text-xl text-white">
                {activeCategory.name}
              </h3>
              <span className="text-xs text-dark-muted">
                ({pendingCount} pending, {completedCount} completed)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAddTask(undefined, activeCategory.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-poppins text-xs font-semibold shadow-glow-sm transition-all"
              >
                <Plus size={14} className="stroke-[3]" />
                <span>Add Task</span>
              </button>

              <button
                onClick={() => onEditCategory(activeCategory)}
                className="p-1.5 rounded-lg bg-[#22283D] hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                title="Edit category"
              >
                <Edit2 size={15} />
              </button>

              {/* Prevent deleting default core categories */}
              {categories.length > 1 && (
                <button
                  onClick={() => {
                    sound.playDelete();
                    onDeleteCategory(activeCategory.id);
                  }}
                  className="p-1.5 rounded-lg bg-[#22283D] hover:bg-coral/20 text-slate-300 hover:text-coral transition-colors"
                  title="Delete category"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Category Task List */}
          {categoryTasks.length === 0 ? (
            <div className="py-10 text-center flex flex-col items-center justify-center space-y-2">
              <EmptyTasksIllustration className="w-28 h-28" />
              <p className="text-xs text-dark-muted">
                No tasks in this category yet.
              </p>
              <button
                onClick={() => onOpenAddTask(undefined, activeCategory.id)}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 pt-1"
              >
                + Add your first task in {activeCategory.name}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {categoryTasks.map((task) => (
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
          )}
        </div>
      )}
    </div>
  );
};
