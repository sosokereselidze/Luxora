import { Link } from 'react-router-dom';
import { HiHeart } from 'react-icons/hi';
import { FaFacebookF, FaInstagram, FaTwitter, FaPinterestP } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative bg-[#0a0a0f] pt-20 pb-10 border-t border-[rgba(155,89,182,0.1)] overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#6a0dad]/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-[10px] font-luxury text-2xl font-bold tracking-[3px] text-[#f0e6ff] hover:text-[#d4a5ff] transition-all group w-fit">
              <span className="text-[1.3rem] animate-float bg-gradient-primary bg-clip-text text-transparent group-hover:scale-110 transition-transform">✦</span>
              <span className="font-['Playfair_Display']">LUXORA</span>
            </Link>
            <p className="text-[#7a6e8a] text-sm leading-relaxed max-w-[280px]">
              Discover the art of fine fragrance. Curated luxury perfumes 
              for the discerning individual.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: <FaFacebookF />, label: 'Facebook' },
                { icon: <FaInstagram />, label: 'Instagram' },
                { icon: <FaTwitter />, label: 'Twitter' },
                { icon: <FaPinterestP />, label: 'Pinterest' }
              ].map((social, idx) => (
                <a 
                  key={idx}
                  href="#" 
                  className="w-10 h-10 rounded-full bg-[#16162a] border border-[rgba(155,89,182,0.15)] flex items-center justify-center text-[#b8a9cc] hover:bg-[#6a0dad] hover:text-white hover:border-[#6a0dad] transition-all" 
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#f0e6ff] font-bold text-sm uppercase tracking-widest mb-6 border-l-2 border-[#6a0dad] pl-4">Quick Links</h4>
            <ul className="flex flex-col gap-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/shop', label: 'Shop All' },
                { to: '/shop?category=Women', label: 'Women' },
                { to: '/shop?category=Men', label: 'Men' },
                { to: '/shop?category=Unisex', label: 'Unisex' }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link to={link.to} className="text-[#7a6e8a] text-sm hover:text-[#f0e6ff] transition-all hover:translate-x-1 inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[#f0e6ff] font-bold text-sm uppercase tracking-widest mb-6 border-l-2 border-[#6a0dad] pl-4">Company</h4>
            <ul className="flex flex-col gap-3">
              {['About Us', 'Contact', 'Careers', 'Press'].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="text-[#7a6e8a] text-sm hover:text-[#f0e6ff] transition-all hover:translate-x-1 inline-block">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[#f0e6ff] font-bold text-sm uppercase tracking-widest mb-6 border-l-2 border-[#6a0dad] pl-4">Support</h4>
            <ul className="flex flex-col gap-3">
              {['FAQ', 'Shipping', 'Returns', 'Privacy Policy', 'Terms'].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="text-[#7a6e8a] text-sm hover:text-[#f0e6ff] transition-all hover:translate-x-1 inline-block">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-[rgba(155,89,182,0.1)] pt-10 text-[#7a6e8a] text-sm gap-4">
          <p>© {new Date().getFullYear()} Luxora. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <HiHeart className="text-[#6a0dad] animate-pulse" /> for fragrance lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
