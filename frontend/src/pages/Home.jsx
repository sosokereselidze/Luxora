import { useState, useEffect } from 'react';
import { getFeaturedProducts } from '../api/products';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await getFeaturedProducts();
        setFeaturedProducts(data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="home-page">
      <HeroSection />
      
      {/* Featured Section */}
      <section className="section container">
        <div className="section-header">
          <div className="title-wrapper">
            <span className="badge badge-purple">Handpicked Selection</span>
            <h2 className="section-title text-left">Featured Perfumes</h2>
          </div>
          <Link to="/shop" className="view-all-link">
            Shop All <HiArrowRight />
          </Link>
        </div>
        
        {loading ? (
          <Loading />
        ) : (
          <div className="products-grid animate-fade-in-up">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
      
      {/* Experience Section */}
      <section className="experience-section">
        <div className="container experience-grid">
          <div className="experience-content glass-card p-40">
            <h3 className="exp-title">A Tailored Olfactory Experience</h3>
            <p className="exp-text">
              Our master perfumers have spent decades perfecting the art of fragrance. 
              Each bottle in the Luxora collection tells a unique story, blending 
              premium ingredients sourced from around the globe.
            </p>
            <div className="exp-features">
              <div className="exp-feature">
                <span className="feat-number">01</span>
                <div className="feat-text">
                  <h4>Sustainably Sourced</h4>
                  <p>Rare botanicals ethically harvested from Morocco to Tahiti.</p>
                </div>
              </div>
              <div className="exp-feature">
                <span className="feat-number">02</span>
                <div className="feat-text">
                  <h4>Expertly Aged</h4>
                  <p>Each batch matured for 12 months for maximum depth.</p>
                </div>
              </div>
            </div>
            <Link to="/about" className="btn btn-outline">Learn Our Process</Link>
          </div>
          <div className="experience-image-group">
            <div className="img-large-wrapper glass-card">
              <img src="https://images.unsplash.com/photo-1594035910387-fea081ae7aec?w=800" alt="Fragrance aging" className="img-parallax" />
            </div>
            <div className="img-small-wrapper glass-card">
              <img src="https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=400" alt="Perfume bottle close-up" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories / Banner */}
      <section className="banner-section section">
        <div className="container banner-grid">
          <Link to="/shop?category=Women" className="category-banner banner-women glass-card">
            <div className="banner-text">
              <h4>For Her</h4>
              <p>Graceful, Bold, Enchanting</p>
            </div>
          </Link>
          <Link to="/shop?category=Men" className="category-banner banner-men glass-card">
            <div className="banner-text">
              <h4>For Him</h4>
              <p>Confident, Timeless, Intense</p>
            </div>
          </Link>
          <Link to="/shop?category=Unisex" className="category-banner banner-unisex glass-card">
            <div className="banner-text">
              <h4>Gender Neutral</h4>
              <p>Balanced, Artisanal, Unique</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
