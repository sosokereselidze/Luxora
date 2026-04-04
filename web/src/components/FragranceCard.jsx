import { useState } from 'react';
import { HiStar, HiHeart, HiEye, HiPlus } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { importFragrances } from '../api/fragrances';
import { toast } from 'react-hot-toast';

const FragranceCard = ({ fragrance, onSelect }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Normalize data keys (handles both external API and internal DB formats)
  const name = fragrance.name || fragrance.Name;
  const brand = fragrance.brand || fragrance.Brand;
  const price = fragrance.price || fragrance.Price;
  const image = fragrance.image || fragrance['Image URL'];
  const rating = parseFloat(fragrance.rating) || 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  const handleImport = async (e) => {
    e.stopPropagation();
    try {
      await importFragrances([fragrance]);
      toast.success(`${fragrance.Name} added to Boutique`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to Boutique');
    }
  };

  const genderColor = {
    men: 'text-blue-400 border-blue-400/30',
    women: 'text-pink-400 border-pink-400/30',
    unisex: 'text-accent-gold border-accent-gold/30'
  };

  const genderKey = fragrance.Gender?.toLowerCase() || 'unisex';

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(fragrance);
    } else {
      // Navigate to product details if no special selection handler (like in the Explorer)
      const targetId = fragrance._id || fragrance.id;
      if (targetId) navigate(`/product/${targetId}`);
    }
  };

  return (
    <div
      className="group relative flex flex-col h-full bg-bg-card border border-white/5 hover:border-accent-gold/20 transition-all duration-500 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative block aspect-[3/4] overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02]">
        {!imgError && image ? (
          <img
            src={image}
            alt={name}
            className={`w-full h-full object-contain p-8 transition-all duration-700 ${isHovered ? 'scale-110 brightness-100' : 'scale-100 brightness-90'}`}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white/20 text-6xl font-display italic">
              {name?.charAt(0) || 'F'}
            </span>
          </div>
        )}

        <div className={`absolute inset-0 bg-gradient-to-t from-bg-dark/90 via-transparent to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>

        {/* Gender Badge */}
        <span className={`absolute top-4 left-4 text-[0.5rem] font-bold uppercase tracking-[0.3em] px-3 py-1.5 border backdrop-blur-md ${genderColor[genderKey] || genderColor.unisex}`}>
          {fragrance.Gender || 'Unisex'}
        </span>

        {/* Oil Type Badge */}
        {fragrance.OilType && (
          <span className="absolute top-4 right-4 text-[0.5rem] font-bold text-white/70 bg-white/10 backdrop-blur-md uppercase tracking-[0.2em] px-3 py-1.5">
            {fragrance.OilType}
          </span>
        )}

        {/* Quick Actions */}
        <div className={`absolute bottom-4 right-4 flex flex-col gap-3 transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {user?.role === 'admin' && (
            <button 
              onClick={handleImport}
              className="w-10 h-10 flex items-center justify-center bg-accent-gold border border-accent-gold text-black hover:bg-white hover:border-white transition-all duration-300"
              title="Add to Boutique"
            >
              <HiPlus className="w-5 h-5" />
            </button>
          )}
          <button className="w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/10 hover:bg-accent-gold hover:border-accent-gold hover:text-black text-white transition-all duration-300">
            <HiHeart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Fragrance Info */}
      <div className={`flex flex-col flex-1 p-6 text-center transition-all duration-500 ${isHovered ? 'bg-white/[0.02]' : 'bg-transparent'}`}>
        {/* Brand */}
        <p className="font-luxury text-accent-gold/80 text-[0.55rem] uppercase tracking-[0.5em] mb-2 group-hover:text-accent-gold transition-colors">
          {brand}
        </p>

        {/* Name */}
        <h3 className="text-white font-display text-lg lg:text-xl leading-snug mb-2 line-clamp-1">
          {name}
        </h3>

        {/* Year & Country */}
        <p className="text-text-muted text-[0.6rem] font-medium uppercase tracking-[0.2em] mb-3">
          {[fragrance.Year, fragrance.Country].filter(Boolean).join(' · ') || 'Fragrance'}
        </p>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center justify-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <HiStar
                key={i}
                className={`w-3 h-3 ${i < fullStars ? 'text-accent-gold fill-accent-gold' : i === fullStars && hasHalfStar ? 'text-accent-gold fill-accent-gold/50' : 'text-white/20'}`}
              />
            ))}
            <span className="text-[0.55rem] text-text-muted ml-1">({rating})</span>
          </div>
        )}

        {/* Main Accords */}
        {fragrance['Main Accords']?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5 mb-4">
            {fragrance['Main Accords'].slice(0, 3).map((accord, i) => (
              <span key={i} className="text-[0.5rem] text-white/40 bg-white/5 px-2 py-1 uppercase tracking-wider">
                {accord}
              </span>
            ))}
          </div>
        )}

        {/* Performance Badges */}
        <div className="flex justify-center gap-3 mb-4">
          {fragrance.Longevity && (
            <span className="text-[0.5rem] text-white/50 bg-white/5 px-2 py-1 uppercase tracking-wider">
              {fragrance.Longevity}
            </span>
          )}
          {fragrance.Sillage && (
            <span className="text-[0.5rem] text-white/50 bg-white/5 px-2 py-1 uppercase tracking-wider">
              {fragrance.Sillage}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mt-auto">
          {price && (
            <span className="text-xl font-display font-semibold text-white">
              ${parseFloat(price).toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Glow Effect */}
      <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-gold/50 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
    </div>
  );
};

export default FragranceCard;
