import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Task, CalendarSubTab } from '../types/task';
import {
  getCurrentWeekDays,
  getCalendarMonthDays,
  getMonthName,
  formatDateToISO,
  isToday
} from '../utils/dateUtils';

interface CalendarStripProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (dateStr: string) => void;
  tasks: Task[];
  activeSubTab: CalendarSubTab;
  onSubTabChange: (tab: CalendarSubTab) => void;
}

export const CalendarStrip: React.FC<CalendarStripProps> = ({
  selectedDate,
  onSelectDate,
  tasks,
  activeSubTab,
  onSubTabChange,
}) => {
  // Calendar month/year navigation state
  const [currentDateObj, setCurrentDateObj] = useState(() => {
    return selectedDate ? new Date(selectedDate + 'T00:00:00') : new Date();
  });

  const year = currentDateObj.getFullYear();
  const monthIndex = currentDateObj.getMonth();

  const handlePrev = () => {
    const next = new Date(currentDateObj);
    if (activeSubTab === 'monthly') {
      next.setMonth(next.getMonth() - 1);
    } else {
      next.setDate(next.getDate() - 7);
    }
    setCurrentDateObj(next);
  };

  const handleNext = () => {
    const next = new Date(currentDateObj);
    if (activeSubTab === 'monthly') {
      next.setMonth(next.getMonth() + 1);
    } else {
      next.setDate(next.getDate() + 7);
    }
    setCurrentDateObj(next);
  };

  // Helper to count tasks for a date
  const getTaskCountForDate = (dateStr: string) => {
    return tasks.filter(t => t.date === dateStr).length;
  };

  const weekDays = getCurrentWeekDays(formatDateToISO(currentDateObj));
  const monthDays = getCalendarMonthDays(year, monthIndex);

  return (
    <div className="bg-[#181D2F] border border-[#2B324A] rounded-2xl p-4 md:p-5 shadow-card space-y-4">
      {/* Top Header: Sub-tabs and Month Navigator */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Behance Sub-tab Switcher: MONTHLY vs DAILY */}
        <div className="inline-flex p-1 rounded-xl bg-[#141824] border border-white/5 w-full sm:w-auto">
          <button
            onClick={() => onSubTabChange('daily')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-poppins font-semibold uppercase tracking-wider transition-all duration-200 ${
              activeSubTab === 'daily'
                ? 'bg-brand-500 text-white shadow-glow-sm'
                : 'text-dark-muted hover:text-white'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => onSubTabChange('monthly')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-poppins font-semibold uppercase tracking-wider transition-all duration-200 ${
              activeSubTab === 'monthly'
                ? 'bg-brand-500 text-white shadow-glow-sm'
                : 'text-dark-muted hover:text-white'
            }`}
          >
            Monthly
          </button>
        </div>

        {/* Month Title & Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-7 h-7 rounded-lg bg-[#222738] hover:bg-brand-500 hover:text-white text-dark-muted flex items-center justify-center transition-colors"
            title="Previous"
          >
            <ChevronLeft size={16} />
          </button>
          
          <span className="font-poppins font-medium text-sm text-white px-2 min-w-[110px] text-center">
            {getMonthName(year, monthIndex)}
          </span>

          <button
            onClick={handleNext}
            className="w-7 h-7 rounded-lg bg-[#222738] hover:bg-brand-500 hover:text-white text-dark-muted flex items-center justify-center transition-colors"
            title="Next"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* DAILY VIEW: Week Strip with Active Blue Pill */}
      {activeSubTab === 'daily' && (
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {weekDays.map(day => {
            const isSelected = day.dateStr === selectedDate;
            const taskCount = getTaskCountForDate(day.dateStr);

            return (
              <button
                key={day.dateStr}
                onClick={() => onSelectDate(day.dateStr)}
                className={`relative flex flex-col items-center justify-center py-2.5 sm:py-3 px-1 rounded-xl transition-all duration-200 group ${
                  isSelected
                    ? 'bg-brand-500 text-white shadow-glow'
                    : 'bg-[#1F2438] hover:bg-[#252C44] text-slate-300'
                }`}
              >
                {/* Day of Week */}
                <span
                  className={`text-[10px] sm:text-xs font-medium uppercase tracking-wider mb-1 ${
                    isSelected ? 'text-blue-100' : 'text-dark-muted group-hover:text-slate-200'
                  }`}
                >
                  {day.dayNameShort}
                </span>

                {/* Day Number */}
                <span className="font-poppins font-bold text-sm sm:text-base leading-none">
                  {String(day.dayNumber).padStart(2, '0')}
                </span>

                {/* Task Indicator Dot */}
                <div className="h-1.5 mt-1.5 flex items-center justify-center">
                  {taskCount > 0 && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-white' : 'bg-brand-400'
                      }`}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* MONTHLY VIEW: Full 7-column calendar grid */}
      {activeSubTab === 'monthly' && (
        <div className="space-y-2">
          {/* Day of week abbreviations */}
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-dark-muted py-1 border-b border-white/5">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {monthDays.map((day, idx) => {
              const isSelected = day.dateStr === selectedDate;
              const taskCount = getTaskCountForDate(day.dateStr);

              return (
                <button
                  key={`${day.dateStr}-${idx}`}
                  onClick={() => onSelectDate(day.dateStr)}
                  className={`h-9 sm:h-10 rounded-lg flex flex-col items-center justify-center relative text-xs font-poppins transition-all duration-150 ${
                    !day.isCurrentMonth
                      ? 'text-slate-600 hover:text-slate-400'
                      : isSelected
                      ? 'bg-brand-500 text-white font-bold shadow-glow-sm'
                      : day.isToday
                      ? 'border border-brand-500/60 text-brand-300 font-semibold hover:bg-brand-500/10'
                      : 'text-slate-300 hover:bg-[#252C44]'
                  }`}
                >
                  <span>{day.dayNumber}</span>
                  {taskCount > 0 && (
                    <span
                      className={`absolute bottom-1 w-1 h-1 rounded-full ${
                        isSelected ? 'bg-white' : 'bg-brand-400'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
