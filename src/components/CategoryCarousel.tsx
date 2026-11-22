import React from 'react';
import { Plus, Briefcase, Users, User, Home, Book, Sparkles } from 'lucide-react';
import { Category, Task } from '../types/task';

interface CategoryCarouselProps {
  categories: Category[];
  tasks: Task[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onAddNewCategory: () => void;
}

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  categories,
  tasks,
  selectedCategoryId,
  onSelectCategory,
  onAddNewCategory,
}) => {
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'briefcase':
        return <Briefcase size={16} />;
      case 'users':
        return <Users size={16} />;
      case 'user':
        return <User size={16} />;
      case 'home':
        return <Home size={16} />;
      case 'book':
        return <Book size={16} />;
      default:
        return <Sparkles size={16} />;
    }
  };

  const getTaskCount = (catId: string) => {
    return tasks.filter(t => t.categoryId === catId && !t.completed).length;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-poppins font-semibold text-sm md:text-base text-white tracking-tight">
          Categories & Projects
        </h4>
        {selectedCategoryId && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors"
          >
            Show All
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
        {/* All Tasks Card */}
        <button
          onClick={() => onSelectCategory(null)}
          className={`shrink-0 min-w-[130px] p-3.5 rounded-2xl border text-left transition-all duration-200 ${
            selectedCategoryId === null
              ? 'bg-[#222942] border-brand-500 shadow-glow-sm'
              : 'bg-[#181D2F] border-[#2B324A] hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <Sparkles size={15} />
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white font-poppins">
              {tasks.filter(t => !t.completed).length}
            </span>
          </div>
          <div className="font-poppins font-semibold text-sm text-white">All Tasks</div>
          <div className="text-[11px] text-dark-muted">Active items</div>
        </button>

        {/* Dynamic Category Cards */}
        {categories.map(cat => {
          const isSelected = selectedCategoryId === cat.id;
          const pendingCount = getTaskCount(cat.id);

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? null : cat.id)}
              className={`shrink-0 min-w-[130px] p-3.5 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden group ${
                isSelected
                  ? 'border-white shadow-card scale-[1.02]'
                  : 'border-transparent hover:border-white/20'
              }`}
              style={{
                background: cat.color.startsWith('#')
                  ? `linear-gradient(135deg, ${cat.color}CC 0%, ${cat.color}77 100%)`
                  : undefined,
              }}
            >
              {/* Top Row: Icon & Count */}
              <div className="flex items-center justify-between mb-2 relative z-10">
                <div className="w-7 h-7 rounded-lg bg-black/25 text-white flex items-center justify-center backdrop-blur-sm">
                  {getIcon(cat.icon)}
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-black/25 text-white font-poppins backdrop-blur-sm">
                  {pendingCount}
                </span>
              </div>

              {/* Title & Sub */}
              <div className="font-poppins font-semibold text-sm text-white drop-shadow-sm relative z-10">
                {cat.name}
              </div>
              <div className="text-[11px] text-white/80 font-medium relative z-10">
                {pendingCount} {pendingCount === 1 ? 'task' : 'tasks'}
              </div>

              {/* Hover sheen */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </button>
          );
        })}

        {/* "+ Create new list" Card matching Behance Image 5 */}
        <button
          onClick={onAddNewCategory}
          className="shrink-0 min-w-[130px] p-3.5 rounded-2xl border border-dashed border-[#3A4260] hover:border-brand-500 bg-[#141826]/60 hover:bg-[#1A2035] text-left transition-all duration-200 flex flex-col justify-center items-center text-center group"
        >
          <div className="w-8 h-8 rounded-full bg-brand-500/10 text-brand-400 group-hover:bg-brand-500 group-hover:text-white flex items-center justify-center mb-1.5 transition-colors">
            <Plus size={16} />
          </div>
          <span className="font-poppins font-medium text-xs text-slate-300 group-hover:text-white">
            Create new list
          </span>
        </button>
      </div>
    </div>
  );
};
