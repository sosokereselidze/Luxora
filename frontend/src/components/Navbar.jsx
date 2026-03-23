import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { HiShoppingBag, HiUser, HiMenu, HiX, HiLogout, HiCog } from 'react-icons/hi';
import './Navbar.css';

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
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">✦</span>
          <span className="logo-text">LUXORA</span>
        </Link>

        {/* Desktop Navigation */}
        <div className={`navbar-links ${mobileOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/shop" className={`nav-link ${isActive('/shop') ? 'active' : ''}`}>
            Shop
          </Link>
          {user && user.role === 'admin' && (
            <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>
              <HiCog /> Admin
            </Link>
          )}
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          <Link to="/cart" className="nav-icon-btn" title="Cart">
            <HiShoppingBag />
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </Link>

          {user ? (
            <div className="user-menu">
              <button className="nav-icon-btn user-btn" title={user.name}>
                <HiUser />
              </button>
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <p className="dropdown-name">{user.name}</p>
                  <p className="dropdown-email">{user.email}</p>
                </div>
                <div className="dropdown-divider"></div>
                {user.role === 'admin' && (
                  <Link to="/admin" className="dropdown-item">
                    <HiCog /> Admin Panel
                  </Link>
                )}
                <button onClick={logout} className="dropdown-item dropdown-logout">
                  <HiLogout /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm nav-login-btn">
              Login
            </Link>
          )}

          {/* Mobile Toggle */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />}
    </nav>
  );
};

export default Navbar;
