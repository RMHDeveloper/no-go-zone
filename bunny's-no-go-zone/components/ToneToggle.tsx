
import React from 'react';
import { Tone } from '../types';
import { TONES } from '../constants';

interface ToneToggleProps {
  selected: Tone | null;
  onChange: (tone: Tone) => void;
}

const ToneToggle: React.FC<ToneToggleProps> = ({ selected, onChange }) => {
  return (
    <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
      {TONES.map((tone) => (
        <button
          key={tone}
          onClick={() => onChange(tone)}
          className={`
            flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all
            ${selected === tone 
              ? 'bg-white text-indigo-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'}
          `}
        >
          {tone}
        </button>
      ))}
    </div>
  );
};

export default ToneToggle;
