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
    <nav className={`fixed top-0 left-0 right-0 h-20 z-[1000] transition-all duration-300 ${scrolled ? 'bg-[#0a0a0f]/85 backdrop-blur-[20px] border-b border-[rgba(155,89,182,0.15)] shadow-md' : 'bg-transparent'}`}>
      <div className="flex items-center justify-between h-full max-w-[1280px] mx-auto px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-[10px] font-luxury text-2xl font-bold tracking-[3px] text-[#f0e6ff] hover:text-[#d4a5ff] transition-all group">
          <span className="text-[1.3rem] animate-float bg-gradient-primary bg-clip-text text-transparent group-hover:scale-110 transition-transform">✦</span>
          <span className="font-['Playfair_Display']">LUXORA</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <Link to="/" className={`relative flex items-center gap-[6px] px-[18px] py-2 text-[#b8a9cc] font-medium text-[0.9rem] tracking-[0.5px] uppercase rounded-full transition-all hover:text-[#f0e6ff] hover:bg-[#6a0dad]/10 ${isActive('/') ? 'text-[#f0e6ff] bg-[#6a0dad]/15 after:content-[""] after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-5 after:h-0.5 after:bg-gradient-primary after:rounded-full' : ''}`}>
            Home
          </Link>
          <Link to="/shop" className={`relative flex items-center gap-[6px] px-[18px] py-2 text-[#b8a9cc] font-medium text-[0.9rem] tracking-[0.5px] uppercase rounded-full transition-all hover:text-[#f0e6ff] hover:bg-[#6a0dad]/10 ${isActive('/shop') ? 'text-[#f0e6ff] bg-[#6a0dad]/15 after:content-[""] after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-5 after:h-0.5 after:bg-gradient-primary after:rounded-full' : ''}`}>
            Shop
          </Link>
          {user && user.role === 'admin' && (
            <Link to="/admin" className={`relative flex items-center gap-[6px] px-[18px] py-2 text-[#b8a9cc] font-medium text-[0.9rem] tracking-[0.5px] uppercase rounded-full transition-all hover:text-[#f0e6ff] hover:bg-[#6a0dad]/10 ${isActive('/admin') ? 'text-[#f0e6ff] bg-[#6a0dad]/15' : ''}`}>
              <HiCog /> Admin
            </Link>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Link to="/cart" className="relative flex items-center justify-center w-[42px] h-[42px] rounded-full bg-transparent text-[#b8a9cc] text-xl transition-all hover:text-[#f0e6ff] hover:bg-[#6a0dad]/15" title="Cart">
            <HiShoppingBag />
            {totalItems > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-[#6a0dad] text-white text-[10px] font-bold rounded-full px-[5px] animate-fade-in">{totalItems}</span>
            )}
          </Link>

          {user ? (
            <div className="relative group">
              <button className="flex items-center justify-center w-[42px] h-[42px] rounded-full bg-transparent text-[#b8a9cc] text-xl transition-all hover:text-[#f0e6ff] hover:bg-[#6a0dad]/15" title={user.name}>
                <HiUser />
              </button>
              <div className="absolute top-[calc(100%+8px)] right-0 min-w-[220px] bg-[#1a1a2e] border border-[rgba(155,89,182,0.15)] rounded-xl shadow-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 -translate-y-2 transition-all duration-300">
                <div className="p-4">
                  <p className="font-semibold text-[0.95rem] text-[#f0e6ff]">{user.name}</p>
                  <p className="text-[0.8rem] text-[#7a6e8a] mt-0.5">{user.email}</p>
                </div>
                <div className="h-px bg-[rgba(155,89,182,0.15)]"></div>
                {user.role === 'admin' && (
                  <Link to="/admin" className="flex items-center gap-[10px] p-4 text-[#b8a9cc] text-[0.9rem] transition-all hover:bg-[#6a0dad]/10 hover:text-[#f0e6ff]">
                    <HiCog /> Admin Panel
                  </Link>
                )}
                <button onClick={logout} className="flex items-center gap-[10px] p-4 text-[#b8a9cc] text-[0.9rem] transition-all hover:bg-red-500/10 hover:text-red-400 w-full text-left">
                  <HiLogout /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="hidden md:inline-flex btn btn-primary px-[22px] py-2 text-[0.85rem] rounded-full bg-gradient-button text-white shadow-md hover:shadow-lg transition-all">
              Login
            </Link>
          )}

          {/* Mobile Toggle */}
          <button
            className="md:hidden flex items-center justify-center w-[42px] h-[42px] rounded-lg bg-transparent text-[#f0e6ff] text-2xl"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed top-20 left-0 right-0 bg-[#0a0a0f]/95 backdrop-blur-[20px] p-5 flex flex-col gap-1 border-b border-[rgba(155,89,182,0.15)] transition-all duration-300 z-[999] ${mobileOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-full opacity-0 invisible'}`}>
        <Link to="/" className={`flex items-center gap-2 p-4 text-lg rounded-xl transition-all ${isActive('/') ? 'bg-[#6a0dad]/20 text-[#f0e6ff]' : 'text-[#b8a9cc]'}`}>Home</Link>
        <Link to="/shop" className={`flex items-center gap-2 p-4 text-lg rounded-xl transition-all ${isActive('/shop') ? 'bg-[#6a0dad]/20 text-[#f0e6ff]' : 'text-[#b8a9cc]'}`}>Shop</Link>
        {!user && <Link to="/login" className="flex items-center gap-2 p-4 text-lg text-[#f0e6ff] bg-gradient-primary rounded-xl mt-4 justify-center">Login</Link>}
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-[998]" onClick={() => setMobileOpen(false)} />}
    </nav>
  );
};

export default Navbar;
