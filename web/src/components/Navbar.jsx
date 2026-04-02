import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { HiShoppingBag, HiUser, HiMenu, HiX, HiLogout, HiCog } from 'react-icons/hi';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 h-20 md:h-24 z-[1000] transition-all duration-700 ${scrolled ? 'bg-bg-dark/80 backdrop-blur-2xl border-b border-white/5' : 'bg-transparent'}`}>
      <div className="flex items-center justify-between h-full max-w-[1500px] mx-auto px-6 md:px-12">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 text-white hover:opacity-80 transition-all group">
          <img 
            src="/Luxora_logo.png" 
            alt="Luxora Logo" 
            className="h-14 md:h-16 object-contain" 
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2 lg:gap-6">
          <Link to="/" className={`px-4 py-2 text-[0.6rem] font-bold tracking-[0.4em] uppercase transition-all duration-500 hover:text-accent-gold ${isActive('/') ? 'text-accent-gold' : 'text-white/60'}`}>
            Home
          </Link>
          <Link to="/shop" className={`px-4 py-2 text-[0.6rem] font-bold tracking-[0.4em] uppercase transition-all duration-500 hover:text-accent-gold ${isActive('/shop') ? 'text-accent-gold' : 'text-white/60'}`}>
            Shop
          </Link>
          <Link to="/explore" className={`px-4 py-2 text-[0.6rem] font-bold tracking-[0.4em] uppercase transition-all duration-500 hover:text-accent-gold ${isActive('/explore') ? 'text-accent-gold' : 'text-white/60'}`}>
            Explore
          </Link>
          {user && user.role === 'admin' && (
            <Link to="/admin" className={`px-4 py-2 text-[0.6rem] font-bold tracking-[0.4em] uppercase transition-all duration-500 hover:text-accent-gold ${isActive('/admin') ? 'text-accent-gold' : 'text-white/60'}`}>
              Admin
            </Link>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-6">
          <Link to="/cart" className="relative flex items-center justify-center w-10 h-10 text-white transition-all hover:text-accent-gold" title="Bag">
            <HiShoppingBag className="text-xl" />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-[16px] flex items-center justify-center bg-white text-black text-[8px] font-bold rounded-full px-1 shadow-xl animate-fade-in">{totalItems}</span>
            )}
          </Link>

          {user ? (
            <div className="relative group">
              <button className="flex items-center justify-center w-10 h-10 text-white transition-all hover:text-accent-gold" title={user.name}>
                <HiUser className="text-xl" />
              </button>
              <div className="absolute top-[calc(100%+12px)] right-0 min-w-[240px] bg-bg-card border border-white/10 rounded-none shadow-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-4 group-hover:translate-y-0 transition-all duration-700 backdrop-blur-3xl">
                <div className="p-6">
                  <p className="font-bold text-[0.65rem] uppercase tracking-[0.3em] text-accent-gold mb-1">{user.name}</p>
                  <p className="text-[0.6rem] text-white/30 font-medium tracking-widest">{user.email}</p>
                </div>
                <div className="h-px bg-white/5"></div>
                <div className="p-2 flex flex-col gap-1">
                  {user.role === 'admin' && (
                    <Link to="/admin" className="flex items-center gap-3 p-3 text-white/50 text-[0.6rem] uppercase tracking-[0.2em] font-bold transition-all hover:bg-white/[0.03] hover:text-white">
                      <HiCog className="text-sm text-accent-gold" /> Admin Panel
                    </Link>
                  )}
                  <button onClick={logout} className="flex items-center gap-3 p-3 text-red-400/50 text-[0.6rem] uppercase tracking-[0.2em] font-bold transition-all hover:bg-red-500/5 hover:text-red-400 w-full text-left">
                    <HiLogout className="text-sm" /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="hidden md:inline-flex btn btn-outline px-6 py-2.5 !text-[0.6rem]">
              Sign In
            </Link>
          )}

          {/* Mobile Toggle */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 text-white text-xl"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed top-20 left-0 right-0 bg-bg-dark/95 backdrop-blur-3xl p-8 flex flex-col gap-4 border-b border-white/5 transition-all duration-700 ${mobileOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-full opacity-0 invisible'}`}>
        <Link to="/" className="text-white font-bold text-[0.7rem] uppercase tracking-[0.4em] py-4 border-b border-white/5">Home</Link>
        <Link to="/shop" className="text-white font-bold text-[0.7rem] uppercase tracking-[0.4em] py-4 border-b border-white/5">Shop Collection</Link>
        <Link to="/explore" className="text-white font-bold text-[0.7rem] uppercase tracking-[0.4em] py-4 border-b border-white/5">Explore Fragrances</Link>
        {user && user.role === 'admin' && (
          <Link to="/admin" className="text-white font-bold text-[0.7rem] uppercase tracking-[0.4em] py-4 border-b border-white/5">Admin Control</Link>
        )}
        {!user && <Link to="/login" className="btn btn-outline w-full mt-4">Sign In</Link>}
      </div>
    </nav>
  );
};

export default Navbar;
