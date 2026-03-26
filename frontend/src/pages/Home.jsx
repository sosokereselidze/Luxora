import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { getProducts } from '../api/products';
import { HiArrowRight } from 'react-icons/hi';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await getProducts({ featured: 'true' });
        setFeaturedProducts(data.slice(0, 4));
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
        <section className="py-24 md:py-40 relative">
          <div className="container mx-auto px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center border-y border-white/5 py-16">
              <h3 className="font-luxury text-[#c9a96e] text-sm md:text-base uppercase tracking-[8px] mb-8">Our Philosophy</h3>
              <p className="font-luxury text-3xl md:text-5xl leading-relaxed md:leading-[1.5] text-white/90">
                "Perfumery is the invisible art of capturing a memory, a moment, and an emotion inside a beautiful vessel. We source only the rarest botanicals to create signatures for the soul."
              </p>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-24 md:py-32 relative">
          <div className="container mx-auto px-8">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
              <div className="max-w-2xl">
                <h2 className="font-luxury text-5xl md:text-6xl text-white mb-6 tracking-tight">
                  Featured <span className="italic font-light text-[#c9a96e]">Collections</span>
                </h2>
                <p className="text-[#8a81ad] font-light text-lg">Discover our most coveted scents, handpicked for their unique character and lasting impression.</p>
              </div>
              <Link to="/shop" className="group flex items-center gap-3 text-white uppercase tracking-[4px] text-xs font-bold hover:text-[#c9a96e] transition-colors pb-2 border-b border-transparent hover:border-[#c9a96e]">
                View Entire Collection <HiArrowRight className="text-lg group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            {loading ? (
              <Loading />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Experience Section */}
        <section className="py-24 md:py-40 relative">
          <div className="container mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="relative group animate-fade-in-up">
                <div className="absolute -inset-4 bg-[#c9a96e] opacity-5 blur-3xl rounded-full"></div>
                <div className="relative aspect-[3/4] overflow-hidden rounded-md">
                  <img 
                    src="https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80" 
                    alt="Fragrance Experience" 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2s] ease-out brightness-90"
                  />
                  <div className="absolute inset-0 border border-white/5 rounded-md pointer-events-none"></div>
                </div>
              </div>
              <div className="flex flex-col gap-10">
                <div>
                  <h3 className="font-luxury text-[#c9a96e] text-xs uppercase tracking-[5px] mb-6">The Craftsmanship</h3>
                  <h2 className="font-luxury text-5xl md:text-7xl text-white leading-[1.1]">
                    Masterfully <br />
                    <span className="italic font-light text-white/70">Blended</span>
                  </h2>
                </div>
                <p className="text-[#c8bdff] text-lg leading-relaxed font-light">
                  Every bottle of Luxora is a result of years of research, using only the rarest ingredients sourced from across the globe. Our scents are meticulously balanced to unfold entirely uniquely on your skin over 48 hours.
                </p>
                <div className="grid grid-cols-2 gap-12 pt-8 border-t border-white/10">
                  <div>
                    <h4 className="text-5xl font-luxury text-white mb-2">150<span className="text-[#c9a96e]">+</span></h4>
                    <p className="text-[#8a81ad] text-xs font-bold uppercase tracking-[2px]">Rare Botanicals</p>
                  </div>
                  <div>
                    <h4 className="text-5xl font-luxury text-white mb-2">48<span className="text-[#c9a96e]">h</span></h4>
                    <p className="text-[#8a81ad] text-xs font-bold uppercase tracking-[2px]">Sillage Duration</p>
                  </div>
                </div>
                <Link to="/shop" className="btn btn-outline border-white/20 text-white w-fit mt-4 hover:bg-white hover:text-black hover:border-white">
                  Start Your Journey
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Banner */}
        <section className="py-24 md:py-32 mb-10">
          <div className="container mx-auto px-8">
            <div className="text-center mb-16">
               <h2 className="font-luxury text-4xl md:text-5xl text-white mb-6">Find Your Signature</h2>
               <div className="w-12 h-px bg-[#c9a96e] mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Pour Homme', img: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80', cat: 'Men' },
                { name: 'Pour Femme', img: 'https://images.unsplash.com/photo-1583467875263-d50dec37a88c?auto=format&fit=crop&q=80', cat: 'Women' },
                { name: 'L\'Universel', img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80', cat: 'Unisex' }
              ].map((category, idx) => (
                <Link 
                  key={idx} 
                  to={`/shop?category=${category.cat}`} 
                  className="group relative h-[500px] overflow-hidden rounded-md"
                >
                  <img 
                    src={category.img} 
                    alt={category.name} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2s] ease-out brightness-75 group-hover:brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-10">
                    <h3 className="font-luxury text-3xl text-white mb-6 uppercase tracking-widest">{category.name}</h3>
                    <span className="text-[#c9a96e] text-[0.65rem] font-bold uppercase tracking-[4px] pb-1 border-b border-transparent group-hover:border-[#c9a96e] transition-colors">
                      Explore
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        {/* Newsletter Section */}
        <section className="py-32 relative overflow-hidden border-t border-white/5">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80')] bg-cover bg-center bg-fixed opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#07070a] via-[#07070a]/80 to-[#07070a]"></div>
          
          <div className="container mx-auto px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-[#c9a96e] text-xs font-bold uppercase tracking-[6px] mb-4 block">The Inner Circle</span>
              <h2 className="font-luxury text-4xl md:text-5xl text-white mb-6">Join the Luxora Society</h2>
              <p className="text-white/60 text-lg mb-10 font-light">Subscribe to receive exclusive access to limited editions, private events, and insider news from the world of high perfumery.</p>
              
              <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" onSubmit={(e) => { e.preventDefault(); alert('Subscribed to society!'); }}>
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="flex-1 px-6 py-4 bg-transparent border border-white/20 text-white placeholder:text-white/40 focus:border-[#c9a96e] focus:ring-1 focus:ring-[#c9a96e]/30 outline-none transition-all rounded-none"
                  required
                />
                <button type="submit" className="btn btn-outline border-white/20 text-white hover:bg-white hover:text-black uppercase tracking-[3px] text-xs py-4 px-10 rounded-none">
                  Subscribe
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
