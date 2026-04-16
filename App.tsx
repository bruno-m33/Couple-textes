
import React, { useState, useEffect, useCallback } from 'react';
import { Brain, Heart, Search, Activity, Sparkles, RefreshCw, BookOpen, Quote, TrendingUp, Copy, Check, X, ExternalLink } from 'lucide-react';
import { fetchLatestNeuroNews } from './services/geminiService';
import { SearchResult, NewsCategory } from './types';
import ArticleCard from './components/ArticleCard';

const categories = [
  { id: 'buzz', name: 'Buzz 2026', icon: <TrendingUp className="w-4 h-4" />, query: 'Top 8 articles scientifiques neurosciences relations humaines buzz 2026' },
  { id: 'all', name: 'Tout', icon: <Activity className="w-4 h-4" />, query: 'neurosciences actualités psychologie relations couple' },
  { id: 'couple', name: 'Couple', icon: <Heart className="w-4 h-4" />, query: 'neuroscience des relations amoureuses attachement' },
  { id: 'neuro', name: 'Neurosciences', icon: <Brain className="w-4 h-4" />, query: 'découvertes neurosciences récentes cerveau' },
  { id: 'psy', name: 'Psychologie', icon: <Sparkles className="w-4 h-4" />, query: 'psychologie cognitive neurosciences comportementales' },
];

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLinksModalOpen, setIsLinksModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyAllLinks = useCallback(() => {
    if (!searchResult?.sources) return;
    const linksText = searchResult.sources
      .map(source => `${source.title}\n${source.uri}`)
      .join('\n\n');
    
    navigator.clipboard.writeText(linksText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [searchResult]);

  const performSearch = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchLatestNeuroNews(query);
      setSearchResult(result);
    } catch (err) {
      setError("Impossible de récupérer les actualités. Vérifiez votre connexion ou l'état de l'API.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    performSearch(activeCategory.query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Brain className="w-6 h-6" />
            </div>
            <h1 className="text-2xl serif-title text-slate-900 hidden sm:block">NeuroRelate</h1>
          </div>

          <nav className="flex items-center gap-1 sm:gap-4 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  activeCategory.id === cat.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}
          </nav>

          <button 
            onClick={() => performSearch(activeCategory.query)}
            disabled={loading}
            className="p-2 text-slate-400 hover:text-indigo-600 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-50 to-transparent pt-12 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-4">
            Veille Intelligence Artificielle
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 leading-tight serif-title">
            Comprendre les liens entre le cerveau et l'amour.
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Découvrez comment les dernières recherches en neurosciences transforment notre compréhension de la psychologie et des relations humaines.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-20 flex-grow w-full">
        {loading && !searchResult ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <Brain className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <p className="text-slate-500 font-medium animate-pulse">Synthèse des dernières recherches en cours...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-2xl mx-auto">
            <Activity className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-red-800 mb-2">Erreur de chargement</h3>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => performSearch(activeCategory.query)}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* AI Summary Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-white font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Synthèse de l'IA : {activeCategory.name}
                  </h3>
                  <span className="text-indigo-100 text-xs bg-indigo-500/30 px-2 py-1 rounded">
                    Temps réel
                  </span>
                </div>
                <div className="p-6 sm:p-8">
                  <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4 whitespace-pre-wrap">
                    {searchResult?.text.split('\n').map((para, i) => (
                      <p key={i} className={para.startsWith('#') ? 'text-xl font-bold text-slate-900 mt-6 mb-2' : ''}>
                        {para.replace(/^#+ /, '')}
                      </p>
                    ))}
                  </div>
                  
                  {searchResult?.sources && searchResult.sources.length > 0 && (
                    <div className="mt-10 pt-8 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Sources Consultées
                        </h4>
                        <button
                          onClick={() => setIsLinksModalOpen(true)}
                          className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Voir tous les liens
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {searchResult.sources.map((source, idx) => (
                          <a
                            key={idx}
                            href={source.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-all max-w-xs truncate"
                          >
                            {source.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar / Recommendations */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Quote className="w-5 h-5 text-indigo-500" />
                Articles Clés
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                {searchResult?.sources?.slice(0, 5).map((source, idx) => (
                  <ArticleCard key={idx} source={source} index={idx} />
                ))}
                
                {(!searchResult?.sources || searchResult.sources.length === 0) && (
                  <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-400">
                    <p>Aucune source individuelle listée pour cette requête.</p>
                  </div>
                )}
              </div>

              {/* Inspiration Widget */}
              <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative">
                <div className="relative z-10">
                  <h4 className="text-indigo-400 font-bold text-sm uppercase mb-2">Le saviez-vous ?</h4>
                  <p className="text-slate-300 text-sm leading-relaxed italic">
                    "L'ocytocine, souvent appelée 'hormone de l'attachement', joue un rôle crucial non seulement dans le lien mère-enfant mais aussi dans la stabilisation des relations de couple à long terme en réduisant le stress amygdalien."
                  </p>
                </div>
                <div className="absolute -bottom-6 -right-6 opacity-20 transform rotate-12">
                  <Brain className="w-32 h-32" />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Links Modal */}
      {isLinksModalOpen && searchResult?.sources && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Tous les liens sources
              </h3>
              <button 
                onClick={() => setIsLinksModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-grow">
              <ul className="space-y-3">
                {searchResult.sources.map((source, idx) => (
                  <li key={idx} className="flex flex-col gap-1 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="font-medium text-slate-800 text-sm">{source.title}</span>
                    <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-xs break-all">
                      {source.uri}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={handleCopyAllLinks}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm"
              >
                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {isCopied ? 'Copié !' : 'Copier tous les liens'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} NeuroRelate. Conçu pour les professionnels et passionnés de neurosciences.
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="#" className="text-slate-400 hover:text-indigo-600 text-xs font-medium">À propos</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 text-xs font-medium">Confidentialité</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 text-xs font-medium">Méthodologie</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
