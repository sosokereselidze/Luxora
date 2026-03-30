import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { HiShoppingBag, HiHeart, HiEye, HiStar } from 'react-icons/hi';
import { useState } from 'react';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    setIsAdding(true);

    setTimeout(() => {
      addToCart(product);
      toast.success(`${product.name} added to cart!`, {
        style: {
          background: '#0a0a0f',
          color: '#ffffff',
          border: '1px solid rgba(201, 169, 110, 0.3)',
          borderRadius: '0',
          padding: '16px 24px',
          fontWeight: '400',
          fontSize: '12px',
          letterSpacing: '0.1em',
          fontFamily: 'Montserrat, sans-serif'
        },
      });
      setIsAdding(false);
    }, 300);
  };

  // Generate star rating (random for demo, or use product.rating if available)
  const rating = product.rating || 4.5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div
      className="group relative flex flex-col h-full bg-bg-card border border-white/5 hover:border-accent-gold/20 transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link to={`/product/${product._id}`} className="relative block aspect-[3/4] overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02]">

        {/* Main Image */}
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-contain p-8 transition-all duration-700 ${isHovered ? 'scale-110 brightness-100' : 'scale-100 brightness-90'}`}
        />

        {/* Gradient Overlay on Hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-bg-dark/90 via-transparent to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>

        {/* Premium Badge */}
        {product.featured && (
          <span className="absolute top-4 left-4 text-[0.5rem] font-bold text-black bg-accent-gold uppercase tracking-[0.3em] px-3 py-1.5 shadow-lg">
            Premium
          </span>
        )}

        {/* New Badge */}
        {product.isNew && (
          <span className="absolute top-4 left-4 text-[0.5rem] font-bold text-white bg-primary uppercase tracking-[0.3em] px-3 py-1.5 shadow-lg">
            New
          </span>
        )}

        {/* Quick Action Buttons */}
        <div className={`absolute top-4 right-4 flex flex-col gap-3 transition-all duration-500 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
          <button className="w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/10 hover:bg-accent-gold hover:border-accent-gold hover:text-black text-white transition-all duration-300 group/btn">
            <HiHeart className="w-4 h-4" />
          </button>
          <Link to={`/product/${product._id}`} className="w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/10 hover:bg-primary hover:border-primary hover:text-white text-white transition-all duration-300">
            <HiEye className="w-4 h-4" />
          </Link>
        </div>

        {/* Sale Badge */}
        {product.originalPrice && (
          <span className="absolute bottom-4 left-4 text-[0.5rem] font-bold text-white bg-red-500 uppercase tracking-[0.2em] px-2 py-1">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        )}
      </Link>

      {/* Product Info */}
      <div className={`flex flex-col flex-1 p-6 text-center transition-all duration-500 ${isHovered ? 'bg-white/[0.02]' : 'bg-transparent'}`}>

        {/* Brand */}
        <p className="font-luxury text-accent-gold/80 text-[0.55rem] uppercase tracking-[0.5em] mb-2 group-hover:text-accent-gold transition-colors">
          {product.brand}
        </p>

        {/* Product Name */}
        <Link
          to={`/product/${product._id}`}
          className="text-white font-display text-lg lg:text-xl hover:text-accent-gold transition-colors leading-snug mb-2 line-clamp-1"
        >
          {product.name}
        </Link>

        {/* Volume */}
        <p className="text-text-muted text-[0.6rem] font-medium uppercase tracking-[0.2em] mb-3">
          {product.volume}
        </p>

        {/* Rating */}
        <div className="flex items-center justify-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <HiStar
              key={i}
              className={`w-3 h-3 ${i < fullStars ? 'text-accent-gold fill-accent-gold' : i === fullStars && hasHalfStar ? 'text-accent-gold fill-accent-gold/50' : 'text-white/20'}`}
            />
          ))}
          <span className="text-[0.55rem] text-text-muted ml-1">({rating})</span>
        </div>

        {/* Price Section */}
        <div className="mt-auto">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="text-xl font-display font-semibold text-white">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-text-muted line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Add to Bag Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`relative w-full py-4 flex items-center justify-center gap-3 font-bold text-[0.65rem] uppercase tracking-[0.3em] overflow-hidden transition-all duration-500 ${isAdding
                ? 'bg-accent-gold text-black border border-accent-gold'
                : 'bg-transparent border border-white/20 text-white hover:bg-white hover:text-black hover:border-white'
              }`}
          >
            <span className={`transition-opacity ${isAdding ? 'opacity-0' : 'opacity-100'}`}>
              <HiShoppingBag className="w-4 h-4" />
            </span>
            <span className={isAdding ? 'absolute' : ''}>
              {isAdding ? 'Adding...' : 'Add to Bag'}
            </span>

            {/* Button Shine Effect */}
            <div className={`absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ${isHovered && !isAdding ? 'translate-x-full' : ''}`}></div>
          </button>
        </div>
      </div>

      {/* Bottom Glow Effect on Hover */}
      <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-gold/50 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
    </div>
  );
};

export default ProductCard;
