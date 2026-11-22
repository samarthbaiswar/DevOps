import React from 'react';
import {
  CheckSquare,
  Calendar,
  FolderKanban,
  User,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { ActiveTab, FilterType, Category, Task, UserProfile } from '../types/task';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  onAddNewCategory: () => void;
  tasks: Task[];
  user: UserProfile;
  onOpenTutorial: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  activeFilter,
  onFilterChange,
  categories,
  selectedCategoryId,
  onSelectCategory,
  onAddNewCategory,
  tasks,
  user,
  onOpenTutorial,
}) => {
  const pendingCount = tasks.filter(t => !t.completed).length;
  const todayCount = tasks.filter(t => !t.completed && t.date === new Date().toISOString().split('T')[0]).length;
  const starredCount = tasks.filter(t => !t.completed && t.important).length;
  const completedCount = tasks.filter(t => t.completed).length;

  const mainTabs = [
    { id: 'tasks', label: 'Tasks Dashboard', icon: <CheckSquare size={18} /> },
    { id: 'calendar', label: 'Calendar Schedule', icon: <Calendar size={18} /> },
    { id: 'categories', label: 'Categories & Lists', icon: <FolderKanban size={18} /> },
    { id: 'profile', label: 'Profile & Settings', icon: <User size={18} /> },
  ] as const;

  return (
    <aside className="w-64 bg-[#141A2E] border-r border-[#242C44] flex flex-col justify-between h-screen sticky top-0 p-5 select-none shrink-0 overflow-y-auto no-scrollbar">
      {/* Brand Header */}
      <div className="space-y-6">
        <BrandLogo size="md" />

        {/* Primary Navigation Views */}
        <div className="space-y-1">
          <span className="text-[10px] font-semibold tracking-wider text-dark-muted uppercase px-3">
            Menu
          </span>
          {mainTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-poppins text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-glow-sm font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-[#1C233D]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </div>
                {tab.id === 'tasks' && pendingCount > 0 && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#222A44] text-brand-300'
                    }`}
                  >
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Task Filters (Available on Dashboard) */}
        {activeTab === 'tasks' && (
          <div className="space-y-1 pt-2 border-t border-white/5">
            <span className="text-[10px] font-semibold tracking-wider text-dark-muted uppercase px-3">
              Filters
            </span>
            <button
              onClick={() => onFilterChange('today')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeFilter === 'today'
                  ? 'bg-brand-500/15 text-brand-300 font-semibold border border-brand-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Clock size={15} className="text-brand-400" />
                <span>Today's Tasks</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">{todayCount}</span>
            </button>

            <button
              onClick={() => onFilterChange('important')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeFilter === 'important'
                  ? 'bg-brand-500/15 text-brand-300 font-semibold border border-brand-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Star size={15} className="text-amber-400 fill-amber-400" />
                <span>Important</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">{starredCount}</span>
            </button>

            <button
              onClick={() => onFilterChange('completed')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeFilter === 'completed'
                  ? 'bg-brand-500/15 text-brand-300 font-semibold border border-brand-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={15} className="text-emerald-400" />
                <span>Completed</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">{completedCount}</span>
            </button>
          </div>
        )}

        {/* Categories Section */}
        <div className="space-y-1 pt-2 border-t border-white/5">
          <div className="flex items-center justify-between px-3 mb-1">
            <span className="text-[10px] font-semibold tracking-wider text-dark-muted uppercase">
              Projects & Lists
            </span>
            <button
              onClick={onAddNewCategory}
              className="text-dark-muted hover:text-brand-400 transition-colors"
              title="Add Category"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="space-y-0.5">
            {categories.map((cat) => {
              const count = tasks.filter(t => t.categoryId === cat.id && !t.completed).length;
              const isSelected = selectedCategoryId === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(isSelected ? null : cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-[#222A44] text-white font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="truncate">{cat.name}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 ml-2">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Info & User Profile Snippet */}
      <div className="pt-4 border-t border-white/5 space-y-3">
        <button
          onClick={onOpenTutorial}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-dark-muted hover:text-white hover:bg-white/5 transition-colors"
        >
          <HelpCircle size={15} />
          <span>Walkthrough & Guides</span>
        </button>

        {/* Profile Card */}
        <div
          onClick={() => onTabChange('profile')}
          className="flex items-center gap-3 p-2 rounded-xl bg-[#1A2138] hover:bg-[#222A44] transition-colors cursor-pointer border border-white/5"
        >
          <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-300 flex items-center justify-center font-bold text-xs">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 truncate">
            <div className="font-poppins font-semibold text-xs text-white truncate">
              {user.name}
            </div>
            <div className="text-[10px] text-dark-muted truncate">{user.email}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
