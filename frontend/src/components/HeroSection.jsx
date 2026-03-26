import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent">
      {/* Subtle Background Lighting - No Flashing/Pulse */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-[#2d1054]/20 blur-[150px] rounded-full translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-[#6a0dad]/10 blur-[120px] rounded-full -translate-x-1/4 translate-y-1/4"></div>
      </div>

      <div className="container mx-auto px-8 relative z-10 pt-20">
        <div className="max-w-[1000px] mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-white/10 mb-10 animate-fade-in backdrop-blur-md bg-white/5" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a96e]"></span>
            <span className="text-[0.65rem] font-bold uppercase tracking-[4px] text-[#c9a96e]">Discover the 2026 Collection</span>
          </div>

          <h1 className="font-luxury text-6xl md:text-8xl lg:text-[10rem] font-bold leading-[1.1] text-white mb-8 animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
            The Essence of <br />
            <span className="italic font-light text-[#c9a96e]">Pure Luxury</span>
          </h1>

          <p className="text-[#c8bdff] text-lg md:text-xl font-body font-light max-w-[650px] mx-auto mb-14 animate-fade-in-up lg:leading-relaxed" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
            Elevate your presence with our meticulously crafted scents. Hand-poured with the world's most exclusive ingredients for those who command the room.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
            <Link to="/shop" className="btn btn-primary min-w-[200px] text-lg lg:px-12 lg:py-4">
              Explore Collection
            </Link>
            <Link to="/shop?featured=true" className="btn btn-outline min-w-[200px] text-lg lg:px-12 lg:py-4 border-white/20 text-white hover:bg-white/10 hover:border-white">
              Our Heritage
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-fade-in" style={{ animationDelay: '1200ms', animationFillMode: 'forwards' }}>
        <p className="text-[0.6rem] font-bold uppercase tracking-[4px] text-white/50 rotate-180 [writing-mode:vertical-lr]">Discover</p>
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
      </div>
    </section>
  );
};

export default HeroSection;
