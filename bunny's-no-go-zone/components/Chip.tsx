
import React from 'react';
import { IconProps } from './Icons';

interface ChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon?: React.FC<IconProps>;
  iconColorClass?: string;
  variant?: 'pill' | 'card';
}

const Chip: React.FC<ChipProps> = ({ label, isActive, onClick, icon: Icon, iconColorClass, variant = 'pill' }) => {
  if (variant === 'card') {
    return (
      <button
        onClick={onClick}
        className={`
          flex items-center gap-2 pl-2 pr-4 py-2 rounded-xl border text-sm font-semibold transition-all duration-200
          ${isActive
            ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm'
            : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/40'}
        `}
      >
        {Icon && (
          <span className={`flex items-center justify-center w-7 h-7 rounded-lg ${iconColorClass || 'bg-slate-100 text-slate-500'}`}>
            <Icon className="w-4 h-4" />
          </span>
        )}
        {label}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
        ${isActive
          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
          : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50'}
      `}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </button>
  );
};

export default Chip;
