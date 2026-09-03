
import React from 'react';
import { Tone } from '../types';
import { TONES, TONE_ICONS } from '../constants';

interface ToneToggleProps {
  selected: Tone | null;
  onChange: (tone: Tone) => void;
}

const ToneToggle: React.FC<ToneToggleProps> = ({ selected, onChange }) => {
  return (
    <div className="flex flex-wrap justify-start sm:justify-end gap-2 w-full sm:w-auto">
      {TONES.map((tone) => {
        const Icon = TONE_ICONS[tone];
        const isActive = selected === tone;
        return (
          <button
            key={tone}
            onClick={() => onChange(tone)}
            className={`
              flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border whitespace-nowrap transition-all
              ${isActive
                ? 'bg-indigo-100 border-indigo-400 text-indigo-700 shadow-sm hover:bg-indigo-200 hover:border-indigo-500 hover:shadow-md'
                : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700'}
            `}
          >
            {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
            {tone}
          </button>
        );
      })}
    </div>
  );
};

export default ToneToggle;
