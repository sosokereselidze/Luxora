import { Link } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content container">
        <div className="hero-text-area animate-fade-in-up">
          <span className="hero-subtitle">Premium Fragrance Collection</span>
          <h1 className="hero-title">
            The Essence of <br />
            <span className="text-highlight">Pure Luxury</span>
          </h1>
          <p className="hero-description">
            Discover a curated selection of the world's most exquisite perfumes. 
            From timeless classics to modern masterpieces, find the scent that 
            defines your presence.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="btn btn-primary btn-lg">
              Shop Collection
            </Link>
            <Link to="/shop?featured=true" className="btn btn-outline btn-lg">
              View Featured
            </Link>
          </div>
          
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">50+</span>
              <span className="stat-label">Luxury Brands</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">12k+</span>
              <span className="stat-label">Happy Clients</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">24h</span>
              <span className="stat-label">Express Delivery</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="hero-scroll-indicator">
        <div className="mouse">
          <div className="wheel"></div>
        </div>
        <span>Scroll Down</span>
      </div>
    </section>
  );
};

export default HeroSection;
