import React from 'react';
import { FolderKanban, CheckSquare, Calendar, User, Plus } from 'lucide-react';
import { ActiveTab } from '../types/task';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenAddTask: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenAddTask,
}) => {
  return (
    <div className="fixed md:hidden bottom-0 left-0 right-0 z-40 bg-[#161C2E]/95 backdrop-blur-md border-t border-[#252E47] px-4 py-2">
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        {/* Categories Tab */}
        <button
          onClick={() => onTabChange('categories')}
          className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
            activeTab === 'categories' ? 'text-brand-400' : 'text-dark-muted hover:text-white'
          }`}
        >
          <FolderKanban size={20} />
          <span className="text-[10px] font-poppins font-medium">Categories</span>
        </button>

        {/* Tasks Tab */}
        <button
          onClick={() => onTabChange('tasks')}
          className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
            activeTab === 'tasks' ? 'text-brand-400' : 'text-dark-muted hover:text-white'
          }`}
        >
          <CheckSquare size={20} />
          <span className="text-[10px] font-poppins font-medium">Tasks</span>
        </button>

        {/* Center Floating Action Button matching Behance in #246BFD */}
        <div className="relative -top-5">
          <button
            onClick={onOpenAddTask}
            className="w-13 h-13 w-12 h-12 rounded-full bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center shadow-glow border-4 border-[#141A2E] transition-transform active:scale-90"
            title="Add new task"
          >
            <Plus size={22} className="stroke-[3]" />
          </button>
        </div>

        {/* Calendar Tab */}
        <button
          onClick={() => onTabChange('calendar')}
          className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
            activeTab === 'calendar' ? 'text-brand-400' : 'text-dark-muted hover:text-white'
          }`}
        >
          <Calendar size={20} />
          <span className="text-[10px] font-poppins font-medium">Calendar</span>
        </button>

        {/* Profile Tab */}
        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
            activeTab === 'profile' ? 'text-brand-400' : 'text-dark-muted hover:text-white'
          }`}
        >
          <User size={20} />
          <span className="text-[10px] font-poppins font-medium">Profile</span>
        </button>
      </div>
    </div>
  );
};
