import { useState, useEffect } from 'react';
import { getFeaturedProducts } from '../api/products';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';

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
    <div className="bg-[#0a0a0f] min-h-screen">
      <HeroSection />
      
      {/* Featured Section */}
      <section className="py-20 container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
          <div className="flex flex-col gap-4">
            <span className="bg-[#6a0dad]/20 text-[#d4a5ff] border border-[#6a0dad]/30 px-3 py-1 rounded-full text-[0.75rem] font-bold uppercase tracking-wider w-fit">Handpicked Selection</span>
            <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">Featured Perfumes</h2>
          </div>
          <Link to="/shop" className="flex items-center gap-2 text-[#d4a5ff] font-semibold hover:gap-4 transition-all group">
            Shop All <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in-up">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
      
      {/* Experience Section */}
      <section className="py-20 bg-[#0d0d14] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6a0dad]/5 blur-[120px] rounded-full"></div>
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="bg-gradient-card border border-[rgba(155,89,182,0.15)] rounded-2xl backdrop-blur-md p-10 md:p-16 hover:border-[rgba(155,89,182,0.3)] transition-all">
            <h3 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-white mb-6">A Tailored Olfactory Experience</h3>
            <p className="text-[#b8a9cc] leading-[1.8] mb-10 text-lg">
              Our master perfumers have spent decades perfecting the art of fragrance. 
              Each bottle in the Luxora collection tells a unique story, blending 
              premium ingredients sourced from around the globe.
            </p>
            <div className="flex flex-col gap-8 mb-10">
              <div className="flex gap-6">
                <span className="text-4xl font-['Playfair_Display'] font-bold text-[#6a0dad]/40">01</span>
                <div>
                  <h4 className="text-[#f0e6ff] font-bold text-lg mb-2">Sustainably Sourced</h4>
                  <p className="text-[#7a6e8a] text-sm">Rare botanicals ethically harvested from Morocco to Tahiti.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <span className="text-4xl font-['Playfair_Display'] font-bold text-[#6a0dad]/40">02</span>
                <div>
                  <h4 className="text-[#f0e6ff] font-bold text-lg mb-2">Expertly Aged</h4>
                  <p className="text-[#7a6e8a] text-sm">Each batch matured for 12 months for maximum depth.</p>
                </div>
              </div>
            </div>
            <Link to="/about" className="btn btn-outline">Learn Our Process</Link>
          </div>
          <div className="relative grid grid-cols-2 gap-6 h-[500px] md:h-[600px]">
            <div className="relative rounded-2xl overflow-hidden group shadow-2xl h-full col-span-1 mt-10">
              <img src="https://images.unsplash.com/photo-1594035910387-fea081ae7aec?w=800" alt="Fragrance aging" className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
            </div>
            <div className="relative rounded-2xl overflow-hidden group shadow-2xl h-[70%] mt-auto mb-10 col-span-1">
              <img src="https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=400" alt="Bottle" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Banner */}
      <section className="py-20 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[250px] md:h-[350px]">
          {[
            { cat: 'Women', title: 'For Her', desc: 'Graceful, Bold, Enchanting', bg: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600' },
            { cat: 'Men', title: 'For Him', desc: 'Confident, Timeless, Intense', bg: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600' },
            { cat: 'Unisex', title: 'Gender Neutral', desc: 'Balanced, Artisanal, Unique', bg: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600' }
          ].map((item, idx) => (
            <Link 
              key={idx} 
              to={`/shop?category=${item.cat}`} 
              className="relative rounded-2xl overflow-hidden group border border-[rgba(155,89,182,0.15)] block h-full"
            >
              <img src={item.bg} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" />
              <div className="absolute inset-0 bg-[#0a0a0f]/60 group-hover:bg-[#0a0a0f]/40 transition-all"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                <h4 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-white mb-2">{item.title}</h4>
                <p className="text-[#b8a9cc] text-sm uppercase tracking-widest">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
