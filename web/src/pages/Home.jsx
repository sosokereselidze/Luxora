import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { getStoredFragrances } from '../api/fragrances';
import { HiArrowRight } from 'react-icons/hi';
import FragranceCard from '../components/FragranceCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await getStoredFragrances({ page: 1, limit: 4 });
        setFeaturedProducts(response.fragrances || []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="bg-[#07070a] min-h-screen text-white relative">
      {/* Global subtle texture/gradient for unified scrolling bg */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#1a0a2e]/20 via-[#07070a] to-[#07070a]"></div>

      <div className="relative z-10">
        <HeroSection />

        {/* Philosophy Section */}
        <section className="section-padding relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full -translate-x-1/2 opacity-20"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center border-y border-white/5 py-20 md:py-32">
              <h3 className="font-luxury text-accent-gold text-[0.6rem] md:text-[0.7rem] uppercase tracking-[0.6em] mb-10">Our Philosophy</h3>
              <p className="font-display text-2xl md:text-4xl lg:text-5xl leading-tight md:leading-tight text-white/90 italic font-light">
                "Perfumery is the invisible art of capturing a memory, a moment, and an emotion inside a beautiful vessel. We source only the rarest botanicals to create signatures for the soul."
              </p>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="section-padding relative">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
              <div className="max-w-2xl">
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
                  Featured <span className="italic font-light text-gradient-gold">Collections</span>
                </h2>
                <p className="text-text-secondary font-light text-base md:text-lg">Discover our most coveted scents, handpicked for their unique character and lasting impression.</p>
              </div>
              <Link to="/shop" className="group flex items-center gap-3 text-white uppercase tracking-[0.4em] text-[0.6rem] font-bold hover:text-accent-gold transition-colors pb-2 border-b border-transparent hover:border-accent-gold">
                View All <HiArrowRight className="text-sm group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            {loading ? (
              <Loading />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                {featuredProducts.map(fragrance => (
                  <FragranceCard key={fragrance._id} fragrance={fragrance} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Experience Section */}
        <section className="section-padding bg-white/[0.01]">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div className="relative group animate-fade-in-up">
                <div className="absolute -inset-10 bg-primary/10 blur-[120px] rounded-full opacity-30"></div>
                <div className="relative aspect-[4/5] overflow-hidden rounded-none shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80" 
                    alt="Fragrance Experience" 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2.5s] ease-out brightness-75"
                  />
                  <div className="absolute inset-0 border border-white/10 pointer-events-none"></div>
                </div>
              </div>
              <div className="flex flex-col gap-10">
                <div>
                  <h3 className="font-luxury text-accent-gold text-[0.6rem] uppercase tracking-[0.5em] mb-6">The Craftsmanship</h3>
                  <h2 className="font-display text-4xl md:text-6xl text-white leading-[1.1] mb-8">
                    Masterfully <br />
                    <span className="italic font-light text-white/50">Blended</span>
                  </h2>
                  <p className="text-text-secondary text-base md:text-lg leading-relaxed font-light">
                    Every bottle of Luxora is a result of years of research, using only the rarest ingredients sourced from across the globe. Our scents are meticulously balanced to unfold entirely uniquely on your skin over 48 hours.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-10 py-10 border-y border-white/5">
                  <div>
                    <h4 className="text-4xl md:text-5xl font-display text-white mb-2">150<span className="text-accent-gold">+</span></h4>
                    <p className="text-text-muted text-[0.6rem] font-bold uppercase tracking-[0.3em]">Rare Botanicals</p>
                  </div>
                  <div>
                    <h4 className="text-4xl md:text-5xl font-display text-white mb-2">48<span className="text-accent-gold">h</span></h4>
                    <p className="text-text-muted text-[0.6rem] font-bold uppercase tracking-[0.3em]">Sillage Duration</p>
                  </div>
                </div>
                
                <Link to="/shop" className="btn btn-outline border-white/10 text-white w-full sm:w-fit mt-4">
                  Start Your Journey
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Banner */}
        <section className="section-padding">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
               <h2 className="font-display text-4xl md:text-5xl text-white mb-6">Find Your Signature</h2>
               <div className="w-16 h-[1px] bg-accent-gold mx-auto opacity-50"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Pour Homme', img: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80', cat: 'Men' },
                { name: 'Pour Femme', img: 'https://images.unsplash.com/photo-1583467875263-d50dec37a88c?auto=format&fit=crop&q=80', cat: 'Women' },
                { name: 'L\'Universel', img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80', cat: 'Unisex' }
              ].map((category, idx) => (
                <Link 
                  key={idx} 
                  to={`/shop?category=${category.cat}`} 
                  className="group relative h-[450px] lg:h-[600px] overflow-hidden rounded-none"
                >
                  <img 
                    src={category.img} 
                    alt={category.name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[3s] ease-out brightness-[0.6] group-hover:brightness-[0.8]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-12 overflow-hidden">
                    <h3 className="font-display text-2xl md:text-3xl text-white mb-6 uppercase tracking-[0.4em] transform group-hover:-translate-y-2 transition-transform duration-700">{category.name}</h3>
                    <div className="h-px w-0 bg-white/50 group-hover:w-full transition-all duration-700 mb-6"></div>
                    <span className="text-accent-gold text-[0.6rem] font-bold uppercase tracking-[0.5em] opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                      Explore
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        {/* Newsletter Section */}
        <section className="section-padding relative overflow-hidden border-t border-white/5">
          <div className="absolute inset-0 bg-primary/5 blur-[150px] rounded-full translate-x-1/2 opacity-20"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-accent-gold text-[0.6rem] font-bold uppercase tracking-[0.6em] mb-6 block">The Inner Circle</span>
              <h2 className="font-display text-4xl md:text-5xl text-white mb-8">Join the Luxora Society</h2>
              <p className="text-text-secondary text-base md:text-lg mb-12 font-light leading-relaxed">Subscribe to receive exclusive access to limited editions, private events, and insider news from the world of high perfumery.</p>
              
              <form className="flex flex-col sm:flex-row gap-0 max-w-xl mx-auto group shadow-2xl" onSubmit={(e) => { e.preventDefault(); alert('Subscribed to society!'); }}>
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="input-field border-white/10 bg-white/[0.02] flex-1 !py-5"
                  required
                />
                <button type="submit" className="btn btn-primary !px-12 !py-5">
                  Join
                </button>
              </form>
            </div>
          </div>
        </section>
        
      </div>
    </div>
  );
};

export default Home;
