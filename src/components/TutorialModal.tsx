import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { RocketIllustration, CelebrationIllustration } from './illustrations';
import { sound } from '../utils/sound';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'onboarding' | 'celebration';
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  mode = 'onboarding',
}) => {
  const [slide, setSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: 'Show your achievements',
      description:
        'You should be proud of the goals you have completed. Take a look at your stats, streaks, and show them to your team.',
      tag: 'Tutorial 1 of 3',
    },
    {
      title: 'Organize your tasks easily',
      description:
        'With Planify you can assign categories, dates, priority tags, and reminders to accomplish your daily workflow efficiently.',
      tag: 'Tutorial 2 of 3',
    },
    {
      title: 'Complete your life goal',
      description:
        'Planify helps you systematically achieve your goals by breaking them down into manageable day-to-day milestones.',
      tag: 'Tutorial 3 of 3',
    },
  ];

  const handleNext = () => {
    sound.playClick();
    if (slide < slides.length - 1) {
      setSlide(slide + 1);
    } else {
      onClose();
    }
  };

  const handleTriggerConfetti = () => {
    sound.playCelebration();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#246BFD', '#F67A7A', '#22C55E', '#FFB524', '#A855F7'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-gradient-to-b from-[#18213C] to-[#121624] border border-[#2F3652] rounded-3xl p-6 shadow-2xl space-y-6 text-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top bar with Skip button */}
        <div className="flex justify-end relative z-10">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-dark-muted hover:text-white px-2 py-1 rounded-lg transition-colors"
          >
            Skip
          </button>
        </div>

        {/* Illustration */}
        <div className="flex justify-center items-center py-2 relative z-10">
          {mode === 'celebration' ? (
            <CelebrationIllustration className="w-44 h-44 animate-bounce" />
          ) : (
            <RocketIllustration className="w-44 h-44 transition-transform hover:scale-105 duration-300" />
          )}
        </div>

        {/* Text Content */}
        <div className="space-y-2 relative z-10">
          {mode === 'celebration' ? (
            <>
              <h3 className="font-poppins font-bold text-2xl text-white tracking-tight">
                Very nice!
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed px-4">
                You have completed all scheduled tasks for today. Outstanding work!
              </p>
            </>
          ) : (
            <>
              <span className="text-[10px] uppercase tracking-widest font-bold text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
                {slides[slide].tag}
              </span>
              <h3 className="font-poppins font-bold text-xl text-white tracking-tight pt-1">
                {slides[slide].title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed px-2">
                {slides[slide].description}
              </p>
            </>
          )}
        </div>

        {/* Pagination Dots (Only for Onboarding mode) */}
        {mode === 'onboarding' && (
          <div className="flex justify-center items-center gap-2 relative z-10">
            {slides.map((_, idx) => (
              <span
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  slide === idx ? 'w-6 bg-brand-500' : 'w-2 bg-slate-600'
                }`}
              />
            ))}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 relative z-10">
          {mode === 'celebration' ? (
            <button
              type="button"
              onClick={() => {
                handleTriggerConfetti();
                setTimeout(onClose, 600);
              }}
              className="w-full py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-poppins font-semibold text-sm tracking-wide shadow-glow transition-all active:scale-[0.99]"
            >
              Celebrate 🎉
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="w-full py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-poppins font-semibold text-sm tracking-wide shadow-glow transition-all active:scale-[0.99]"
            >
              {slide === slides.length - 1 ? 'Get Started' : 'Next'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
