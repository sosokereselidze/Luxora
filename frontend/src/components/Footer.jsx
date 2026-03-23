import { Link } from 'react-router-dom';
import { HiHeart } from 'react-icons/hi';
import { FaFacebookF, FaInstagram, FaTwitter, FaPinterestP } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-glow"></div>
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="logo-icon">✦</span>
              <span>LUXORA</span>
            </Link>
            <p className="footer-tagline">
              Discover the art of fine fragrance. Curated luxury perfumes 
              for the discerning individual.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-icon" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#" className="social-icon" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" className="social-icon" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" className="social-icon" aria-label="Pinterest"><FaPinterestP /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shop">Shop All</Link></li>
              <li><Link to="/shop?category=Women">Women</Link></li>
              <li><Link to="/shop?category=Men">Men</Link></li>
              <li><Link to="/shop?category=Unisex">Unisex</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-column">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-column">
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links">
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Shipping</a></li>
              <li><a href="#">Returns</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Luxora. All rights reserved.
          </p>
          <p className="footer-made-with">
            Made with <HiHeart className="heart-icon" /> for fragrance lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
