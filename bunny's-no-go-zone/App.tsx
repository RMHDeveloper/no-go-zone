
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  const [error, setError] = useState<string | null>(null);
  const runControllerRef = useRef<AbortController | null>(null);

  // Determine the effective context being sent to the AI
  const effectiveCategory = searchQuery.trim() || category || '';
  const isReady = Boolean(effectiveCategory && medium && reason && tone);

  // Filter categories based on search (standard behavior)
  const filteredCategories = useMemo(() => {
    return CATEGORIES.filter(cat => 
      cat.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Manual trigger: only runs when the user clicks START (or the top Generate button).
  const updateScript = useCallback(async () => {
    if (!medium || !reason || !tone || !effectiveCategory) return;

    // Cancel any run already in flight before starting a new one.
    runControllerRef.current?.abort();
    const controller = new AbortController();
    runControllerRef.current = controller;

    setIsLoading(true);
    setError(null);
    try {
      const res = await generateNoScript(effectiveCategory, medium, reason, tone, controller.signal);
      if (!controller.signal.aborted) setScript(res);
    } catch (err) {
      if ((err as Error)?.name === "AbortError") return; // superseded by a newer run
      console.error("Error generating script", err);
      setError("Couldn't generate a script right now. Please try again.");
    } finally {
      if (!controller.signal.aborted) setIsLoading(false);
    }
  }, [effectiveCategory, medium, reason, tone]);

  // Inputs changed — drop any stale output so the user re-runs with START.
  useEffect(() => {
    runControllerRef.current?.abort();
    setScript(null);
    setError(null);
    setIsLoading(false);
  }, [effectiveCategory, medium, reason, tone]);

  // Abort any in-flight request on unmount.
  useEffect(() => () => runControllerRef.current?.abort(), []);

  return (
    <div className="min-h-screen overflow-x-hidden pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
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
        <p className="text-base sm:text-lg text-slate-500 font-medium max-w-md mx-auto text-center">
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
              placeholder="Search or type a custom topic…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-w-0 pl-3 pr-2 py-4 bg-transparent outline-none text-slate-900 font-medium placeholder:text-slate-400"
            />
            <button
              onClick={() => isReady && updateScript()}
              disabled={!isReady}
              className="m-1.5 flex-shrink-0 flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 disabled:opacity-40 disabled:hover:bg-indigo-600 transition-all"
            >
              <SparklesIcon className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Generate</span>
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
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-indigo-600">
              <GridIcon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-bold">Popular Categories</span>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="flex items-center gap-1 whitespace-nowrap flex-shrink-0 text-xs font-bold text-indigo-500 hover:text-indigo-700"
            >
              View all categories
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
              <div className="col-span-2 sm:col-span-3 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl">
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
        <section className="space-y-6 bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-slate-500">
              <GlobeIcon className="w-4 h-4" />
              <label className="text-xs font-black uppercase tracking-widest">Platform / Medium</label>
            </div>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
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
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
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
          <div className="flex flex-col gap-5 border-b border-slate-100 pb-5">
            <div className="flex items-start gap-2.5">
              <HeartIcon className="w-5 h-5 text-indigo-500 mt-1 flex-shrink-0" />
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-slate-900 leading-snug">
                  {isReady ? (
                    <>Response for: <span className="text-indigo-600 capitalize">{effectiveCategory}</span></>
                  ) : (
                    'Pick a category, platform, and reason above'
                  )}
                </h2>
                <p className="text-sm text-slate-400">Get a script that fits your situation perfectly.</p>
              </div>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-1.5">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Tone of the script</span>
              <ToneToggle selected={tone} onChange={setTone} />
            </div>
          </div>

          {/* START: generation only runs when the user clicks this */}
          <button
            onClick={() => updateScript()}
            disabled={!isReady || isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-base font-black uppercase tracking-widest bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-40 disabled:hover:bg-indigo-600 disabled:active:scale-100 transition-all"
          >
            <SparklesIcon className="w-5 h-5" />
            {isLoading ? 'Generating…' : script ? 'Regenerate' : 'Start'}
          </button>

          {!isReady && (
            <p className="text-center text-sm text-slate-400 font-medium">
              Select a category, platform, reason, and tone, then press Start.
            </p>
          )}

          {error && (
            <div className="w-full bg-red-50 border border-red-100 rounded-2xl p-4 text-center text-red-600 font-semibold text-sm">
              {error}
            </div>
          )}

          {(isLoading || script) && (
            <ResponseCard content={script} isLoading={isLoading} />
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