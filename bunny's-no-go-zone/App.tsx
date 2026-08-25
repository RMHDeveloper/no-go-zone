
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Category, Medium, Reason, Tone, ScriptResponse } from './types';
import { CATEGORIES, MEDIUMS, REASONS } from './constants';
import Chip from './components/Chip';
import ToneToggle from './components/ToneToggle';
import ResponseCard from './components/ResponseCard';
import { generateNoScript } from './services/gemini';

function App() {
  const [category, setCategory] = useState<Category | null>(null);
  const [medium, setMedium] = useState<Medium | null>(null);
  const [reason, setReason] = useState<Reason | null>(null);
  const [tone, setTone] = useState<Tone | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [script, setScript] = useState<ScriptResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Determine the effective context being sent to the AI
  const effectiveCategory = searchQuery.trim() || category || '';
  const isReady = Boolean(effectiveCategory && medium && reason && tone);

  // Filter categories based on search (standard behavior)
  const filteredCategories = useMemo(() => {
    return CATEGORIES.filter(cat => 
      cat.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const updateScript = useCallback(async () => {
    if (!medium || !reason || !tone || !effectiveCategory) return;
    setIsLoading(true);
    try {
      // Use effectiveCategory (either the typed query or the selected chip)
      const res = await generateNoScript(effectiveCategory, medium, reason, tone);
      setScript(res);
    } catch (error) {
      console.error("Error generating script", error);
    } finally {
      setIsLoading(false);
    }
  }, [effectiveCategory, medium, reason, tone]);

  // Only generate once the user has picked a category, medium, reason, and tone
  useEffect(() => {
    if (!isReady) {
      setScript(null);
      return;
    }
    const timer = setTimeout(() => {
      updateScript();
    }, 500); // Add a small debounce for typing

    return () => clearTimeout(timer);
  }, [isReady, effectiveCategory, medium, reason, tone, updateScript]);

  return (
    <div className="min-h-screen pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="py-8 flex flex-col items-center gap-2"> {/* Changed to flex-col and items-center */}
        <img 
          src="https://rabbitmarketinghouse.in/webinar/assets/WhatsApp_Image_2026-01-17_at_11.50.52_AM-removebg-preview.png" 
          alt="Bunny's No-Go Zone Logo" 
          className="h-16 w-16 md:h-20 md:w-20 object-contain flex-shrink-0"
        />
        {/* Removed flex-grow div wrapper */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-center"> {/* Added text-center */}
          Bunny's <span className="text-indigo-600 underline decoration-indigo-200">No-Go</span> Zone
        </h1>
        <p className="text-md sm:text-lg text-slate-500 font-medium max-w-md mx-auto text-center"> {/* Added text-center, kept mx-auto */}
          Curated & AI-generated scripts to protect your time and set boundaries.
        </p>
        {/* Removed invisible placeholder div */}
      </header>

      {/* Main Controls Section */}
      <main className="space-y-8">
        
        {/* Search & Categories */}
        <section className="space-y-4">
          <div className="flex items-center justify-between mb-1">
             <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Search or type custom context</label>
             {searchQuery && (
               <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full animate-pulse">
                 USING CUSTOM SEARCH
               </span>
             )}
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input
              type="text"
              placeholder="Search categories or type custom (e.g. Wedding invitation)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filteredCategories.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                isActive={category === cat && !searchQuery}
                onClick={() => {
                  setCategory(cat);
                  setSearchQuery(''); // Clear search when a specific chip is selected
                }}
              />
            ))}
            {filteredCategories.length === 0 && searchQuery && (
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full">
                <span className="text-sm font-semibold text-indigo-600">Custom: "{searchQuery}"</span>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-indigo-400 hover:text-indigo-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Medium & Reason Selectors */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Platform / Medium</label>
            <div className="flex flex-wrap gap-2">
              {MEDIUMS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMedium(m)}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-bold border transition-all
                    ${medium === m 
                      ? 'bg-slate-900 border-slate-900 text-white' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}
                  `}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Why are you saying no?</label>
            <div className="flex flex-wrap gap-2">
              {REASONS.map((r) => (
                <Chip
                  key={r}
                  label={r}
                  isActive={reason === r}
                  onClick={() => setReason(r)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Tone Selector & Hero Response */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">
              {isReady ? (
                <>Response for: <span className="text-indigo-600 capitalize">{effectiveCategory}</span></>
              ) : (
                <span className="text-slate-400">Pick a category, platform, and reason above</span>
              )}
            </h2>
            <ToneToggle selected={tone} onChange={setTone} />
          </div>

          {isReady ? (
            <ResponseCard content={script} isLoading={isLoading} />
          ) : (
            <div className="w-full bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 font-medium">
              Select a category, platform, reason, and tone to generate your script.
            </div>
          )}
        </section>

      </main>

      {/* Footer Info */}
      <footer className="mt-16 text-center text-slate-400 text-xs space-y-2">
        <p>© {new Date().getFullYear()} Bunny's No-Go Zone. Built for focus, boundaries, and sanity.</p>
        <p>Use {"{{name}}"} and {"{{task}}"} to customize your messages.</p>
        <p className="pt-2 border-t border-slate-100 mt-2">
          Developed by <a href="https://rabbitmarketinghouse.in" target="_blank" rel="noopener noreferrer" className="text-indigo-500 font-semibold hover:underline">Rabbit Marketing House</a>
        </p>
      </footer>
    </div>
  );
}

export default App;