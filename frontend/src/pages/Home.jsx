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
    <div className="bg-[#07070a]">
      <HeroSection />

      {/* Featured Products Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#6a0dad]/5 blur-[150px] rounded-full"></div>
        
        <div className="container mx-auto px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/20 mb-4">
                <span className="text-[0.6rem] font-bold uppercase tracking-[3px] text-[#c9a96e]">Curated Selection</span>
              </div>
              <h2 className="font-luxury text-5xl md:text-6xl font-bold text-white mb-6 uppercase tracking-tight">
                Featured <span className="italic font-light text-[#c8bdff]">Fragrances</span>
              </h2>
              <p className="text-[#8a81ad] text-lg font-medium">Discover our most coveted scents, handpicked for their unique character and lasting impression.</p>
            </div>
            <Link to="/shop" className="group flex items-center gap-3 text-[#d4a5ff] font-bold uppercase tracking-[3px] text-sm hover:text-white transition-all">
              View All <HiArrowRight className="text-xl group-hover:translate-x-2 transition-transform" />
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
      <section className="py-32 bg-[#0c0c1a] border-y border-[#6a0dad]/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6a0dad]/5 to-transparent"></div>
        <div className="container mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative group animate-fade-in-up">
              <div className="absolute -inset-4 bg-gradient-primary opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-700"></div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl glass-border">
                <img 
                  src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80" 
                  alt="Fragrance Experience" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                />
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <h2 className="font-luxury text-5xl md:text-7xl font-bold text-white leading-[1.1]">
                Crafted by <br />
                <span className="bg-gradient-gold bg-clip-text text-transparent italic font-light">Master Perfumers</span>
              </h2>
              <p className="text-[#c8bdff] text-lg leading-relaxed">
                Every bottle of Luxora is a result of years of research, using only the rarest ingredients sourced from across the globe. Our scents are not just fragrances; they are memories captured in glass.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-4xl font-bold font-luxury text-white mb-1">150+</h4>
                  <p className="text-[#8a81ad] text-xs font-bold uppercase tracking-[2px]">Natural Essences</p>
                </div>
                <div>
                  <h4 className="text-4xl font-bold font-luxury text-white mb-1">48h</h4>
                  <p className="text-[#8a81ad] text-xs font-bold uppercase tracking-[2px]">Sillage Duration</p>
                </div>
              </div>
              <Link to="/shop" className="btn btn-primary w-fit mt-4">Start Your Journey</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Banner */}
      <section className="py-32">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'For Him', img: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80', cat: 'Men' },
              { name: 'For Her', img: 'https://images.unsplash.com/photo-1583467875263-d50dec37a88c?auto=format&fit=crop&q=80', cat: 'Women' },
              { name: 'Unisex', img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80', cat: 'Unisex' }
            ].map((category, idx) => (
              <Link 
                key={idx} 
                to={`/shop?category=${category.cat}`} 
                className="group relative h-[600px] overflow-hidden rounded-3xl glass-border"
              >
                <img 
                  src={category.img} 
                  alt={category.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07070a] via-[#07070a]/20 to-transparent opacity-80"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-end p-12">
                  <h3 className="font-luxury text-4xl font-bold text-white mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">{category.name}</h3>
                  <span className="px-6 py-2 rounded-full border border-white/20 text-white text-[0.7rem] font-bold uppercase tracking-[3px] opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-100 bg-white/5 backdrop-blur-md">
                    Explore More
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
