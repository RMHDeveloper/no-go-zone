
import React, { useState } from 'react';
import { ScriptResponse } from '../types';

interface ResponseCardProps {
  content: ScriptResponse | null;
  isLoading: boolean;
}

const ResponseCard: React.FC<ResponseCardProps> = ({ content, isLoading }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!content?.text) return;
    navigator.clipboard.writeText(content.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 flex flex-col items-center justify-center space-y-4 animate-pulse">
        <div className="h-4 w-3/4 bg-slate-100 rounded"></div>
        <div className="h-4 w-1/2 bg-slate-100 rounded"></div>
        <div className="h-4 w-2/3 bg-slate-100 rounded"></div>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
      <div className="p-5 sm:p-8">
        <div className="relative">
          <p className="text-lg sm:text-2xl text-slate-900 font-medium leading-relaxed whitespace-pre-wrap break-words">
            {content.text}
          </p>
        </div>

        <div className="mt-6 sm:mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Expert Inspiration</span>
            <p className="text-sm font-semibold text-slate-600">
              Inspired by <span className="text-indigo-600">{content.inspiration}</span>
            </p>
          </div>
          
          <button
            onClick={handleCopy}
            className={`
              w-full sm:w-auto px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2
              ${copied 
                ? 'bg-emerald-500 text-white' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'}
            `}
          >
            {copied ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                Copy to Clipboard
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResponseCard;
