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
    <nav className={`fixed top-0 left-0 right-0 h-20 z-[1000] transition-all duration-500 ${scrolled ? 'bg-[#07070a]/90 backdrop-blur-[20px] border-b border-[#6a0dad]/20 shadow-glow' : 'bg-transparent'}`}>
      <div className="flex items-center justify-between h-full max-w-[1400px] mx-auto px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 font-luxury text-3xl font-bold tracking-[4px] text-white hover:text-[#d4a5ff] transition-all group">
          <span className="text-2xl animate-float bg-gradient-primary bg-clip-text text-transparent group-hover:scale-110 transition-transform">✦</span>
          <span className="font-luxury">LUXORA</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/" className={`relative flex items-center gap-2 px-5 py-2 text-[#c8bdff] font-semibold text-[0.85rem] tracking-[0.1em] uppercase rounded-full transition-all hover:text-white hover:bg-[#6a0dad]/10 ${isActive('/') ? 'text-white bg-[#6a0dad]/20' : ''}`}>
            Home
          </Link>
          <Link to="/shop" className={`relative flex items-center gap-2 px-5 py-2 text-[#c8bdff] font-semibold text-[0.85rem] tracking-[0.1em] uppercase rounded-full transition-all hover:text-white hover:bg-[#6a0dad]/10 ${isActive('/shop') ? 'text-white bg-[#6a0dad]/20' : ''}`}>
            Shop
          </Link>
          {user && user.role === 'admin' && (
            <Link to="/admin" className={`relative flex items-center gap-2 px-5 py-2 text-[#c8bdff] font-semibold text-[0.85rem] tracking-[0.1em] uppercase rounded-full transition-all hover:text-white hover:bg-[#6a0dad]/10 ${isActive('/admin') ? 'text-white bg-[#6a0dad]/20' : ''}`}>
              <HiCog className="text-lg" /> Admin
            </Link>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative flex items-center justify-center w-11 h-11 rounded-full bg-transparent text-[#c8bdff] text-2xl transition-all hover:text-white hover:bg-[#6a0dad]/20" title="Cart">
            <HiShoppingBag />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] flex items-center justify-center bg-gradient-primary text-white text-[10px] font-bold rounded-full px-1.5 shadow-lg animate-fade-in">{totalItems}</span>
            )}
          </Link>

          {user ? (
            <div className="relative group">
              <button className="flex items-center justify-center w-11 h-11 rounded-full bg-transparent text-[#c8bdff] text-2xl transition-all hover:text-white hover:bg-[#6a0dad]/20" title={user.name}>
                <HiUser />
              </button>
              <div className="absolute top-[calc(100%+12px)] right-0 min-w-[240px] bg-[#151525] border border-[#6a0dad]/20 rounded-2xl shadow-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 -translate-y-4 transition-all duration-500 backdrop-blur-xl">
                <div className="p-5">
                  <p className="font-bold text-[1rem] text-white leading-tight">{user.name}</p>
                  <p className="text-[0.75rem] text-[#8a81ad] mt-1 font-medium">{user.email}</p>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-[#6a0dad]/20 to-transparent"></div>
                <div className="p-2">
                  {user.role === 'admin' && (
                    <Link to="/admin" className="flex items-center gap-3 p-3 text-[#c8bdff] text-sm font-semibold rounded-xl transition-all hover:bg-[#6a0dad]/10 hover:text-white">
                      <HiCog className="text-lg" /> Admin Panel
                    </Link>
                  )}
                  <button onClick={logout} className="flex items-center gap-3 p-3 text-[#c8bdff] text-sm font-semibold rounded-xl transition-all hover:bg-red-500/10 hover:text-red-400 w-full text-left">
                    <HiLogout className="text-lg" /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="hidden md:inline-flex btn btn-primary px-7 py-2 text-[0.8rem] rounded-full uppercase tracking-widest">
              Sign In
            </Link>
          )}

          {/* Mobile Toggle */}
          <button
            className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-[#6a0dad]/10 text-white text-2xl border border-[#6a0dad]/20"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed top-20 left-0 right-0 bg-[#07070a]/95 backdrop-blur-[30px] p-6 flex flex-col gap-2 border-b border-[#6a0dad]/20 transition-all duration-500 ${mobileOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-10 opacity-0 invisible'}`}>
        <Link to="/" className="p-4 text-[#c8bdff] font-bold text-lg rounded-2xl hover:bg-[#6a0dad]/10 hover:text-white">Home</Link>
        <Link to="/shop" className="p-4 text-[#c8bdff] font-bold text-lg rounded-2xl hover:bg-[#6a0dad]/10 hover:text-white">Shop</Link>
        {user && user.role === 'admin' && (
          <Link to="/admin" className="p-4 text-[#c8bdff] font-bold text-lg rounded-2xl hover:bg-[#6a0dad]/10 hover:text-white">Admin Panel</Link>
        )}
        {!user && <Link to="/login" className="btn btn-primary mt-4">Sign In</Link>}
      </div>
    </nav>
  );
};

export default Navbar;
