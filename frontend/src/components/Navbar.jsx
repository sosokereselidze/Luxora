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
    <nav className={`fixed top-0 left-0 right-0 h-24 z-[1000] transition-all duration-500 ${scrolled ? 'bg-[#07070a]/95 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}>
      <div className="flex items-center justify-between h-full max-w-[1400px] mx-auto px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 font-luxury text-3xl font-bold tracking-[6px] text-white hover:text-[#c9a96e] transition-colors group">
          <span className="text-2xl animate-float text-[#c9a96e] group-hover:scale-110 transition-transform">✦</span>
          <span>LUXORA</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <Link to="/" className={`relative flex items-center px-5 py-2 text-white/70 font-body text-[0.7rem] font-bold tracking-[0.15em] uppercase transition-colors hover:text-[#c9a96e] ${isActive('/') ? 'text-[#c9a96e]' : ''}`}>
            Home
          </Link>
          <Link to="/shop" className={`relative flex items-center px-5 py-2 text-white/70 font-body text-[0.7rem] font-bold tracking-[0.15em] uppercase transition-colors hover:text-[#c9a96e] ${isActive('/shop') ? 'text-[#c9a96e]' : ''}`}>
            Shop
          </Link>
          {user && user.role === 'admin' && (
            <Link to="/admin" className={`relative flex items-center px-5 py-2 text-white/70 font-body text-[0.7rem] font-bold tracking-[0.15em] uppercase transition-colors hover:text-[#c9a96e] ${isActive('/admin') ? 'text-[#c9a96e]' : ''}`}>
              <HiCog className="text-lg mr-2" /> Admin
            </Link>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative flex items-center justify-center w-11 h-11 rounded-full bg-transparent text-white text-xl transition-all hover:text-[#c9a96e]" title="Cart">
            <HiShoppingBag />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] flex items-center justify-center bg-[#c9a96e] text-black text-[10px] font-bold rounded-full px-1.5 shadow-lg animate-fade-in">{totalItems}</span>
            )}
          </Link>

          {user ? (
            <div className="relative group">
              <button className="flex items-center justify-center w-11 h-11 rounded-full bg-transparent text-white text-xl transition-all hover:text-[#c9a96e]" title={user.name}>
                <HiUser />
              </button>
              <div className="absolute top-[calc(100%+12px)] right-0 min-w-[240px] bg-[#0c0c1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 -translate-y-4 transition-all duration-500 backdrop-blur-xl">
                <div className="p-5">
                  <p className="font-bold text-[0.9rem] uppercase tracking-widest text-[#c9a96e] leading-tight">{user.name}</p>
                  <p className="text-[0.7rem] text-white/50 mt-1 font-medium">{user.email}</p>
                </div>
                <div className="h-px bg-white/5"></div>
                <div className="p-2">
                  {user.role === 'admin' && (
                    <Link to="/admin" className="flex items-center gap-3 p-3 text-white/70 text-xs uppercase tracking-widest font-bold rounded-md transition-all hover:bg-white/5 hover:text-white">
                      <HiCog className="text-lg text-[#c9a96e]" /> Admin Panel
                    </Link>
                  )}
                  <button onClick={logout} className="flex items-center gap-3 p-3 text-red-400 text-xs uppercase tracking-widest font-bold rounded-md transition-all hover:bg-red-500/10 hover:text-red-300 w-full text-left">
                    <HiLogout className="text-lg" /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="hidden md:inline-flex btn btn-outline px-8 py-2.5 text-[0.7rem] uppercase tracking-[3px] border-white/20 text-white hover:bg-white hover:text-black hover:border-white">
              Sign In
            </Link>
          )}

          {/* Mobile Toggle */}
          <button
            className="md:hidden flex items-center justify-center w-11 h-11 rounded-full bg-transparent text-white text-2xl"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed top-24 left-0 right-0 bg-[#07070a]/95 backdrop-blur-[30px] p-6 flex flex-col gap-2 border-b border-white/5 transition-all duration-500 ${mobileOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-10 opacity-0 invisible'}`}>
        <Link to="/" className="p-4 text-white font-bold text-lg uppercase tracking-widest border-b border-white/5 hover:text-[#c9a96e]">Home</Link>
        <Link to="/shop" className="p-4 text-white font-bold text-lg uppercase tracking-widest border-b border-white/5 hover:text-[#c9a96e]">Shop</Link>
        {user && user.role === 'admin' && (
          <Link to="/admin" className="p-4 text-white font-bold text-lg uppercase tracking-widest border-b border-white/5 hover:text-[#c9a96e]">Admin Panel</Link>
        )}
        {!user && <Link to="/login" className="btn btn-outline border-white/20 text-white mt-4 uppercase tracking-[3px]">Sign In</Link>}
      </div>
    </nav>
  );
};

export default Navbar;
