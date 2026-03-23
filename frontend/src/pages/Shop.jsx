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
    <div className="bg-[#0a0a0f] min-h-screen pt-24 animate-fade-in">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8">
          <div className="flex flex-col gap-3">
            <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">The Collection</h1>
            <p className="text-[#7a6e8a] text-lg">Explore our signature fragrances</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 bg-[#16162a] border border-[rgba(155,89,182,0.15)] rounded-full px-5 py-3 min-w-[300px] flex-1 md:flex-none relative">
              <HiSearch className="text-[#6a0dad] text-xl" />
              <input 
                type="text" 
                placeholder="Search scents..." 
                className="bg-transparent border-none outline-none text-[#f0e6ff] text-sm w-full placeholder:text-[#7a6e8a]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && <HiX className="text-[#7a6e8a] cursor-pointer hover:text-[#f0e6ff]" onClick={() => setSearch('')} />}
            </div>
            
            <button 
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all border-2 ${showFilters ? 'bg-[#6a0dad] text-white border-[#6a0dad]' : 'bg-transparent text-[#d4a5ff] border-[#6a0dad] hover:bg-[#6a0dad]/10'}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <HiFilter /> Filters
            </button>
            
            <div className="bg-[#16162a] border border-[rgba(155,89,182,0.15)] rounded-full px-5 py-3 min-w-[200px]">
              <select 
                className="bg-transparent border-none outline-none text-[#f0e6ff] text-sm w-full cursor-pointer appearance-none"
                value={sort} 
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="newest" className="bg-[#1a1a2e]">Newest First</option>
                <option value="price_asc" className="bg-[#1a1a2e]">Price: Low to High</option>
                <option value="price_desc" className="bg-[#1a1a2e]">Price: High to Low</option>
                <option value="rating" className="bg-[#1a1a2e]">Top Rated</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Filters Panel */}
        <div className={`overflow-hidden transition-all duration-500 mb-12 ${showFilters ? 'max-h-[500px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'}`}>
          <div className="bg-gradient-card border border-[rgba(155,89,182,0.15)] rounded-2xl p-8 backdrop-blur-md">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="flex flex-col gap-4">
                <h5 className="text-[#f0e6ff] font-bold text-sm uppercase tracking-widest border-l-2 border-[#6a0dad] pl-4">Category</h5>
                <div className="flex flex-wrap gap-3">
                  {['All', 'Men', 'Women', 'Unisex'].map(cat => (
                    <button 
                      key={cat} 
                      className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border ${category === cat ? 'bg-[#6a0dad] text-white border-[#6a0dad]' : 'bg-[#16162a] text-[#7a6e8a] border-[rgba(155,89,182,0.15)] hover:border-[#6a0dad] hover:text-[#f0e6ff]'}`}
                      onClick={() => setCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center md:items-end gap-3 text-right">
                <p className="text-[#7a6e8a] text-sm font-medium">{products.length} products found</p>
                <button className="text-[#d4a5ff] text-sm font-bold hover:text-[#f0e6ff] transition-all underline underline-offset-4" onClick={clearFilters}>Reset All Filters</button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in-up">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-gradient-card border border-[rgba(155,89,182,0.15)] rounded-2xl p-20 text-center backdrop-blur-md flex flex-col items-center gap-6">
            <h3 className="text-2xl font-bold text-[#f0e6ff]">No perfumes found</h3>
            <p className="text-[#7a6e8a] max-w-md">Try adjusting your search or filters to find what you're looking for.</p>
            <button className="btn btn-primary" onClick={clearFilters}>Clear All Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
