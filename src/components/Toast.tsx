import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none select-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />;
      case 'error':
        return <AlertCircle size={16} className="text-coral shrink-0" />;
      default:
        return <Info size={16} className="text-brand-400 shrink-0" />;
    }
  };

  return (
    <div className="pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#1C2237] border border-[#303854] text-white shadow-2xl text-xs font-poppins animate-slideUp">
      {getIcon()}
      <span className="flex-1 font-medium">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-dark-muted hover:text-white p-0.5 rounded transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
};
