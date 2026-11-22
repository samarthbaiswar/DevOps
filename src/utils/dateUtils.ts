export function getTodayString(): string {
  const now = new Date();
  return formatDateToISO(now);
}

export function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isToday(dateStr: string): boolean {
  return dateStr === getTodayString();
}

export function isUpcoming(dateStr: string): boolean {
  return dateStr > getTodayString();
}

export function isOverdue(dateStr: string, completed: boolean): boolean {
  if (completed) return false;
  return dateStr < getTodayString();
}

export function formatHumanDate(dateStr: string): string {
  if (!dateStr) return '';
  if (isToday(dateStr)) return 'Today';
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (dateStr === formatDateToISO(tomorrow)) return 'Tomorrow';

  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function getMonthName(year: number, monthIndex: number): string {
  const date = new Date(year, monthIndex, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export interface DayInfo {
  date: Date;
  dateStr: string;
  dayNumber: number;
  dayNameShort: string; // "Mon", "Tue"
  isCurrentMonth: boolean;
  isToday: boolean;
}

export function getCalendarMonthDays(year: number, monthIndex: number): DayInfo[] {
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const todayStr = getTodayString();

  // In Behance calendar, week starts on Monday: Mon, Tue, Wed, Thu, Fri, Sat, Sun
  let startDayOfWeek = firstDay.getDay(); // 0 is Sun, 1 is Mon...
  let paddingBefore = (startDayOfWeek + 6) % 7; // Mon=0, Tue=1, ..., Sun=6

  const days: DayInfo[] = [];

  // Previous month padding
  const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();
  for (let i = paddingBefore - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i;
    const d = new Date(year, monthIndex - 1, dayNum);
    const dateStr = formatDateToISO(d);
    days.push({
      date: d,
      dateStr,
      dayNumber: dayNum,
      dayNameShort: d.toLocaleDateString('en-US', { weekday: 'short' }),
      isCurrentMonth: false,
      isToday: dateStr === todayStr
    });
  }

  // Current month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const d = new Date(year, monthIndex, i);
    const dateStr = formatDateToISO(d);
    days.push({
      date: d,
      dateStr,
      dayNumber: i,
      dayNameShort: d.toLocaleDateString('en-US', { weekday: 'short' }),
      isCurrentMonth: true,
      isToday: dateStr === todayStr
    });
  }

  // Trailing days to round to multiples of 7 (usually 35 or 42)
  const remaining = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, monthIndex + 1, i);
    const dateStr = formatDateToISO(d);
    days.push({
      date: d,
      dateStr,
      dayNumber: i,
      dayNameShort: d.toLocaleDateString('en-US', { weekday: 'short' }),
      isCurrentMonth: false,
      isToday: dateStr === todayStr
    });
  }

  return days;
}

export function getCurrentWeekDays(centerDateStr?: string): DayInfo[] {
  const base = centerDateStr ? new Date(centerDateStr + 'T00:00:00') : new Date();
  const dayOfWeek = base.getDay();
  const diffToMonday = (dayOfWeek + 6) % 7;
  
  const monday = new Date(base);
  monday.setDate(base.getDate() - diffToMonday);

  const todayStr = getTodayString();
  const week: DayInfo[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = formatDateToISO(d);
    week.push({
      date: d,
      dateStr,
      dayNumber: d.getDate(),
      dayNameShort: d.toLocaleDateString('en-US', { weekday: 'short' }),
      isCurrentMonth: true,
      isToday: dateStr === todayStr
    });
  }

  return week;
}

export function formatTimeDisplay(timeStr?: string): string {
  if (!timeStr) return '';
  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  if (isNaN(h)) return timeStr;
  const period = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${period}`;
}
