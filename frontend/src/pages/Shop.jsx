import { useState, useEffect } from 'react';
import { getProducts } from '../api/products';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { HiSearch, HiFilter, HiX } from 'react-icons/hi';
import './Shop.css';

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
    <div className="shop-page pt-nav">
      <div className="container section">
        <div className="shop-header">
          <div className="shop-title-area">
            <h1 className="section-title text-left">The Collection</h1>
            <p className="section-subtitle text-left m-0">Explore our signature fragrances</p>
          </div>
          
          <div className="shop-actions">
            <div className="search-box glass-card">
              <HiSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Search scents..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && <HiX className="clear-icon" onClick={() => setSearch('')} />}
            </div>
            
            <button 
              className={`btn btn-outline filter-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <HiFilter /> Filters
            </button>
            
            <div className="sort-box glass-card">
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Filters Panel */}
        <div className={`filters-panel glass-card ${showFilters ? 'show' : ''}`}>
          <div className="filter-group">
            <h5>Category</h5>
            <div className="filter-options">
              {['All', 'Men', 'Women', 'Unisex'].map(cat => (
                <button 
                  key={cat} 
                  className={`filter-btn ${category === cat ? 'active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="filter-divider"></div>
          
          <div className="filter-footer">
            <p>{products.length} products found</p>
            <button className="text-btn" onClick={clearFilters}>Reset All</button>
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : products.length > 0 ? (
          <div className="products-grid animate-fade-in-up">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-results glass-card">
            <h3>No perfumes found</h3>
            <p>Try adjusting your search or filters to find what you're looking for.</p>
            <button className="btn btn-primary" onClick={clearFilters}>Clear All Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
