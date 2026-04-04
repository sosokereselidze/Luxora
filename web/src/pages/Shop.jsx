import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import FragranceCard from '../components/FragranceCard';
import Loading from '../components/Loading';
import {
  getStoredFragrances,
  toggleVisibility,
  deleteStoredFragrance,
  getStoredBrands,
  getStoredAccords,
  getStoredNotes
} from '../api/fragrances';
import {
  HiSearch, HiX, HiAdjustments, HiChevronLeft, HiChevronRight,
  HiEye, HiEyeOff, HiTrash, HiSparkles, HiFilter, HiSortDescending,
  HiCurrencyDollar, HiBeaker, HiHashtag
} from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const Shop = () => {
  const { user } = useAuth();
  const isAdmin = user && user.role === 'admin';

  const [fragrances, setFragrances] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtering State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [accord, setAccord] = useState('');
  const [note, setNote] = useState('');
  const [volume, setVolume] = useState('');

  // Data for Filters
  const [brands, setBrands] = useState([]);
  const [accords, setAccords] = useState([]);
  const [notes, setNotes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const fetchFragrances = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        keyword,
        brand,
        category,
        minPrice,
        maxPrice,
        accord,
        note,
        volume,
        admin: isAdmin ? 'true' : 'false'
      };

      const { data } = await getStoredFragrances(params);
      setFragrances(data.fragrances);
      setTotalPages(data.pages);
      setTotalItems(data.total);
    } catch (err) {
      console.error('Failed to fetch fragrances', err);
    } finally {
      setLoading(false);
    }
  }, [page, keyword, brand, category, minPrice, maxPrice, accord, note, volume, isAdmin]);

  const fetchFilterData = async () => {
    try {
      const [brandsRes, accordsRes, notesRes] = await Promise.all([
        getStoredBrands(),
        getStoredAccords(),
        getStoredNotes()
      ]);
      setBrands(brandsRes.data);
      setAccords(accordsRes.data);
      setNotes(notesRes.data);
    } catch (err) {
      console.error('Failed to fetch filter data', err);
    }
  };

  useEffect(() => {
    fetchFragrances();
  }, [fetchFragrances]);

  useEffect(() => {
    fetchFilterData();
  }, []);

  const clearFilters = () => {
    setBrand('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setAccord('');
    setNote('');
    setVolume('');
    setKeyword('');
    setPage(1);
  };

  const handleToggleVisibility = async (e, id) => {
    e.stopPropagation();
    try {
      await toggleVisibility(id);
      toast.success('Visibility updated');
      fetchFragrances();
    } catch (err) {
      toast.error('Failed to update visibility');
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this fragrance?')) return;

    try {
      await deleteStoredFragrance(id);
      toast.success('Fragrance deleted');
      fetchFragrances();
    } catch (err) {
      toast.error('Failed to delete fragrance');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const mapFragranceData = (f) => ({
    ...f,
    Name: f.name,
    Brand: f.brand,
    'Image URL': f.image,
    'Main Accords': f.accords,
    Price: f.price,
    Gender: f.category,
    Longevity: f.topNotes?.length > 0 ? `Top: ${f.topNotes[0]}` : null,
    Sillage: f.baseNotes?.length > 0 ? `Base: ${f.baseNotes[0]}` : null,
  });

  return (
    <div className="bg-bg-dark min-h-screen pt-32 lg:pt-40 animate-fade-in">
      <div className="container mx-auto px-6 pb-24">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-10">
          <div className="flex flex-col gap-4">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white">
              The <span className="italic font-light text-gradient-purple">Collection</span>
            </h1>
            <p className="text-text-secondary text-base md:text-lg font-light max-w-xl">
              Immerse yourself in our curated anthology of rare and precious fragrances.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Search Bar */}
            <div className="flex items-center gap-3 bg-white/[0.02] border border-white/10 rounded-none px-6 py-4 min-w-[280px] flex-1 md:flex-none focus-within:border-primary/50 transition-colors">
              <HiSearch className="text-primary text-xl" />
              <input
                type="text"
                placeholder="Search by name, brand..."
                className="bg-transparent border-none outline-none text-white text-[0.65rem] uppercase tracking-widest w-full placeholder:text-white/20"
                value={keyword}
                onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
              />
              {keyword && <HiX className="text-white/30 cursor-pointer hover:text-white" onClick={() => { setKeyword(''); setPage(1); }} />}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-3 px-10 py-4 font-bold text-[0.6rem] uppercase tracking-[0.4em] transition-all border ${showFilters ? 'bg-primary text-white border-primary' : 'bg-transparent text-white border-white/10 hover:border-white'}`}
            >
              <HiAdjustments className="text-sm" /> Advanced Filters
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <div className={`overflow-hidden transition-all duration-700 ease-in-out mb-16 ${showFilters ? 'max-h-[800px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'}`}>
          <div className="bg-white/[0.01] border border-white/5 backdrop-blur-3xl p-8 lg:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-10">

              {/* Category & Brand */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-white/30 text-[0.55rem] font-bold uppercase tracking-[0.3em] ml-1"><HiFilter /> Category</label>
                  <select
                    className="w-full bg-white/[0.03] border border-white/10 text-white p-3 text-[0.65rem] uppercase tracking-[0.1em] outline-none hover:border-white/30 transition-colors"
                    value={category}
                    onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                  >
                    <option value="" className="bg-bg-dark">All Categories</option>
                    <option value="Men" className="bg-bg-dark">Men</option>
                    <option value="Women" className="bg-bg-dark">Women</option>
                    <option value="Unisex" className="bg-bg-dark">Unisex</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-white/30 text-[0.55rem] font-bold uppercase tracking-[0.3em] ml-1"><HiSortDescending /> Brand</label>
                  <select
                    className="w-full bg-white/[0.03] border border-white/10 text-white p-3 text-[0.65rem] uppercase tracking-[0.1em] outline-none hover:border-white/30 transition-colors"
                    value={brand}
                    onChange={(e) => { setBrand(e.target.value); setPage(1); }}
                  >
                    <option value="" className="bg-bg-dark">All Brands</option>
                    {brands.map(b => <option key={b} value={b} className="bg-bg-dark">{b}</option>)}
                  </select>
                </div>
              </div>

              {/* Olfactory Filters (Accords & Notes) */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-white/30 text-[0.55rem] font-bold uppercase tracking-[0.3em] ml-1"><HiHashtag /> Accord / Chord</label>
                  <select
                    className="w-full bg-white/[0.03] border border-white/10 text-white p-3 text-[0.65rem] uppercase tracking-[0.1em] outline-none hover:border-white/30 transition-colors"
                    value={accord}
                    onChange={(e) => { setAccord(e.target.value); setPage(1); }}
                  >
                    <option value="" className="bg-bg-dark">Main Charateristic</option>
                    {accords.map(a => <option key={a} value={a} className="bg-bg-dark">{a}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-white/30 text-[0.55rem] font-bold uppercase tracking-[0.3em] ml-1"><HiBeaker /> Specific Note</label>
                  <select
                    className="w-full bg-white/[0.03] border border-white/10 text-white p-3 text-[0.65rem] uppercase tracking-[0.1em] outline-none hover:border-white/30 transition-colors"
                    value={note}
                    onChange={(e) => { setNote(e.target.value); setPage(1); }}
                  >
                    <option value="" className="bg-bg-dark">Search by Note</option>
                    {notes.map(n => <option key={n} value={n} className="bg-bg-dark">{n}</option>)}
                  </select>
                </div>
              </div>

              {/* Price & Milligrams */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-white/30 text-[0.55rem] font-bold uppercase tracking-[0.3em] ml-1"><HiCurrencyDollar /> Price Range</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      className="bg-white/[0.03] border border-white/10 text-white p-3 text-[0.65rem] outline-none hover:border-white/30"
                      value={minPrice}
                      onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="bg-white/[0.03] border border-white/10 text-white p-3 text-[0.65rem] outline-none hover:border-white/30"
                      value={maxPrice}
                      onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-white/30 text-[0.55rem] font-bold uppercase tracking-[0.3em] ml-1">Volume (ml)</label>
                  <select
                    className="w-full bg-white/[0.03] border border-white/10 text-white p-3 text-[0.65rem] uppercase tracking-[0.1em] outline-none hover:border-white/30 transition-colors"
                    value={volume}
                    onChange={(e) => { setVolume(e.target.value); setPage(1); }}
                  >
                    <option value="" className="bg-bg-dark">Any Volume</option>
                    <option value="30" className="bg-bg-dark">30ml / 1.0 oz</option>
                    <option value="50" className="bg-bg-dark">50ml / 1.7 oz</option>
                    <option value="75" className="bg-bg-dark">75ml / 2.5 oz</option>
                    <option value="100" className="bg-bg-dark">100ml / 3.4 oz</option>
                    <option value="200" className="bg-bg-dark">200ml / 6.8 oz</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col justify-end gap-4">
                <p className="text-text-muted text-[0.55rem] font-bold tracking-[0.2em] mb-2 uppercase">
                  {totalItems} results for your profile
                </p>
                <button
                  onClick={clearFilters}
                  className="w-full py-4 text-accent-gold border border-accent-gold/20 hover:bg-accent-gold hover:text-black hover:border-accent-gold text-[0.6rem] font-bold uppercase tracking-[0.4em] transition-all"
                >
                  Reset Discovery
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <Loading />
        ) : fragrances.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16 animate-fade-in-up">
              {fragrances.map((f) => (
                <div key={f._id} className="relative group/item">
                  <FragranceCard fragrance={mapFragranceData(f)} />

                  {isAdmin && (
                    <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                      {!f.isVisible && (
                        <span className="bg-red-500 text-white text-[0.5rem] font-bold px-2 py-1 uppercase tracking-tighter self-end mb-2">Hidden</span>
                      )}
                      <div className="flex gap-2">
                        <button onClick={(e) => handleToggleVisibility(e, f._id)} className="w-8 h-8 flex items-center justify-center bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-primary transition-all">
                          {f.isVisible ? <HiEye className="w-3.5 h-3.5" /> : <HiEyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={(e) => handleDelete(e, f._id)} className="w-8 h-8 flex items-center justify-center bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-red-600 transition-all">
                          <HiTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-24 flex items-center justify-center gap-10">
                <button
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                  className="flex items-center gap-3 text-[0.6rem] font-bold uppercase tracking-[0.3em] text-white/50 hover:text-white disabled:opacity-20 transition-all group"
                >
                  <HiChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Prev
                </button>
                <div className="flex items-center gap-6">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => handlePageChange(p)} className={`text-[0.65rem] font-bold w-10 h-10 flex items-center justify-center transition-all ${page === p ? 'text-black bg-white' : 'text-white/40 hover:text-white'}`}>
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  disabled={page === totalPages}
                  onClick={() => handlePageChange(page + 1)}
                  className="flex items-center gap-3 text-[0.6rem] font-bold uppercase tracking-[0.3em] text-white/50 hover:text-white disabled:opacity-20 transition-all group"
                >
                  Next <HiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white/[0.01] border border-white/5 p-32 text-center flex flex-col items-center gap-8 animate-fade-in-up">
            <HiSparkles className="text-6xl text-white/10" />
            <h3 className="text-3xl font-display text-white">No matches found</h3>
            <p className="text-text-secondary max-w-sm font-light text-base">Your specific discovery profile returned no matching fragrances. Try expanding your olfactory requirements.</p>
            <button className="btn btn-outline" onClick={clearFilters}>Reset discovery</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
