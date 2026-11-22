import React from 'react';
import { CheckCircle2, Flame, Plus } from 'lucide-react';
import { Task } from '../types/task';
import { isToday } from '../utils/dateUtils';

interface ProgressCardProps {
  tasks: Task[];
  onQuickAdd: () => void;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ tasks, onQuickAdd }) => {
  const todayTasks = tasks.filter(t => isToday(t.date));
  const completedToday = todayTasks.filter(t => t.completed).length;
  const totalToday = todayTasks.length;
  const percentage = totalToday === 0 ? 0 : Math.round((completedToday / totalToday) * 100);

  const getEncouragement = () => {
    if (totalToday === 0) return 'No tasks scheduled for today. Take a breather or plan ahead!';
    if (percentage === 100) return 'Very nice! You have completed all tasks for today.';
    if (percentage >= 50) return 'More than halfway done! Keep up the great momentum.';
    return 'Make today count. Start with your most important task!';
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E294B] via-[#1F2438] to-[#181D2F] border border-[#2B324A] p-5 md:p-6 shadow-card transition-all duration-300">
      {/* Subtle Ambient Background Blob */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-coral/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-400 border border-brand-500/30">
              <Flame size={12} className="text-amber-400 animate-pulse" />
              Daily Progress
            </span>
            <span className="text-xs text-dark-muted">
              {completedToday}/{totalToday} Tasks Completed
            </span>
          </div>

          <h3 className="font-poppins font-semibold text-lg md:text-xl text-white tracking-tight">
            {getEncouragement()}
          </h3>

          {/* Progress Bar Container */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-400">Completion Rate</span>
              <span className="font-poppins font-semibold text-brand-400">{percentage}%</span>
            </div>
            <div className="w-full h-2.5 bg-dark-bg/80 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 via-brand-400 to-[#22C55E] transition-all duration-700 ease-out shadow-glow-sm"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="flex items-center gap-3 self-start md:self-center shrink-0">
          <button
            onClick={onQuickAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-poppins font-medium text-sm shadow-glow transition-all duration-200 active:scale-95 group"
          >
            <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center transition-transform group-hover:rotate-90">
              <Plus size={14} className="stroke-[3]" />
            </div>
            <span>New Task</span>
          </button>
        </div>
      </div>
    </div>
  );
};
