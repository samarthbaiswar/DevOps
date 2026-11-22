import React from 'react';
import {
  Search,
  X,
  Plus,
  SlidersHorizontal,
  Smartphone,
  Monitor,
  Bell,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { FilterType, SortOption, UserProfile } from '../types/task';
import { formatDisplayDate } from '../utils/dateUtils';

interface HeaderProps {
  user: UserProfile;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  filterCounts: Record<FilterType, number>;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  onOpenAddTask: () => void;
  isMobilePreview: boolean;
  onToggleMobilePreview: () => void;
  onOpenTutorial: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  filterCounts,
  sortOption,
  onSortChange,
  onOpenAddTask,
  isMobilePreview,
  onToggleMobilePreview,
  onOpenTutorial,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All Tasks' },
    { key: 'today', label: 'Today' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'important', label: 'Starred' },
    { key: 'completed', label: 'Completed' },
    { key: 'overdue', label: 'Overdue' },
  ];

  return (
    <header className="space-y-4">
      {/* Top Bar: Personalized greeting, date, and quick preview toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-poppins font-bold text-xl md:text-2xl text-white tracking-tight">
              {getGreeting()}, {user.name.split(' ')[0]} 👋
            </h1>
            <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <p className="text-xs md:text-sm text-dark-muted font-normal mt-0.5">
            {formatDisplayDate(new Date())} • Stay focused and conquer your day
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Behance Mobile Mockup vs Full Desktop App Switcher */}
          <button
            onClick={onToggleMobilePreview}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-poppins font-semibold border transition-all ${
              isMobilePreview
                ? 'bg-brand-500/20 text-brand-300 border-brand-500 shadow-glow-sm'
                : 'bg-[#181D2F] text-slate-300 border-[#2B324A] hover:text-white hover:border-slate-500'
            }`}
            title="Toggle Behance Mobile Frame Preview"
          >
            {isMobilePreview ? <Monitor size={15} /> : <Smartphone size={15} />}
            <span className="hidden sm:inline">
              {isMobilePreview ? 'Desktop View' : 'Mobile App Frame'}
            </span>
          </button>

          {/* Tutorial / Help Guide */}
          <button
            onClick={onOpenTutorial}
            className="p-2 rounded-xl bg-[#181D2F] border border-[#2B324A] hover:border-slate-500 text-slate-300 hover:text-white transition-colors"
            title="View App Tutorial"
          >
            <HelpCircle size={17} />
          </button>

          {/* Add Task Primary Button */}
          <button
            onClick={onOpenAddTask}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-poppins font-semibold text-xs md:text-sm shadow-glow transition-all active:scale-95"
          >
            <Plus size={16} className="stroke-[3]" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Second Row: Realtime Search & Sort dropdown */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks by title, note, or description..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#181D2F] border border-[#2B324A] focus:border-brand-500 focus:outline-none text-white text-xs md:text-sm placeholder:text-slate-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-muted hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#181D2F] border border-[#2B324A] text-xs text-slate-300">
            <SlidersHorizontal size={14} className="text-dark-muted" />
            <span className="text-dark-muted hidden sm:inline">Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="date-asc" className="bg-[#181D2F]">Due Date (Soonest)</option>
              <option value="date-desc" className="bg-[#181D2F]">Due Date (Latest)</option>
              <option value="priority-desc" className="bg-[#181D2F]">Priority (High to Low)</option>
              <option value="title-asc" className="bg-[#181D2F]">Title (A - Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Third Row: Filter Chips matching Behance active states */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
        {filters.map((f) => {
          const isActive = activeFilter === f.key;
          const count = filterCounts[f.key] ?? 0;

          return (
            <button
              key={f.key}
              onClick={() => onFilterChange(f.key)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-poppins font-semibold shrink-0 transition-all duration-200 ${
                isActive
                  ? 'bg-brand-500 text-white shadow-glow-sm scale-[1.02]'
                  : 'bg-[#181D2F] border border-[#2B324A] text-slate-400 hover:text-white hover:border-slate-600'
              }`}
            >
              <span>{f.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-dark-muted'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
