import { Link } from 'react-router-dom';
import { HiHeart, HiMail, HiPhone } from 'react-icons/hi';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative bg-bg-dark pt-24 pb-12 border-t border-white/5 overflow-hidden mt-auto">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 blur-[100px] rounded-full pointer-events-none opacity-20"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-20">
          {/* Brand */}
          <div className="flex flex-col gap-8">
            <Link to="/" className="flex items-center gap-3 text-white hover:opacity-80 transition-all group w-fit">
              <img 
                src="/Luxora_logo.png" 
                alt="Luxora Logo" 
                className="h-14 object-contain" 
              />
            </Link>
            <p className="text-text-secondary text-[0.8rem] leading-relaxed max-w-[280px] font-light">
              Discover the art of fine fragrance. Curated luxury perfumes
              for the discerning individual. Hand-crafted, globally sourced.
            </p>
            <div className="flex items-center gap-5">
              {[
                { icon: <FaFacebookF />, label: 'Facebook', href: 'https://www.facebook.com/soso.kereselidze.477083/' },
                { icon: <FaInstagram />, label: 'Instagram', href: 'https://www.instagram.com/soso_kereselidze/' },
                { icon: <FaWhatsapp />, label: 'WhatsApp', href: 'https://api.whatsapp.com/send/?phone=995511110822&text&type=phone_number&app_absent=0' }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
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
            <h4 className="text-white/30 font-bold text-[0.6rem] uppercase tracking-[0.4em] mb-10">Quick Links</h4>
            <ul className="flex flex-col gap-4">
              {[
                { to: '/shop', label: 'Shop' },
                { to: '/shop?category=Women', label: 'Pour Femme' },
                { to: '/shop?category=Men', label: 'Pour Homme' },
                { to: '/shop?category=Unisex', label: 'L\'Universel' },
                { to: '/auth', label: 'Login / Register' }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link to={link.to} className="text-text-secondary text-[0.7rem] uppercase tracking-widest font-medium hover:text-white transition-all hover:translate-x-1 inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-white/30 font-bold text-[0.6rem] uppercase tracking-[0.4em] mb-10">Contact Us</h4>
            <ul className="flex flex-col gap-6">
              <li>
                <a
                  href="mailto:soso.kereselidze1@gmail.com"
                  className="flex items-center gap-4 text-text-secondary text-[0.7rem] tracking-wider font-medium hover:text-white transition-all group"
                >
                  <HiMail className="w-4 h-4 text-accent-gold/70 group-hover:text-accent-gold transition-colors" />
                  soso.kereselidze1@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+995511110822"
                  className="flex items-center gap-4 text-text-secondary text-[0.7rem] tracking-wider font-medium hover:text-white transition-all group"
                >
                  <HiPhone className="w-4 h-4 text-accent-gold/70 group-hover:text-accent-gold transition-colors" />
                  +995 511 11 08 22
                </a>
              </li>
              <li>
                <a
                  href="https://api.whatsapp.com/send/?phone=995511110822&text&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-text-secondary text-[0.7rem] uppercase tracking-widest font-medium hover:text-white transition-all group"
                >
                  <FaWhatsapp className="w-4 h-4 text-accent-gold/70 group-hover:text-accent-gold transition-colors" />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/5 pt-10 text-white/20 text-[0.55rem] font-bold uppercase tracking-[0.2em] gap-6">
          <p>© {new Date().getFullYear()} Luxora. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
            <span className="opacity-30">•</span>
            <a href="#" className="hover:text-white/60 transition-colors">Terms of Service</a>
            <span className="opacity-30">•</span>
            <a href="#" className="hover:text-white/60 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
