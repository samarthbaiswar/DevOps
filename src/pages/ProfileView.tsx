import React from 'react';
import {
  User,
  Bell,
  Volume2,
  Globe,
  Lock,
  Palette,
  LogOut,
  CheckCircle2,
  ListTodo,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { UserProfile, Task, ThemeMode } from '../types/task';
import { ProgressChart } from '../components/ProgressChart';
import { sound } from '../utils/sound';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  tasks: Task[];
  onResetData: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateUser,
  tasks,
  onResetData,
}) => {
  const [nameDraft, setNameDraft] = React.useState(user.name);

  React.useEffect(() => {
    setNameDraft(user.name);
  }, [user.name]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const handleNameSave = () => {
    const nextName = nameDraft.trim();
    if (!nextName) {
      setNameDraft(user.name);
      return;
    }

    onUpdateUser({ name: nextName });
  };

  const handleSoundToggle = () => {
    const next = !user.soundEnabled;
    sound.setEnabled(next);
    if (next) sound.playClick();
    onUpdateUser({ soundEnabled: next });
  };

  const handleNotificationToggle = () => {
    sound.playClick();
    onUpdateUser({ notifications: !user.notifications });
  };

  const handleThemeSelect = (theme: ThemeMode) => {
    sound.playClick();
    onUpdateUser({ theme });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16 md:pb-6 max-w-3xl mx-auto">
      {/* 1. Profile Header Card matching Behance Image 6 */}
      <div className="bg-[#181D2F] border border-[#2B324A] rounded-3xl p-6 shadow-card flex flex-col items-center text-center space-y-3 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* User Avatar */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-500 to-[#779FF2] p-1 shadow-glow">
            <div className="w-full h-full rounded-full bg-[#181D2F] flex items-center justify-center overflow-hidden">
              <User size={36} className="text-white" />
            </div>
          </div>
          <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#181D2F] flex items-center justify-center text-[10px] text-white">
            ✓
          </span>
        </div>

        <div>
          <h3 className="font-poppins font-bold text-lg md:text-xl text-white">
            {user.name}
          </h3>
          <p className="text-xs text-dark-muted font-normal mt-0.5">
            {user.email}
          </p>
        </div>

        <div className="w-full max-w-md pt-1">
          <label className="block text-left text-[11px] uppercase tracking-[0.18em] text-dark-muted mb-2">
            Display Name
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={nameDraft}
              onChange={(event) => setNameDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleNameSave();
                }
              }}
              placeholder="Enter your name"
              className="w-full rounded-xl border border-[#2F3958] bg-[#131B33] px-3 py-2.5 text-sm text-white placeholder:text-dark-muted outline-none transition focus:border-brand-500"
            />
            <button
              type="button"
              onClick={handleNameSave}
              className="rounded-xl bg-brand-500 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-brand-400"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* 2. Statistics Grid matching Behance: Total tasks & Completed tasks with sparklines */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total Tasks Card */}
        <div className="bg-[#181D2F] border border-[#2B324A] rounded-2xl p-4 sm:p-5 shadow-card flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-dark-muted font-medium">Total tasks</span>
            <div className="w-7 h-7 rounded-lg bg-brand-500/15 text-brand-400 flex items-center justify-center">
              <ListTodo size={15} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-poppins font-bold text-2xl sm:text-3xl text-white">
              {totalTasks}
            </span>
            <span className="text-[11px] text-brand-300 font-medium">Lifetime</span>
          </div>

          {/* Mini Sparkline SVG */}
          <div className="h-6 w-full">
            <svg viewBox="0 0 100 24" className="w-full h-full overflow-visible">
              <path
                d="M 0 18 Q 20 8, 40 14 T 80 6 T 100 10"
                fill="none"
                stroke="#246BFD"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Completed Tasks Card */}
        <div className="bg-[#181D2F] border border-[#2B324A] rounded-2xl p-4 sm:p-5 shadow-card flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-dark-muted font-medium">Completed tasks</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 size={15} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-poppins font-bold text-2xl sm:text-3xl text-white">
              {completedTasks}
            </span>
            <span className="text-[11px] text-emerald-400 font-medium">
              {completionRate}% rate
            </span>
          </div>

          {/* Mini Sparkline SVG */}
          <div className="h-6 w-full">
            <svg viewBox="0 0 100 24" className="w-full h-full overflow-visible">
              <path
                d="M 0 20 Q 25 18, 50 10 T 75 14 T 100 4"
                fill="none"
                stroke="#22C55E"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Your Progress Curve Area Chart */}
      <ProgressChart tasks={tasks} />

      {/* 4. Settings List matching Behance Image 6 */}
      <div className="bg-[#181D2F] border border-[#2B324A] rounded-2xl p-5 shadow-card space-y-4">
        <h4 className="font-poppins font-semibold text-sm text-white">
          Settings & Preferences
        </h4>

        <div className="divide-y divide-white/5 text-sm">
          {/* Notifications */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#22283D] flex items-center justify-center text-brand-400">
                <Bell size={16} />
              </div>
              <span className="text-slate-200 font-medium">Notifications</span>
            </div>
            <button
              onClick={handleNotificationToggle}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                user.notifications
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                  : 'bg-[#22283D] text-dark-muted'
              }`}
            >
              {user.notifications ? 'On' : 'Off'}
            </button>
          </div>

          {/* Sound */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#22283D] flex items-center justify-center text-brand-400">
                <Volume2 size={16} />
              </div>
              <span className="text-slate-200 font-medium">Tactile Sound Effects</span>
            </div>
            <button
              onClick={handleSoundToggle}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                user.soundEnabled
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                  : 'bg-[#22283D] text-dark-muted'
              }`}
            >
              {user.soundEnabled ? 'On' : 'Off'}
            </button>
          </div>

          {/* Language */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#22283D] flex items-center justify-center text-brand-400">
                <Globe size={16} />
              </div>
              <span className="text-slate-200 font-medium">Language</span>
            </div>
            <span className="text-xs text-dark-muted flex items-center gap-1">
              <span>{user.language}</span>
              <ChevronRight size={14} />
            </span>
          </div>

          {/* Theme Switcher matching Behance color dots */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#22283D] flex items-center justify-center text-brand-400">
                <Palette size={16} />
              </div>
              <span className="text-slate-200 font-medium">Theme Style</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Deep Navy (Behance Default) */}
              <button
                type="button"
                onClick={() => handleThemeSelect('navy')}
                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                  user.theme === 'navy' ? 'border-brand-400 scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: '#142453' }}
                title="Deep Navy Theme"
              />

              {/* Pitch Dark */}
              <button
                type="button"
                onClick={() => handleThemeSelect('dark')}
                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                  user.theme === 'dark' ? 'border-brand-400 scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: '#181A20' }}
                title="Dark Theme"
              />

              {/* Soft Light */}
              <button
                type="button"
                onClick={() => handleThemeSelect('light')}
                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                  user.theme === 'light' ? 'border-brand-400 scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: '#F4F6FA' }}
                title="Light Theme"
              />
            </div>
          </div>
        </div>

        {/* Reset / Log out button matching Behance red text */}
        <div className="pt-2 text-center">
          <button
            onClick={onResetData}
            className="text-xs font-semibold text-coral hover:text-coral-hover transition-colors inline-flex items-center gap-1.5"
          >
            <LogOut size={13} />
            <span>Reset Mock Data / Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
