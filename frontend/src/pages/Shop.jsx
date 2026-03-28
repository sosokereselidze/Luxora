import { useState, useEffect } from 'react';
import { getProducts } from '../api/products';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { HiSearch, HiFilter, HiX } from 'react-icons/hi';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');
  const featuredParam = queryParams.get('featured');

  useEffect(() => {
    if (categoryParam) setCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { search, category, sort };
        if (featuredParam) params.featured = 'true';
        const { data } = await getProducts(params);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    const debounceFetch = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounceFetch);
  }, [search, category, sort, featuredParam]);

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setSort('newest');
  };

  return (
    <div className="bg-bg-dark min-h-screen pt-32 lg:pt-40 animate-fade-in">
      <div className="container mx-auto px-6 pb-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-10">
          <div className="flex flex-col gap-4">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white">
              The <span className="italic font-light text-gradient-purple">Collection</span>
            </h1>
            <p className="text-text-secondary text-base md:text-lg font-light">Explore our curated signature fragrances</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 bg-white/[0.02] border border-white/10 rounded-none px-6 py-3.5 min-w-[280px] flex-1 md:flex-none relative group focus-within:border-primary/50 transition-colors">
              <HiSearch className="text-primary text-xl" />
              <input 
                type="text" 
                placeholder="Search scents..." 
                className="bg-transparent border-none outline-none text-white text-xs uppercase tracking-widest w-full placeholder:text-white/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && <HiX className="text-white/30 cursor-pointer hover:text-white" onClick={() => setSearch('')} />}
            </div>
            
            <button 
              className={`flex items-center gap-3 px-8 py-3.5 rounded-none font-bold text-[0.6rem] uppercase tracking-[0.3em] transition-all border ${showFilters ? 'bg-primary text-white border-primary' : 'bg-transparent text-white border-white/10 hover:border-white'}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <HiFilter /> Filters
            </button>
            
            <div className="bg-white/[0.02] border border-white/10 rounded-none px-6 py-3.5 min-w-[200px] relative">
              <select 
                className="bg-transparent border-none outline-none text-white text-[0.6rem] font-bold uppercase tracking-[0.3em] w-full cursor-pointer appearance-none"
                value={sort} 
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="newest" className="bg-[#0c0c1a]">Newest First</option>
                <option value="price_asc" className="bg-[#0c0c1a]">Price: Low to High</option>
                <option value="price_desc" className="bg-[#0c0c1a]">Price: High to Low</option>
                <option value="rating" className="bg-[#0c0c1a]">Top Rated</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Filters Panel */}
        <div className={`overflow-hidden transition-all duration-700 ease-in-out mb-16 ${showFilters ? 'max-h-[500px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'}`}>
          <div className="bg-white/[0.02] border border-white/5 rounded-none p-10 md:p-12 backdrop-blur-3xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
              <div className="flex flex-col gap-6">
                <h5 className="text-white/30 font-bold text-[0.6rem] uppercase tracking-[0.5em]">Filter by Category</h5>
                <div className="flex flex-wrap gap-4">
                  {['All', 'Men', 'Women', 'Unisex'].map(cat => (
                    <button 
                      key={cat} 
                      className={`px-8 py-2.5 rounded-none text-[0.6rem] font-bold uppercase tracking-[0.3em] transition-all border ${category === cat ? 'bg-white text-black border-white' : 'bg-transparent text-white/50 border-white/10 hover:border-white hover:text-white'}`}
                      onClick={() => setCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-start md:items-end gap-4">
                <p className="text-text-muted text-[0.65rem] font-bold uppercase tracking-[0.2em]">{products.length} fragrances available</p>
                <button className="text-accent-gold text-[0.6rem] font-bold uppercase tracking-[0.3em] hover:text-white transition-all underline underline-offset-8" onClick={clearFilters}>Reset All</button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 animate-fade-in-up">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white/[0.01] border border-white/5 rounded-none p-24 text-center backdrop-blur-xl flex flex-col items-center gap-8">
            <h3 className="text-2xl md:text-3xl font-display text-white">No fragrances found</h3>
            <p className="text-text-secondary max-w-md font-light">Try adjusting your search or filters to find your perfect signature scent.</p>
            <button className="btn btn-outline" onClick={clearFilters}>Clear All Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
