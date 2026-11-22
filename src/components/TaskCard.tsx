import React, { useState } from 'react';
import { Check, Star, Clock, Bell, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { Task, Category } from '../types/task';
import { isOverdue, formatTimeDisplay, formatHumanDate } from '../utils/dateUtils';
import { sound } from '../utils/sound';

interface TaskCardProps {
  task: Task;
  category?: Category;
  onToggleComplete: (id: string) => void;
  onToggleImportant: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onClickDetail: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  category,
  onToggleComplete,
  onToggleImportant,
  onEdit,
  onDelete,
  onClickDetail,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const overdue = isOverdue(task.date, task.completed);

  const handleCompleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!task.completed) {
      sound.playComplete();
    } else {
      sound.playClick();
    }
    onToggleComplete(task.id);
  };

  const handleImportantClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    onToggleImportant(task.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDeleting) {
      setIsDeleting(true);
      return;
    }
    sound.playDelete();
    onDelete(task.id);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(false);
  };

  return (
    <div
      onClick={() => onClickDetail(task)}
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-200 cursor-pointer p-4 select-none ${
        task.completed
          ? 'bg-[#181C2A]/60 border-[#242A3D] opacity-75'
          : overdue
          ? 'bg-[#1E2133] border-coral/40 shadow-glow-coral/20'
          : 'bg-[#1F2438] border-[#2C334D] hover:border-brand-500/60 hover:bg-[#232940] shadow-card hover:shadow-card-hover'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: Checkbox & Task Info */}
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          {/* Animated Circular Checkbox matching Behance */}
          <button
            type="button"
            onClick={handleCompleteClick}
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 ${
              task.completed
                ? 'bg-[#22C55E] text-white shadow-sm scale-105'
                : 'border-2 border-[#4A5578] hover:border-brand-400 bg-transparent'
            }`}
            title={task.completed ? 'Mark incomplete' : 'Mark complete'}
          >
            {task.completed && <Check size={14} className="stroke-[3]" />}
          </button>

          {/* Title & Description & Badges */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`font-roboto text-sm md:text-base font-normal truncate transition-all ${
                  task.completed
                    ? 'line-through text-dark-muted'
                    : 'text-white font-medium'
                }`}
              >
                {task.title}
              </span>

              {/* Overdue tag */}
              {overdue && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-coral/20 text-coral border border-coral/30">
                  <AlertCircle size={10} />
                  Overdue
                </span>
              )}
            </div>

            {/* Description Preview if any */}
            {task.description && !task.completed && (
              <p className="text-xs text-dark-muted truncate mt-0.5 max-w-md">
                {task.description}
              </p>
            )}

            {/* Sub-row: Category, Date, Time */}
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {/* Category Badge matching Behance gradient pill */}
              {category && (
                <span
                  className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full text-white tracking-wide"
                  style={{
                    backgroundColor: category.color || '#246BFD',
                  }}
                >
                  {category.name}
                </span>
              )}

              {/* Due Date */}
              <span className="text-[11px] text-dark-muted flex items-center gap-1">
                {formatHumanDate(task.date)}
              </span>

              {/* Time Indicator */}
              {task.time && (
                <span className="text-[11px] text-dark-muted flex items-center gap-1">
                  <Clock size={11} className="text-slate-400" />
                  {formatTimeDisplay(task.time)}
                </span>
              )}

              {/* Remind Icon */}
              {task.remind && (
                <span title="Reminder set">
                  <Bell size={11} className="text-brand-300" />
                </span>
              )}

              {/* Priority badge if High */}
              {task.priority === 'high' && !task.completed && (
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-coral/15 text-coral border border-coral/30">
                  High
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Star & Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Star/Important Button */}
          <button
            type="button"
            onClick={handleImportantClick}
            className={`p-1.5 rounded-lg transition-colors ${
              task.important
                ? 'text-amber hover:text-amber-hover'
                : 'text-dark-muted hover:text-slate-200'
            }`}
            title={task.important ? 'Unstar' : 'Star as important'}
          >
            <Star
              size={18}
              className={task.important ? 'fill-amber text-amber' : ''}
            />
          </button>

          {/* Quick Edit */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="p-1.5 rounded-lg text-dark-muted hover:text-white hover:bg-white/10 transition-colors opacity-80 group-hover:opacity-100"
            title="Edit task"
          >
            <Edit2 size={15} />
          </button>

          {/* Delete Action / Confirmation */}
          {isDeleting ? (
            <div className="flex items-center gap-1 animate-fadeIn">
              <button
                type="button"
                onClick={handleDeleteClick}
                className="px-2 py-1 rounded bg-coral text-white text-[11px] font-semibold hover:bg-coral-hover transition-colors"
              >
                Delete?
              </button>
              <button
                type="button"
                onClick={handleCancelDelete}
                className="px-2 py-1 rounded bg-[#333A52] text-slate-300 text-[11px] hover:text-white"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleDeleteClick}
              className="p-1.5 rounded-lg text-dark-muted hover:text-coral hover:bg-coral/10 transition-colors opacity-0 group-hover:opacity-100"
              title="Delete task"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
