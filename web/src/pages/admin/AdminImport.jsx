import { useState } from 'react';
import { searchFragrances, importFragrances } from '../../api/fragrances';
import toast from 'react-hot-toast';
import { HiSearch, HiCloudDownload, HiBeaker, HiLibrary, HiCollection, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const AdminImport = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const LIMIT = 12;

  const fetchResults = async (pageNum) => {
    setLoading(true);
    try {
      const { data } = await searchFragrances({ search: query, limit: LIMIT, page: pageNum });
      setResults(data);
      setHasMore(data.length === LIMIT);
      setPage(pageNum);
    } catch (err) {
      if (err.response?.status === 429) {
        toast.error('API Rate Limit Exceeded. Please wait a minute before searching again.', { duration: 5000 });
      } else {
        toast.error('Search failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query) return;
    fetchResults(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1) return;
    fetchResults(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handleImport = async (fragrance) => {
    setImporting(fragrance.id);
    try {
      await importFragrances([fragrance]);
      toast.success(`${fragrance.Name || fragrance.name} imported to shop`);
    } catch (err) {
      toast.error('Import failed');
    } finally {
      setImporting(null);
    }
  };

  const S = {
    card: { background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', padding:'20px', transition:'all 0.3s' },
    input: { width:'100%', padding:'14px 18px 14px 44px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'#f8f4ff', fontSize:'13px', outline:'none', borderRadius:'0' }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-3xl text-white">Fragella API Discovery</h2>
        <p className="text-white/30 text-xs uppercase tracking-widest">Search and import globally recognized fragrances into your collection</p>
      </div>

      {/* Search Header */}
      <div className="bg-bg-card border border-white/5 p-8">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-xl" />
            <input 
              style={S.input}
              placeholder="Search by perfume name, brand, or notes (e.g. 'Tom Ford', 'Oud Wood')..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary px-10"
          >
            {loading ? 'Searching...' : 'Explore API'}
          </button>
        </form>
      </div>

      {/* Results Grid */}
      {results.length > 0 ? (
        <div className="flex flex-col gap-16">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {results.map((f) => (
              <div key={f.id} style={S.card} className="group hover:border-accent-gold/30 hover:bg-white/[0.04] transition-all flex flex-col gap-6">
                <div className="flex gap-6">
                  <div className="w-24 h-24 bg-black/40 border border-white/5 p-2 shrink-0">
                    <img src={f['Image URL'] || f.image} alt={f.Name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex flex-col gap-1 overflow-hidden">
                    <h3 className="text-white font-display text-lg truncate" title={f.Name}>{f.Name}</h3>
                    <p className="text-accent-gold text-[10px] font-bold uppercase tracking-widest">{f.Brand}</p>
                    <p className="text-white/30 text-[10px] flex items-center gap-1.5 mt-1 border-t border-white/5 pt-1.5"><HiCollection /> {f.Gender}</p>
                  </div>
                </div>

                {/* Accords preview */}
                <div className="flex flex-wrap gap-1.5 h-12 overflow-hidden items-start">
                    {f['Main Accords']?.slice(0, 4).map(a => (
                      <span key={a} className="px-2 py-0.5 bg-white/[0.03] text-white/50 text-[8px] font-bold uppercase border border-white/5">{a}</span>
                    ))}
                </div>

                <button 
                  onClick={() => handleImport(f)}
                  disabled={importing === f.id}
                  className={`w-full py-3.5 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${importing === f.id ? 'bg-accent-gold text-black border-accent-gold' : 'bg-transparent text-white/60 border-white/10 hover:border-accent-gold hover:text-white'}`}
                >
                  {importing === f.id ? (
                    <>Importing...</>
                  ) : (
                    <>
                      <HiCloudDownload className="text-sm" /> Import to Shop
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {(page > 1 || hasMore) && (
            <div className="flex items-center justify-center gap-10 pb-16">
              <button
                disabled={page === 1 || loading}
                onClick={() => handlePageChange(page - 1)}
                className="flex items-center gap-3 text-[0.6rem] font-bold uppercase tracking-[0.3em] text-white/50 hover:text-white disabled:opacity-20 transition-all group"
              >
                <HiChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Prev
              </button>
              
              <div className="flex items-center gap-4">
                <span className="text-accent-gold text-[0.65rem] font-bold uppercase tracking-[0.2em] px-4 py-2 border border-accent-gold/20 bg-accent-gold/5">
                  Collection {page}
                </span>
              </div>

              <button
                disabled={!hasMore || loading}
                onClick={() => handlePageChange(page + 1)}
                className="flex items-center gap-3 text-[0.6rem] font-bold uppercase tracking-[0.3em] text-white/50 hover:text-white disabled:opacity-20 transition-all group"
              >
                Next <HiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      ) : (
        !loading && (
          <div className="py-32 flex flex-col items-center justify-center gap-6 border border-white/5 bg-white/[0.01]">
            <HiBeaker className="text-6xl text-white/5" />
            <div className="text-center">
              <p className="text-white/20 text-sm font-light">Enter a query to bridge the Fragella cloud with your local sanctuary.</p>
              <p className="text-[10px] text-white/10 uppercase tracking-[0.4em] mt-2 font-bold">100,000+ Fragrances Available</p>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AdminImport;
