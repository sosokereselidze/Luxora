import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center bg-[url('https://images.unsplash.com/photo-1541643600914-78b084683601?w=1600')] bg-cover bg-center bg-fixed overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-hero opacity-85 z-[1]"></div>
      <div className="relative z-[2] text-white flex flex-col justify-center w-full max-w-[1280px] mx-auto px-6">
        <div className="max-w-[700px] animate-fade-in-up">
          <span className="inline-block text-[0.85rem] uppercase tracking-[4px] mb-5 text-[#d4a5ff] font-semibold bg-[#d4a5ff]/10 px-4 py-1.5 rounded-full border border-[#d4a5ff]/20">
            Premium Fragrance Collection
          </span>
          <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold leading-[1.1] mb-[30px] tracking-tight">
            The Essence of <br />
            <span className="block italic font-normal bg-gradient-primary bg-clip-text text-transparent mt-[5px]">Pure Luxury</span>
          </h1>
          <p className="text-base sm:text-lg text-[#b8a9cc] leading-[1.8] mb-10 max-w-[580px]">
            Discover a curated selection of the world's most exquisite perfumes. 
            From timeless classics to modern masterpieces, find the scent that 
            defines your presence.
          </p>
          <div className="flex flex-wrap gap-4 mb-[60px]">
            <Link to="/shop" className="btn btn-primary px-9 py-4 text-[1.05rem]">
              Shop Collection
            </Link>
            <Link to="/shop?featured=true" className="btn btn-outline px-9 py-4 text-[1.05rem]">
              View Featured
            </Link>
          </div>
          
          <div className="hidden sm:flex items-center gap-10">
            <div className="flex flex-col gap-1">
              <span className="font-['Playfair_Display'] text-2xl font-bold text-white">50+</span>
              <span className="text-[0.8rem] text-[#7a6e8a] uppercase tracking-wider">Luxury Brands</span>
            </div>
            <div className="w-px h-10 bg-[rgba(155,89,182,0.15)]"></div>
            <div className="flex flex-col gap-1">
              <span className="font-['Playfair_Display'] text-2xl font-bold text-white">12k+</span>
              <span className="text-[0.8rem] text-[#7a6e8a] uppercase tracking-wider">Happy Clients</span>
            </div>
            <div className="w-px h-10 bg-[rgba(155,89,182,0.15)]"></div>
            <div className="flex flex-col gap-1">
              <span className="font-['Playfair_Display'] text-2xl font-bold text-white">24h</span>
              <span className="text-[0.8rem] text-[#7a6e8a] uppercase tracking-wider">Express Delivery</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-[2] text-[#7a6e8a] text-[0.75rem] uppercase tracking-[2px]">
        <div className="w-[26px] h-[42px] border-2 border-[#7a6e8a] rounded-[14px] relative">
          <div className="w-1 h-2 bg-[#d4a5ff] rounded-[2px] absolute top-2 left-1/2 -translate-x-1/2 animate-[mouseWheel_2s_linear_infinite]"></div>
        </div>
        <span>Scroll Down</span>
      </div>
    </section>
  );
};

export default HeroSection;
