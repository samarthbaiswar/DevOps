import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';
import { Task, Category } from '../types/task';
import { TaskCard } from '../components/TaskCard';
import {
  getCalendarMonthDays,
  getMonthName,
  formatDisplayDate,
  formatDateToISO,
  isToday,
} from '../utils/dateUtils';
import { EmptyTasksIllustration } from '../components/illustrations';

interface CalendarViewProps {
  tasks: Task[];
  categories: Category[];
  selectedDate: string;
  onSelectDate: (d: string) => void;
  onToggleComplete: (id: string) => void;
  onToggleImportant: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onClickDetail: (task: Task) => void;
  onOpenAddTask: (date?: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  categories,
  selectedDate,
  onSelectDate,
  onToggleComplete,
  onToggleImportant,
  onEditTask,
  onDeleteTask,
  onClickDetail,
  onOpenAddTask,
}) => {
  const [currentDate, setCurrentDate] = useState(() => {
    return selectedDate ? new Date(selectedDate + 'T00:00:00') : new Date();
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() - 1);
    setCurrentDate(d);
  };

  const handleNextMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + 1);
    setCurrentDate(d);
  };

  const monthDays = getCalendarMonthDays(year, month);
  const categoryMap = new Map(categories.map(c => [c.id, c]));

  // Tasks for selected date
  const dayTasks = tasks.filter(t => t.date === selectedDate);

  return (
    <div className="space-y-6 animate-fadeIn pb-16 md:pb-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-poppins font-bold text-xl md:text-2xl text-white">
            Calendar Schedule
          </h2>
          <p className="text-xs md:text-sm text-dark-muted">
            Plan, organize, and inspect your roadmap across time.
          </p>
        </div>

        <button
          onClick={() => onOpenAddTask(selectedDate)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-poppins font-semibold text-xs md:text-sm shadow-glow transition-all self-start"
        >
          <Plus size={16} className="stroke-[3]" />
          <span>Add Task on This Day</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Full Month Calendar Grid (7 cols) */}
        <div className="lg:col-span-7 bg-[#181D2F] border border-[#2B324A] rounded-2xl p-5 shadow-card space-y-4">
          {/* Header Month / Year controls */}
          <div className="flex items-center justify-between">
            <span className="font-poppins font-bold text-base md:text-lg text-white">
              {getMonthName(year, month)}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="w-8 h-8 rounded-lg bg-[#222738] hover:bg-brand-500 hover:text-white text-dark-muted flex items-center justify-center transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => {
                  const now = new Date();
                  setCurrentDate(now);
                  onSelectDate(formatDateToISO(now));
                }}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#222738] hover:bg-white/10 text-brand-300"
              >
                Today
              </button>
              <button
                onClick={handleNextMonth}
                className="w-8 h-8 rounded-lg bg-[#222738] hover:bg-brand-500 hover:text-white text-dark-muted flex items-center justify-center transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-dark-muted py-2 border-b border-white/5">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {monthDays.map((day, idx) => {
              const isSelected = day.dateStr === selectedDate;
              const dateTasks = tasks.filter(t => t.date === day.dateStr);

              return (
                <button
                  key={`${day.dateStr}-${idx}`}
                  onClick={() => onSelectDate(day.dateStr)}
                  className={`min-h-[54px] sm:min-h-[64px] p-1.5 rounded-xl flex flex-col justify-between text-left transition-all relative ${
                    !day.isCurrentMonth
                      ? 'text-slate-600 bg-black/10'
                      : isSelected
                      ? 'bg-brand-500 text-white font-bold shadow-glow border border-brand-400'
                      : day.isToday
                      ? 'bg-[#22283D] border border-brand-500/50 text-white'
                      : 'bg-[#1F2438] hover:bg-[#262C44] text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-poppins text-xs sm:text-sm font-semibold">
                      {day.dayNumber}
                    </span>
                    {day.isToday && !isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                    )}
                  </div>

                  {/* Task Pills on Calendar Cell */}
                  <div className="flex items-center gap-1 flex-wrap mt-1">
                    {dateTasks.slice(0, 3).map((t) => {
                      const cat = categoryMap.get(t.categoryId);
                      return (
                        <span
                          key={t.id}
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{
                            backgroundColor: isSelected ? '#FFFFFF' : cat?.color || '#246BFD',
                          }}
                        />
                      );
                    })}
                    {dateTasks.length > 3 && (
                      <span className="text-[9px] font-bold opacity-80">
                        +{dateTasks.length - 3}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#181D2F] border border-[#2B324A] rounded-2xl p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-400 tracking-wider">
                  Agenda for
                </span>
                <h3 className="font-poppins font-bold text-base md:text-lg text-white">
                  {formatDisplayDate(new Date(selectedDate + 'T00:00:00'))}
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-500/20 text-brand-300">
                {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
              </span>
            </div>

            {dayTasks.length === 0 ? (
              <div className="py-8 text-center flex flex-col items-center justify-center space-y-2">
                <EmptyTasksIllustration className="w-28 h-28" />
                <p className="text-xs text-dark-muted">
                  No tasks scheduled for this day.
                </p>
                <button
                  onClick={() => onOpenAddTask(selectedDate)}
                  className="mt-2 text-xs font-semibold text-brand-400 hover:text-brand-300"
                >
                  + Add task for this date
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[500px] overflow-y-auto no-scrollbar">
                {dayTasks.map(task => (
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
        </div>
      </div>
    </div>
  );
};
