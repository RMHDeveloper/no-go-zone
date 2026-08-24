
import React from 'react';

interface ChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Chip: React.FC<ChipProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
        ${isActive 
          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
          : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50'}
      `}
    >
      {label}
    </button>
  );
};

export default Chip;
