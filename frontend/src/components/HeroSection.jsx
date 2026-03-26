import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#07070a]">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#6a0dad]/20 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/3 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#4b0082]/15 blur-[120px] rounded-full -translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-[1000px] mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6a0dad]/10 border border-[#6a0dad]/20 mb-8 animate-fade-in opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
            <span className="w-2 h-2 rounded-full bg-[#d4a5ff] animate-pulse"></span>
            <span className="text-[0.7rem] font-bold uppercase tracking-[4px] text-[#d4a5ff]">Spring Collection 2026</span>
          </div>

          <h1 className="font-luxury text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.9] text-white mb-8 animate-fade-in-up opacity-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
            The Essence of <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">Pure Luxury</span>
          </h1>

          <p className="text-[#c8bdff] text-lg md:text-xl font-medium max-w-[650px] mx-auto mb-12 animate-fade-in-up opacity-0 lg:leading-relaxed" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
            Elevate your presence with our meticulously crafted scents, designed for those who command the room. Experience the world's most exclusive fragrance boutique.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up opacity-0" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
            <Link to="/shop" className="btn btn-primary min-w-[200px] text-lg lg:px-12 lg:py-5">
              Explore Collection <HiArrowRight className="text-xl" />
            </Link>
            <Link to="/shop?featured=true" className="btn btn-outline min-w-[200px] text-lg lg:px-12 lg:py-5">
              Our Heritage
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-fade-in opacity-0" style={{ animationDelay: '1200ms', animationFillMode: 'forwards' }}>
        <p className="text-[0.65rem] font-bold uppercase tracking-[4px] text-[#8a81ad] rotate-180 [writing-mode:vertical-lr]">Scroll</p>
        <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-[#6a0dad]/40 to-[#d4a5ff] rounded-full"></div>
      </div>
    </section>
  );
};

export default HeroSection;
