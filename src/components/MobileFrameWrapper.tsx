import React from 'react';
import { Wifi, Battery, Signal, ArrowLeft } from 'lucide-react';

interface MobileFrameWrapperProps {
  isMobilePreview: boolean;
  onClosePreview: () => void;
  children: React.ReactNode;
}

export const MobileFrameWrapper: React.FC<MobileFrameWrapperProps> = ({
  isMobilePreview,
  onClosePreview,
  children,
}) => {
  if (!isMobilePreview) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#0C101D] flex flex-col items-center justify-center p-3 sm:p-6">
      {/* Top control bar */}
      <div className="w-full max-w-sm flex items-center justify-between mb-3 text-xs text-slate-400">
        <span className="font-poppins font-medium text-slate-300">
          Behance Mobile Device Preview
        </span>
        <button
          onClick={onClosePreview}
          className="text-brand-400 hover:text-white transition-colors underline font-medium"
        >
          Exit to Full Desktop
        </button>
      </div>

      {/* Realistic Mobile Phone Mockup Chassis matching Behance Screenshot 8 */}
      <div className="relative w-full max-w-[390px] h-[820px] rounded-[48px] bg-[#141A2E] p-3 shadow-[0_0_60px_rgba(36,107,253,0.3)] border-[6px] border-[#2E3650] overflow-hidden flex flex-col">
        {/* Phone Speaker & Camera Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-[#0E1322] rounded-b-2xl z-50 flex items-center justify-center gap-3">
          <div className="w-10 h-1 rounded-full bg-slate-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#1A233D] border border-slate-700" />
        </div>

        {/* Status Bar */}
        <div className="h-7 w-full flex items-center justify-between px-6 pt-1 text-[11px] font-semibold text-slate-300 z-40 select-none">
          <span>9:41</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Signal size={12} />
            <Wifi size={12} />
            <Battery size={13} className="text-white" />
          </div>
        </div>

        {/* Screen Content Area */}
        <div className="flex-1 w-full overflow-y-auto no-scrollbar relative flex flex-col">
          {children}
        </div>

        {/* iPhone Home Indicator bar */}
        <div className="h-4 w-full flex items-center justify-center shrink-0">
          <div className="w-32 h-1 bg-slate-500 rounded-full" />
        </div>
      </div>
    </div>
  );
};
