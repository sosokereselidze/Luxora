import { Link } from 'react-router-dom';
import { HiHeart } from 'react-icons/hi';
import { FaFacebookF, FaInstagram, FaTwitter, FaPinterestP } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative bg-bg-dark pt-24 pb-12 border-t border-white/5 overflow-hidden mt-auto">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 blur-[100px] rounded-full pointer-events-none opacity-20"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <div className="flex flex-col gap-8">
            <Link to="/" className="flex items-center gap-4 font-display text-2xl font-medium tracking-[0.2em] text-white hover:text-accent-gold transition-all group w-fit">
              <span className="text-xl animate-float text-accent-gold group-hover:scale-110 transition-transform opacity-70">✦</span>
              <span>LUXORA</span>
            </Link>
            <p className="text-text-secondary text-[0.8rem] leading-relaxed max-w-[280px] font-light">
              Discover the art of fine fragrance. Curated luxury perfumes 
              for the discerning individual. Hand-crafted, globally sourced.
            </p>
            <div className="flex items-center gap-5">
              {[
                { icon: <FaFacebookF />, label: 'Facebook' },
                { icon: <FaInstagram />, label: 'Instagram' },
                { icon: <FaTwitter />, label: 'Twitter' },
                { icon: <FaPinterestP />, label: 'Pinterest' }
              ].map((social, idx) => (
                <a 
                  key={idx}
                  href="#" 
                  className="w-10 h-10 rounded-none bg-white/[0.02] border border-white/10 flex items-center justify-center text-white/30 hover:bg-white hover:text-black hover:border-white transition-all duration-500" 
                  aria-label={social.label}
                >
                  <span className="text-sm">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white/30 font-bold text-[0.6rem] uppercase tracking-[0.4em] mb-10">Shop</h4>
            <ul className="flex flex-col gap-4">
              {[
                { to: '/shop', label: 'All Collections' },
                { to: '/shop?category=Women', label: 'Pour Femme' },
                { to: '/shop?category=Men', label: 'Pour Homme' },
                { to: '/shop?category=Unisex', label: 'L\'Universel' }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link to={link.to} className="text-text-secondary text-[0.7rem] uppercase tracking-widest font-medium hover:text-white transition-all hover:translate-x-1 inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white/30 font-bold text-[0.6rem] uppercase tracking-[0.4em] mb-10">House</h4>
            <ul className="flex flex-col gap-4">
              {['Our Story', 'Craftsmanship', 'Rare Materials', 'Boutiques'].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="text-text-secondary text-[0.7rem] uppercase tracking-widest font-medium hover:text-white transition-all hover:translate-x-1 inline-block">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white/30 font-bold text-[0.6rem] uppercase tracking-[0.4em] mb-10">Client Care</h4>
            <ul className="flex flex-col gap-4">
              {['Contact Us', 'Shipping & Returns', 'FAQ', 'Privacy Policy'].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="text-text-secondary text-[0.7rem] uppercase tracking-widest font-medium hover:text-white transition-all hover:translate-x-1 inline-block">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/5 pt-12 text-white/20 text-[0.55rem] font-bold uppercase tracking-[0.3em] gap-6">
          <p>© {new Date().getFullYear()} Luxora. All rights reserved.</p>
          <p className="flex items-center gap-3">
            Designed with <HiHeart className="text-accent-gold animate-pulse text-xs" /> for the scent obsessed
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
