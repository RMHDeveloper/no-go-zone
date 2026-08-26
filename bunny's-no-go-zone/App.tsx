
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Category, Medium, Reason, Tone, ScriptResponse } from './types';
import {
  CATEGORIES, MEDIUMS, REASONS,
  CATEGORY_ICONS, CATEGORY_COLORS, MEDIUM_ICONS, REASON_ICONS,
} from './constants';
import Chip from './components/Chip';
import ToneToggle from './components/ToneToggle';
import ResponseCard from './components/ResponseCard';
import { generateNoScript } from './services/gemini';
import { SearchIcon, SparklesIcon, GridIcon, ArrowRightIcon, GlobeIcon, HelpCircleIcon, HeartIcon } from './components/Icons';

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
        
        {/* Search & Generate */}
        <section className="space-y-4">
          <div className="relative group flex items-center bg-white border border-slate-200 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
            <div className="pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              <SearchIcon className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="Search categories or type custom (e.g. Wedding invitation)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-2 py-4 bg-transparent outline-none text-slate-900 font-medium placeholder:text-slate-400"
            />
            <button
              onClick={() => isReady && updateScript()}
              disabled={!isReady}
              className="m-1.5 flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 disabled:opacity-40 disabled:hover:bg-indigo-600 transition-all"
            >
              <SparklesIcon className="w-4 h-4" />
              Generate
            </button>
          </div>
          {searchQuery && (
            <span className="inline-block text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full animate-pulse">
              USING CUSTOM SEARCH
            </span>
          )}
        </section>

        {/* Popular Categories */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-600">
              <GridIcon className="w-4 h-4" />
              <span className="text-sm font-bold">Popular Categories</span>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="flex items-center gap-1 text-xs font-bold text-indigo-500 hover:text-indigo-700"
            >
              View all categories
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {filteredCategories.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                variant="card"
                icon={CATEGORY_ICONS[cat]}
                iconColorClass={CATEGORY_COLORS[cat]}
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
        <section className="space-y-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-slate-500">
              <GlobeIcon className="w-4 h-4" />
              <label className="text-xs font-black uppercase tracking-widest">Platform / Medium</label>
            </div>
            <div className="flex flex-wrap gap-2">
              {MEDIUMS.map((m) => (
                <Chip
                  key={m}
                  label={m}
                  variant="pill"
                  icon={MEDIUM_ICONS[m]}
                  isActive={medium === m}
                  onClick={() => setMedium(m)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-slate-500">
              <HelpCircleIcon className="w-4 h-4" />
              <label className="text-xs font-black uppercase tracking-widest">Why are you saying no?</label>
            </div>
            <div className="flex flex-wrap gap-2">
              {REASONS.map((r) => (
                <Chip
                  key={r}
                  label={r}
                  variant="pill"
                  icon={REASON_ICONS[r]}
                  isActive={reason === r}
                  onClick={() => setReason(r)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Tone Selector & Hero Response */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-start gap-2 text-center sm:text-left justify-center sm:justify-start">
              <HeartIcon className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {isReady ? (
                    <>Response for: <span className="text-indigo-600 capitalize">{effectiveCategory}</span></>
                  ) : (
                    'Pick a category, platform, and reason above'
                  )}
                </h2>
                <p className="text-sm text-slate-400">Get a script that fits your situation perfectly.</p>
              </div>
            </div>
            <div className="flex flex-col items-center sm:items-end gap-1.5">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Tone of the script</span>
              <ToneToggle selected={tone} onChange={setTone} />
            </div>
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