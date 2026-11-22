import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  Bell,
  Star,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Check,
  ChevronDown
} from 'lucide-react';
import { Task, Category, Priority } from '../types/task';
import { getTodayString, getCalendarMonthDays, getMonthName } from '../utils/dateUtils';
import { sound } from '../utils/sound';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'createdAt' | 'completed' | 'completedAt'>) => void;
  categories: Category[];
  taskToEdit?: Task | null;
  onAddNewCategory: () => void;
  defaultDate?: string;
  defaultCategoryId?: string | null;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categories,
  taskToEdit,
  onAddNewCategory,
  defaultDate,
  defaultCategoryId,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(getTodayString());
  const [time, setTime] = useState('14:00');
  const [important, setImportant] = useState(false);
  const [remind, setRemind] = useState(false);
  const [priority, setPriority] = useState<Priority>('medium');

  // UI state for inline picker expansions matching Behance
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Month navigation for date picker
  const [pickerDate, setPickerDate] = useState(new Date());

  // Time picker components: 12-hour format
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [selectedAmPm, setSelectedAmPm] = useState<'am' | 'pm'>('pm');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setCategoryId(taskToEdit.categoryId);
      setDate(taskToEdit.date);
      setTime(taskToEdit.time || '14:00');
      setImportant(taskToEdit.important);
      setRemind(taskToEdit.remind);
      setPriority(taskToEdit.priority);

      // Parse time into 12-hour tumbler
      if (taskToEdit.time) {
        const [h, m] = taskToEdit.time.split(':').map(Number);
        const ampm = h >= 12 ? 'pm' : 'am';
        const h12 = h % 12 || 12;
        setSelectedHour(h12);
        setSelectedMinute(String(m || '00').padStart(2, '0'));
        setSelectedAmPm(ampm);
      }
    } else {
      setTitle('');
      setDescription('');
      setCategoryId(defaultCategoryId || (categories[0]?.id ?? ''));
      setDate(defaultDate || getTodayString());
      setTime('14:00');
      setSelectedHour(2);
      setSelectedMinute('00');
      setSelectedAmPm('pm');
      setImportant(false);
      setRemind(false);
      setPriority('medium');
    }
    setShowCategoryDropdown(false);
    setShowDatePicker(false);
    setShowTimePicker(false);
  }, [taskToEdit, isOpen, defaultDate, defaultCategoryId, categories]);

  if (!isOpen) return null;

  const handleHourSelect = (h: number) => {
    setSelectedHour(h);
    updateComputedTime(h, selectedMinute, selectedAmPm);
  };

  const handleMinuteSelect = (m: string) => {
    setSelectedMinute(m);
    updateComputedTime(selectedHour, m, selectedAmPm);
  };

  const handleAmPmToggle = (ampm: 'am' | 'pm') => {
    setSelectedAmPm(ampm);
    updateComputedTime(selectedHour, selectedMinute, ampm);
  };

  const updateComputedTime = (h12: number, minStr: string, ampm: 'am' | 'pm') => {
    let h24 = h12;
    if (ampm === 'pm' && h12 < 12) h24 = h12 + 12;
    if (ampm === 'am' && h12 === 12) h24 = 0;
    const computed = `${String(h24).padStart(2, '0')}:${minStr}`;
    setTime(computed);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sound.playClick();
    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      categoryId: categoryId || categories[0]?.id || 'general',
      date,
      time,
      important,
      remind,
      priority,
    });
    onClose();
  };

  const selectedCategory = categories.find(c => c.id === categoryId);

  // Month navigation
  const prevMonth = () => {
    const d = new Date(pickerDate);
    d.setMonth(d.getMonth() - 1);
    setPickerDate(d);
  };

  const nextMonth = () => {
    const d = new Date(pickerDate);
    d.setMonth(d.getMonth() + 1);
    setPickerDate(d);
  };

  const monthDays = getCalendarMonthDays(pickerDate.getFullYear(), pickerDate.getMonth());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container mirroring Behance Add/Edit Task screen */}
      <div
        className="w-full max-w-md bg-[#181D2F] border border-[#2F3652] rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto no-scrollbar relative"
        onClick={() => {
          setShowCategoryDropdown(false);
        }}
      >
        {/* Header matching Behance: "< Add/Edit Task" with Bell Icon */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="font-poppins font-semibold text-base">
              {taskToEdit ? 'Edit Task' : 'Add/Edit Task'}
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRemind(!remind)}
              className={`p-2 rounded-xl transition-colors ${
                remind ? 'bg-brand-500/20 text-brand-400' : 'text-dark-muted hover:text-white'
              }`}
              title="Toggle Reminder"
            >
              <Bell size={18} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-dark-muted hover:text-white hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Field 1: Task name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-dark-muted">
              Task name
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Meeting with design team"
              className="w-full px-4 py-3 rounded-xl bg-[#22273D] border border-[#2F3652] focus:border-brand-500 focus:outline-none text-white text-sm placeholder:text-slate-500 transition-colors"
            />
          </div>

          {/* Field 2: Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-dark-muted">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Morning running or project goals"
              className="w-full px-4 py-3 rounded-xl bg-[#22273D] border border-[#2F3652] focus:border-brand-500 focus:outline-none text-white text-sm placeholder:text-slate-500 transition-colors resize-none"
            />
          </div>

          {/* Field 3: Select a category dropdown matching Behance */}
          <div className="space-y-1.5 relative">
            <label className="block text-xs font-medium text-dark-muted">
              Select a category
            </label>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowCategoryDropdown(!showCategoryDropdown);
              }}
              className="w-full px-4 py-3 rounded-xl bg-[#22273D] border border-[#2F3652] hover:border-slate-500 flex items-center justify-between text-sm text-left transition-colors"
            >
              <div className="flex items-center gap-2.5">
                {selectedCategory ? (
                  <>
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: selectedCategory.color }}
                    />
                    <span className="text-white font-medium">{selectedCategory.name}</span>
                  </>
                ) : (
                  <span className="text-slate-400">Select category</span>
                )}
              </div>
              <ChevronDown size={16} className="text-dark-muted" />
            </button>

            {/* Dropdown Menu */}
            {showCategoryDropdown && (
              <div
                className="absolute z-20 top-full mt-1.5 left-0 right-0 rounded-xl bg-[#22273D] border border-[#3A4366] shadow-xl py-1.5 overflow-hidden animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
              >
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCategoryId(cat.id);
                      setShowCategoryDropdown(false);
                    }}
                    className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-[#2A314D] text-sm text-slate-200 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span>{cat.name}</span>
                    </div>
                    {categoryId === cat.id && <Check size={14} className="text-brand-400" />}
                  </button>
                ))}

                <div className="border-t border-white/10 mt-1 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCategoryDropdown(false);
                      onAddNewCategory();
                    }}
                    className="w-full px-4 py-2 flex items-center gap-2 text-brand-400 hover:text-brand-300 text-xs font-semibold hover:bg-brand-500/10 transition-colors"
                  >
                    <Plus size={14} />
                    <span>+ Add Category</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Field 4: Date Picker Input & Inline Calendar Widget */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-dark-muted">
              Date
            </label>
            <div
              onClick={() => {
                setShowDatePicker(!showDatePicker);
                setShowTimePicker(false);
              }}
              className="w-full px-4 py-3 rounded-xl bg-[#22273D] border border-[#2F3652] hover:border-slate-500 flex items-center justify-between text-sm cursor-pointer transition-colors"
            >
              <span className="text-white font-medium">{date}</span>
              <CalendarIcon size={16} className="text-dark-muted" />
            </div>

            {/* Expandable Calendar Month Grid matching Behance */}
            {showDatePicker && (
              <div className="p-3.5 rounded-2xl bg-[#1D2235] border border-[#343D5E] space-y-3 animate-fadeIn mt-2">
                <div className="flex items-center justify-between">
                  <span className="font-poppins font-semibold text-xs text-white">
                    {getMonthName(pickerDate.getFullYear(), pickerDate.getMonth())}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={prevMonth}
                      className="p-1 rounded bg-[#2A314D] hover:bg-brand-500 text-slate-300 hover:text-white"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={nextMonth}
                      className="p-1 rounded bg-[#2A314D] hover:bg-brand-500 text-slate-300 hover:text-white"
                    >
                      <ChevronLeft size={14} className="rotate-180" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-dark-muted">
                  <span>M</span>
                  <span>T</span>
                  <span>W</span>
                  <span>T</span>
                  <span>F</span>
                  <span>S</span>
                  <span>S</span>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {monthDays.map((day, idx) => {
                    const isSelected = day.dateStr === date;
                    return (
                      <button
                        key={`modal-cal-${day.dateStr}-${idx}`}
                        type="button"
                        onClick={() => {
                          setDate(day.dateStr);
                          setShowDatePicker(false);
                        }}
                        className={`h-7 rounded-lg text-xs font-poppins flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-brand-500 text-white font-bold shadow-glow-sm'
                            : day.isCurrentMonth
                            ? 'text-slate-200 hover:bg-[#2A314D]'
                            : 'text-slate-600'
                        }`}
                      >
                        {day.dayNumber}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Field 5: Time Picker Input & Inline Tumbler Wheel */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-dark-muted">
              Time
            </label>
            <div
              onClick={() => {
                setShowTimePicker(!showTimePicker);
                setShowDatePicker(false);
              }}
              className="w-full px-4 py-3 rounded-xl bg-[#22273D] border border-[#2F3652] hover:border-slate-500 flex items-center justify-between text-sm cursor-pointer transition-colors"
            >
              <span className="text-white font-medium">
                {selectedHour}:{selectedMinute} {selectedAmPm.toUpperCase()}
              </span>
              <Clock size={16} className="text-dark-muted" />
            </div>

            {/* Expandable Time Tumbler Selector matching Behance Screenshot 6 */}
            {showTimePicker && (
              <div className="p-4 rounded-2xl bg-[#1D2235] border border-[#343D5E] space-y-3 animate-fadeIn mt-2">
                <div className="flex items-center justify-around text-center py-2 bg-[#161A29] rounded-xl border border-white/5">
                  {/* Hours */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-dark-muted uppercase mb-1">Hour</span>
                    <select
                      value={selectedHour}
                      onChange={(e) => handleHourSelect(Number(e.target.value))}
                      className="bg-[#2A314D] text-white text-sm font-poppins font-semibold rounded-lg px-2.5 py-1.5 border border-white/10 focus:outline-none"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                        <option key={h} value={h}>
                          {String(h).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <span className="text-slate-400 font-bold text-lg pt-4">:</span>

                  {/* Minutes */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-dark-muted uppercase mb-1">Min</span>
                    <select
                      value={selectedMinute}
                      onChange={(e) => handleMinuteSelect(e.target.value)}
                      className="bg-[#2A314D] text-white text-sm font-poppins font-semibold rounded-lg px-2.5 py-1.5 border border-white/10 focus:outline-none"
                    >
                      {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* AM / PM Toggle */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-dark-muted uppercase mb-1">Period</span>
                    <div className="inline-flex rounded-lg bg-[#2A314D] p-0.5 border border-white/10">
                      <button
                        type="button"
                        onClick={() => handleAmPmToggle('am')}
                        className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                          selectedAmPm === 'am' ? 'bg-brand-500 text-white' : 'text-slate-400'
                        }`}
                      >
                        AM
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAmPmToggle('pm')}
                        className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                          selectedAmPm === 'pm' ? 'bg-brand-500 text-white' : 'text-slate-400'
                        }`}
                      >
                        PM
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Field 6: Quick Chips - Important & Remind toggles matching Behance */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => setImportant(!important)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                important
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-glow-sm'
                  : 'bg-[#22273D] text-dark-muted border-[#2F3652] hover:text-white'
              }`}
            >
              <Star size={14} className={important ? 'fill-amber-400 text-amber-400' : ''} />
              <span>Important</span>
            </button>

            <button
              type="button"
              onClick={() => setRemind(!remind)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                remind
                  ? 'bg-brand-500/20 text-brand-300 border-brand-500/50 shadow-glow-sm'
                  : 'bg-[#22273D] text-dark-muted border-[#2F3652] hover:text-white'
              }`}
            >
              <Bell size={14} className={remind ? 'text-brand-400' : ''} />
              <span>Remind</span>
            </button>
          </div>

          {/* Priority selector */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-dark-muted font-medium">Priority</span>
            <div className="inline-flex rounded-xl bg-[#22273D] p-1 border border-[#2F3652]">
              {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                    priority === p
                      ? p === 'high'
                        ? 'bg-coral text-white font-semibold'
                        : p === 'medium'
                        ? 'bg-brand-500 text-white font-semibold'
                        : 'bg-emerald-600 text-white font-semibold'
                      : 'text-dark-muted hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Primary Confirm Button matching Behance in #246BFD */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-poppins font-semibold text-sm tracking-wide shadow-glow transition-all active:scale-[0.99]"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
