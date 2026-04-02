import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import FragranceCard from '../components/FragranceCard';
import Loading from '../components/Loading';
import { searchFragrances, getSimilarFragrances, getBrandFragrances, searchNotes, searchAccords } from '../api/fragrances';
import { HiSearch, HiX, HiAdjustments, HiSparkles, HiCollection } from 'react-icons/hi';

const FragranceExplorer = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState('search');
  const [selectedFragrance, setSelectedFragrance] = useState(null);
  const [similarTo, setSimilarTo] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('q');

  useEffect(() => {
    if (initialSearch) {
      setSearch(initialSearch);
      handleSearch(initialSearch);
    }
  }, [initialSearch]);

  const handleSearch = useCallback(async (query = search) => {
    if (!query || query.length < 3) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    setSelectedFragrance(null);
    setSimilarTo(null);

    try {
      const { data } = await searchFragrances(query, 20);
      setResults(Array.isArray(data) ? data : []);
      setMode('search');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search fragrances');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  const handleSimilar = async (fragrance) => {
    setSelectedFragrance(fragrance);
    setLoading(true);
    setError(null);

    try {
      const { data } = await getSimilarFragrances(fragrance.Name, 10);
      setResults(data.similar_fragrances || []);
      setSimilarTo(data.similar_to || fragrance.Name);
      setMode('similar');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to find similar fragrances');
    } finally {
      setLoading(false);
    }
  };

  const handleBrandSearch = async (brandName) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await getBrandFragrances(brandName, 20);
      setResults(Array.isArray(data) ? data : []);
      setMode('brand');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch brand fragrances');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearch('');
    setResults([]);
    setSelectedFragrance(null);
    setSimilarTo(null);
    setError(null);
  };

  return (
    <div className="bg-bg-dark min-h-screen pt-32 lg:pt-40 animate-fade-in">
      <div className="container mx-auto px-6 pb-24">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-10">
          <div className="flex flex-col gap-4">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white">
              Fragrance <span className="italic font-light text-gradient-purple">Explorer</span>
            </h1>
            <p className="text-text-secondary text-base md:text-lg font-light">
              Discover {similarTo ? `fragrances similar to ${similarTo}` : 'your perfect scent'} from our extensive database
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 bg-white/[0.02] border border-white/10 rounded-none px-6 py-3.5 min-w-[280px] flex-1 md:flex-none relative group focus-within:border-primary/50 transition-colors">
              <HiSearch className="text-primary text-xl" />
              <input
                type="text"
                placeholder="Search fragrances..."
                className="bg-transparent border-none outline-none text-white text-xs uppercase tracking-widest w-full placeholder:text-white/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {search && (
                <HiX className="text-white/30 cursor-pointer hover:text-white" onClick={clearSearch} />
              )}
            </div>

            <button
              onClick={() => handleSearch()}
              disabled={loading || search.length < 3}
              className="btn btn-primary !px-8 !py-3.5 disabled:opacity-50"
            >
              Search
            </button>

            <button
              className={`flex items-center gap-3 px-8 py-3.5 rounded-none font-bold text-[0.6rem] uppercase tracking-[0.3em] transition-all border ${showFilters ? 'bg-primary text-white border-primary' : 'bg-transparent text-white border-white/10 hover:border-white'}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <HiAdjustments /> Filters
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <div className={`overflow-hidden transition-all duration-700 ease-in-out mb-16 ${showFilters ? 'max-h-[500px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'}`}>
          <div className="bg-white/[0.02] border border-white/5 rounded-none p-10 md:p-12 backdrop-blur-3xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
              <div className="flex flex-col gap-6">
                <h5 className="text-white/30 font-bold text-[0.6rem] uppercase tracking-[0.5em]">Browse by Type</h5>
                <div className="flex flex-wrap gap-4">
                  <button
                    className={`flex items-center gap-2 px-8 py-2.5 rounded-none text-[0.6rem] font-bold uppercase tracking-[0.3em] transition-all border ${mode === 'search' ? 'bg-white text-black border-white' : 'bg-transparent text-white/50 border-white/10 hover:border-white hover:text-white'}`}
                    onClick={() => { setMode('search'); handleSearch(); }}
                  >
                    <HiSearch /> Search
                  </button>
                  <button
                    className={`flex items-center gap-2 px-8 py-2.5 rounded-none text-[0.6rem] font-bold uppercase tracking-[0.3em] transition-all border ${mode === 'similar' ? 'bg-white text-black border-white' : 'bg-transparent text-white/50 border-white/10 hover:border-white hover:text-white'}`}
                    onClick={() => setMode('similar')}
                    disabled={!selectedFragrance}
                  >
                    <HiSparkles /> Similar
                  </button>
                </div>
              </div>

              {/* Quick Brand Search */}
              <div className="flex flex-col gap-4">
                <h5 className="text-white/30 font-bold text-[0.6rem] uppercase tracking-[0.5em]">Popular Brands</h5>
                <div className="flex flex-wrap gap-3">
                  {['Dior', 'Chanel', 'Tom Ford', 'Creed', 'Versace'].map(brand => (
                    <button
                      key={brand}
                      className="text-[0.55rem] text-white/40 bg-white/5 border border-white/10 px-4 py-2 uppercase tracking-wider hover:text-accent-gold hover:border-accent-gold/30 transition-all"
                      onClick={() => handleBrandSearch(brand)}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end gap-4">
                <p className="text-text-muted text-[0.65rem] font-bold uppercase tracking-[0.2em]">
                  {results.length} fragrances found
                </p>
                <button
                  className="text-accent-gold text-[0.6rem] font-bold uppercase tracking-[0.3em] hover:text-white transition-all underline underline-offset-8"
                  onClick={clearSearch}
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 p-6 mb-10 text-red-400 text-[0.65rem] uppercase tracking-wider">
            {error}
          </div>
        )}

        {/* Selected Fragrance Detail */}
        {selectedFragrance && (
          <div className="bg-white/[0.02] border border-white/5 p-8 md:p-12 mb-16 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-48 aspect-[3/4] bg-gradient-to-br from-white/5 to-white/[0.02] flex-shrink-0">
                <img
                  src={selectedFragrance['Image URL']}
                  alt={selectedFragrance.Name}
                  className="w-full h-full object-contain p-4"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <div className="flex-1">
                <p className="text-accent-gold/80 text-[0.55rem] uppercase tracking-[0.5em] mb-2">{selectedFragrance.Brand}</p>
                <h3 className="text-white font-display text-2xl md:text-3xl mb-4">{selectedFragrance.Name}</h3>
                <div className="flex flex-wrap gap-3 mb-6">
                  {selectedFragrance['Main Accords']?.slice(0, 5).map((accord, i) => (
                    <span key={i} className="text-[0.5rem] text-white/50 bg-white/5 border border-white/10 px-3 py-1.5 uppercase tracking-wider">
                      {accord}
                    </span>
                  ))}
                </div>
                <div className="flex gap-6 text-text-muted text-[0.6rem] uppercase tracking-wider">
                  {selectedFragrance.Longevity && <span>Longevity: {selectedFragrance.Longevity}</span>}
                  {selectedFragrance.Sillage && <span>Sillage: {selectedFragrance.Sillage}</span>}
                  {selectedFragrance.Gender && <span>Gender: {selectedFragrance.Gender}</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <Loading />
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 animate-fade-in-up">
            {results.map((fragrance, index) => (
              <FragranceCard
                key={fragrance.Name + index}
                fragrance={fragrance}
                onSelect={handleSimilar}
              />
            ))}
          </div>
        ) : search.length >= 3 && !loading ? (
          <div className="bg-white/[0.01] border border-white/5 rounded-none p-24 text-center backdrop-blur-xl flex flex-col items-center gap-8">
            <HiCollection className="text-6xl text-white/10" />
            <h3 className="text-2xl md:text-3xl font-display text-white">No fragrances found</h3>
            <p className="text-text-secondary max-w-md font-light">
              Try a different search term or browse popular brands to discover your perfect scent.
            </p>
            <button className="btn btn-outline" onClick={clearSearch}>Clear Search</button>
          </div>
        ) : (
          <div className="bg-white/[0.01] border border-white/5 rounded-none p-24 text-center backdrop-blur-xl flex flex-col items-center gap-8">
            <HiSparkles className="text-6xl text-accent-gold/30" />
            <h3 className="text-2xl md:text-3xl font-display text-white">Explore Fragrances</h3>
            <p className="text-text-secondary max-w-md font-light">
              Search for any fragrance by name, brand, or click on a card to find similar scents.
              Access our database of over 13,000 fragrances.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FragranceExplorer;
