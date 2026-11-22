import React, { useState } from 'react';
import { X, ChevronLeft, Check } from 'lucide-react';
import { Category } from '../types/task';
import { sound } from '../utils/sound';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Omit<Category, 'id'>) => void;
  categoryToEdit?: Category | null;
}

const PRESET_COLORS = [
  '#06B6D4', // Cyan
  '#246BFD', // Primary Blue
  '#22C55E', // Green
  '#A855F7', // Purple
  '#F67A7A', // Coral Red
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#6366F1', // Indigo
];

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categoryToEdit,
}) => {
  const [name, setName] = useState(categoryToEdit?.name || '');
  const [selectedColor, setSelectedColor] = useState(categoryToEdit?.color || PRESET_COLORS[1]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    sound.playClick();
    onSave({
      name: name.trim(),
      color: selectedColor,
      gradient: `linear-gradient(135deg, ${selectedColor} 0%, #1E293B 100%)`,
      icon: 'sparkles',
    });
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-[#181D2F] border border-[#2F3652] rounded-3xl p-6 shadow-2xl space-y-5 animate-scaleUp">
        {/* Header matching Behance */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 text-slate-300 hover:text-white"
          >
            <ChevronLeft size={20} />
            <span className="font-poppins font-semibold text-base">
              {categoryToEdit ? 'Edit Category' : 'Add/Edit Category'}
            </span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-dark-muted hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-dark-muted">
              Category name
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sport, Study, Design"
              className="w-full px-4 py-3 rounded-xl bg-[#22273D] border border-[#2F3652] focus:border-brand-500 focus:outline-none text-white text-sm placeholder:text-slate-500 transition-colors"
            />
          </div>

          {/* Color Palette Selector matching Behance Screenshot 4 */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-dark-muted">
              Color
            </label>
            <div className="flex items-center justify-between gap-2 p-2 bg-[#22273D] rounded-xl border border-white/5">
              {PRESET_COLORS.map((col) => {
                const isSelected = selectedColor.toLowerCase() === col.toLowerCase();
                return (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setSelectedColor(col)}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 relative"
                    style={{ backgroundColor: col }}
                  >
                    {isSelected && <Check size={14} className="text-white stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-poppins font-semibold text-sm tracking-wide shadow-glow transition-all active:scale-[0.99]"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
