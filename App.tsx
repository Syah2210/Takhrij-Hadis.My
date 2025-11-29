import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ResultsCard } from './components/ResultsCard';
import { ExternalLinks } from './components/ExternalLinks';
import { Search, Sparkles, Loader2, ArrowRight, Users, BookOpenCheck } from 'lucide-react';
import { searchHadith } from './services/geminiService';
import { SearchState } from './types';

const SUGGESTIONS = [
  "Innamal a'malu binniyat",
  "Tuntutlah ilmu sampai ke negeri China",
  "Kebersihan sebahagian dari iman",
  "Syurga di bawah telapak kaki ibu"
];

const App: React.FC = () => {
  const [state, setState] = useState<SearchState>({
    query: '',
    isLoading: false,
    data: null,
    error: null,
    groundingUrls: []
  });

  // Simulated statistics
  const [stats, setStats] = useState({ visitors: 12450, searches: 45200 });

  useEffect(() => {
    // Simulate visitor count increment on load
    const savedVisitors = localStorage.getItem('th_visitor_count');
    const baseVisitors = savedVisitors ? parseInt(savedVisitors) : 12450;
    const newVisitors = baseVisitors + 1;
    
    localStorage.setItem('th_visitor_count', newVisitors.toString());
    
    // Get saved searches
    const savedSearches = localStorage.getItem('th_search_count');
    const baseSearches = savedSearches ? parseInt(savedSearches) : 45200;

    setStats({ visitors: newVisitors, searches: baseSearches });
  }, []);

  const incrementSearchCount = () => {
    const newCount = stats.searches + 1;
    setStats(prev => ({ ...prev, searches: newCount }));
    localStorage.setItem('th_search_count', newCount.toString());
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!state.query.trim()) return;

    setState(prev => ({ ...prev, isLoading: true, error: null, data: null, groundingUrls: [] }));
    incrementSearchCount();

    try {
      const { data, groundingUrls } = await searchHadith(state.query);
      setState(prev => ({ ...prev, isLoading: false, data, groundingUrls }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || "Berlaku ralat semasa pencarian. Sila cuba lagi." 
      }));
    }
  };

  const handleSuggestionClick = (text: string) => {
    // Directly trigger search
    doSearch(text);
  };

  const doSearch = async (text: string) => {
      setState(prev => ({ ...prev, query: text, isLoading: true, error: null, data: null, groundingUrls: [] }));
      incrementSearchCount();
      
      try {
        const { data, groundingUrls } = await searchHadith(text);
        setState(prev => ({ ...prev, isLoading: false, data, groundingUrls }));
      } catch (error: any) {
        setState(prev => ({ 
            ...prev, 
            isLoading: false, 
            error: error.message 
        }));
      }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-grow container max-w-4xl mx-auto px-4 py-8">
        
        {/* Search Section */}
        <div className="mb-8 text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
              Semak Status & Matan Hadis
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Masukkan kata kunci dalam Bahasa Melayu, Arab, atau sebahagian matan hadis untuk semakan pantas.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex justify-center gap-6 text-xs font-medium text-slate-500 pb-2">
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
              <Users size={14} className="text-blue-500" />
              <span>{stats.visitors.toLocaleString()} Pelawat</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
              <BookOpenCheck size={14} className="text-emerald-500" />
              <span>{stats.searches.toLocaleString()} Hadis Dicari</span>
            </div>
          </div>

          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={state.query}
                onChange={(e) => setState(prev => ({ ...prev, query: e.target.value }))}
                placeholder="Contoh: Setiap amalan bermula dengan niat..."
                className="w-full pl-12 pr-14 py-4 rounded-2xl border-2 border-slate-200 shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-lg"
                disabled={state.isLoading}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
              <button
                type="submit"
                disabled={state.isLoading || !state.query.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.isLoading ? <Loader2 className="animate-spin" size={24} /> : <ArrowRight size={24} />}
              </button>
            </div>
          </form>

          {/* Suggestions */}
          {!state.data && !state.isLoading && (
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestionClick(s)}
                  className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:border-emerald-400 hover:text-emerald-700 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading State */}
        {state.isLoading && (
          <div className="max-w-2xl mx-auto text-center py-12 space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-emerald-100 rounded-full animate-spin border-t-emerald-600"></div>
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-600" size={20} />
              </div>
            </div>
            <p className="text-slate-500 animate-pulse">Sedang mencari dan menyemak sumber...</p>
          </div>
        )}

        {/* Error State */}
        {state.error && (
          <div className="max-w-2xl mx-auto bg-red-50 border border-red-100 rounded-xl p-6 text-center text-red-700">
            <p className="font-medium">Maaf, carian tidak berjaya.</p>
            <p className="text-sm opacity-80 mt-1">{state.error}</p>
          </div>
        )}

        {/* Results */}
        {state.data && (
          <div className="max-w-3xl mx-auto animate-fade-in-up">
            <ResultsCard data={state.data} groundingUrls={state.groundingUrls} />
          </div>
        )}

        <ExternalLinks />
      </main>
    </div>
  );
};

export default App;