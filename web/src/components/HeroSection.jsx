import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-bg-dark pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-primary/30 via-primary/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-accent-gold/5 blur-[150px] rounded-full"></div>
        <div className="absolute top-1/4 left-1/4 w-[30%] h-[30%] bg-primary/20 blur-[100px] rounded-full animate-float"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-accent-gold shadow-[0_0_12px_#c9a96e]"></span>
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-accent-gold">
                The 2026 Collection
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.1] text-white mb-8 animate-fade-in-up">
              Discover Your
              <span className="block mt-2">
                <span className="italic font-light text-gradient-gold">Perfect Scent</span>
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-text-secondary text-base md:text-lg font-light max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              Immerse yourself in a world of exquisite fragrances. Each scent tells a story,
              crafted with the rarest ingredients from around the globe.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-10 mb-10 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-display font-bold text-white">50+</div>
                <div className="text-[0.65rem] uppercase tracking-widest text-text-muted">Fragrances</div>
              </div>
              <div className="w-[1px] h-10 bg-white/10"></div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-display font-bold text-white">12K+</div>
                <div className="text-[0.65rem] uppercase tracking-widest text-text-muted">Happy Clients</div>
              </div>
              <div className="w-[1px] h-10 bg-white/10"></div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-display font-bold text-white">4.9</div>
                <div className="text-[0.65rem] uppercase tracking-widest text-text-muted">Rating</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <Link to="/shop" className="btn btn-primary w-full sm:w-auto px-10 py-4 group">
                <span>Shop Now</span>
                <HiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link to="/shop?featured=true" className="btn btn-outline w-full sm:w-auto px-10 py-4">
                View Collection
              </Link>
            </div>
          </div>

          {/* Right Content - Overlapping Perfume Images */}
          <div className="order-1 lg:order-2 relative animate-fade-in">
            {/* Main Image Container */}
            <div className="relative max-w-lg mx-auto">
              {/* Decorative Rings */}
              <div className="absolute inset-0 -m-8">
                <div className="absolute inset-0 border border-accent-gold/20 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-4 border border-accent-gold/10 rounded-full" style={{ animation: 'spin 20s linear infinite' }}></div>
              </div>

              {/* Large Overlapping Perfume Images with Enhanced Styling */}
              <div className="relative w-full h-[500px] md:h-[550px] lg:h-[600px]">
                {/* First perfume - bottom left, larger */}
                <div className="absolute bottom-0 left-0 w-[55%] h-[85%] overflow-hidden rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8),0_0_40px_rgba(201,169,110,0.15)] border border-white/10 z-10">
                  <img
                    src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&h=600&fit=crop&q=85"
                    alt="Luxury Perfume"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Second perfume - top right, larger, overlapping */}
                <div className="absolute top-0 right-0 w-[55%] h-[85%] overflow-hidden rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8),0_0_40px_rgba(106,13,173,0.2)] border border-white/20 z-20 hover:z-30 transition-transform duration-500 hover:scale-[1.02]">
                  <img
                    src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&h=600&fit=crop&q=85"
                    alt="Luxury Perfume"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Subtle glow effect behind images */}
                <div className="absolute bottom-[10%] left-[5%] w-[50%] h-[70%] bg-gradient-to-br from-accent-gold/10 to-transparent blur-3xl rounded-full z-0"></div>
                <div className="absolute top-[10%] right-[5%] w-[50%] h-[70%] bg-gradient-to-bl from-primary/15 to-transparent blur-3xl rounded-full z-0"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-10 border-t border-white/5 animate-fade-in" style={{ animationDelay: '600ms' }}>
          <div className="flex items-center gap-3 text-[0.65rem] text-text-muted">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>100% Authentic</span>
          </div>
          <div className="flex items-center gap-3 text-[0.65rem] text-text-muted">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
            </svg>
            <span>Free Shipping</span>
          </div>
          <div className="flex items-center gap-3 text-[0.65rem] text-text-muted">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            <span>30-Day Returns</span>
          </div>
          <div className="flex items-center gap-3 text-[0.65rem] text-text-muted">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H4z" />
              <path d="M14 9a1 1 0 00-1-1H9a1 1 0 000 2h4a1 1 0 001-1V5a1 1 0 00-1-1h-1" />
            </svg>
            <span>Gift Wrapping</span>
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
