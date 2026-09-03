
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
          w-full flex items-center gap-2 pl-2 pr-3 py-2 rounded-xl border text-sm font-semibold text-left transition-all duration-200
          ${isActive
            ? 'bg-indigo-100 border-indigo-400 text-indigo-700 shadow-sm hover:bg-indigo-200 hover:border-indigo-500 hover:shadow-md'
            : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700'}
        `}
      >
        {Icon && (
          <span className={`flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0 ${iconColorClass || 'bg-slate-100 text-slate-500'}`}>
            <Icon className="w-4 h-4" />
          </span>
        )}
        <span className="truncate">{label}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`
        w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border
        ${isActive
          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md hover:bg-indigo-700 hover:border-indigo-700 hover:shadow-lg'
          : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700'}
      `}
    >
      {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
      {label}
    </button>
  );
};

export default Chip;
