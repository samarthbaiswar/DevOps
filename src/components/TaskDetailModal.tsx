import React from 'react';
import { X, Check, Star, Clock, Calendar, Bell, Edit3, Trash2, Tag, AlertCircle } from 'lucide-react';
import { Task, Category } from '../types/task';
import { formatTimeDisplay, formatHumanDate, isOverdue } from '../utils/dateUtils';
import { sound } from '../utils/sound';

interface TaskDetailModalProps {
  task: Task | null;
  category?: Category;
  isOpen: boolean;
  onClose: () => void;
  onToggleComplete: (id: string) => void;
  onToggleImportant: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  category,
  isOpen,
  onClose,
  onToggleComplete,
  onToggleImportant,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !task) return null;

  const overdue = isOverdue(task.date, task.completed);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[#1B2032] border border-[#2F3652] rounded-3xl p-6 shadow-2xl space-y-5 relative animate-scaleUp">
        {/* Header with Category Badge & Close */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {category && (
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full text-white shadow-sm"
                style={{ backgroundColor: category.color }}
              >
                {category.name}
              </span>
            )}
            {task.priority === 'high' && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-coral/20 text-coral border border-coral/30 uppercase">
                High Priority
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-dark-muted hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Task Title & Checkbox */}
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => {
              if (!task.completed) sound.playComplete();
              else sound.playClick();
              onToggleComplete(task.id);
            }}
            className={`w-7 h-7 mt-0.5 rounded-full flex items-center justify-center transition-all shrink-0 ${
              task.completed
                ? 'bg-[#22C55E] text-white shadow-sm'
                : 'border-2 border-[#4A5578] hover:border-brand-400'
            }`}
          >
            {task.completed && <Check size={16} className="stroke-[3]" />}
          </button>

          <div className="flex-1">
            <h3
              className={`font-poppins font-semibold text-lg md:text-xl text-white leading-snug ${
                task.completed ? 'line-through text-dark-muted' : ''
              }`}
            >
              {task.title}
            </h3>
            {overdue && (
              <div className="flex items-center gap-1.5 text-xs text-coral mt-1">
                <AlertCircle size={13} />
                <span>Overdue task</span>
              </div>
            )}
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-1.5 bg-[#22273D] border border-white/5 rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-dark-muted uppercase tracking-wider">
            Description
          </span>
          <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
            {task.description || 'No additional details provided for this task.'}
          </p>
        </div>

        {/* Meta Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#22273D] border border-white/5 text-slate-300">
            <Calendar size={16} className="text-brand-400 shrink-0" />
            <div>
              <div className="text-[10px] text-dark-muted">Due Date</div>
              <div className="font-semibold text-white">{formatHumanDate(task.date)}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#22273D] border border-white/5 text-slate-300">
            <Clock size={16} className="text-brand-400 shrink-0" />
            <div>
              <div className="text-[10px] text-dark-muted">Time</div>
              <div className="font-semibold text-white">
                {task.time ? formatTimeDisplay(task.time) : 'No time'}
              </div>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onToggleImportant(task.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                task.important
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                  : 'bg-[#22273D] text-dark-muted border-transparent hover:text-white'
              }`}
            >
              <Star size={14} className={task.important ? 'fill-amber-400 text-amber-400' : ''} />
              <span>{task.important ? 'Important' : 'Normal'}</span>
            </button>

            {task.remind && (
              <span className="flex items-center gap-1 text-xs text-brand-400 bg-brand-500/15 px-2.5 py-1.5 rounded-xl border border-brand-500/20">
                <Bell size={13} />
                <span>Reminder on</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(task);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2A314D] hover:bg-brand-500 text-white text-xs font-semibold transition-colors"
            >
              <Edit3 size={14} />
              <span>Edit</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playDelete();
                onDelete(task.id);
                onClose();
              }}
              className="p-2 rounded-xl text-dark-muted hover:text-coral hover:bg-coral/10 transition-colors"
              title="Delete task"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
