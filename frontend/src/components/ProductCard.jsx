import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { HiShoppingBag, HiStar } from 'react-icons/hi';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link to={`/product/${product._id}`} className="group relative flex flex-col bg-gradient-card border border-[rgba(155,89,182,0.15)] rounded-2xl backdrop-blur-[10px] transition-all duration-300 hover:border-[rgba(155,89,182,0.35)] hover:shadow-[0_0_15px_rgba(106,13,173,0.2)] overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-[#16162a]">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
          <button onClick={handleAdd} className="w-full py-3 bg-gradient-primary text-white rounded-full flex items-center justify-center gap-2 font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <HiShoppingBag /> Add to Cart
          </button>
        </div>
        {product.featured && (
          <span className="absolute top-4 left-4 bg-[#c9a96e]/15 text-[#c9a96e] border border-[#c9a96e]/30 px-3 py-1 rounded-full text-[0.75rem] font-bold uppercase tracking-wider">Featured</span>
        )}
        <span className="absolute top-4 right-4 bg-[#6a0dad]/20 text-[#d4a5ff] border border-[#6a0dad]/30 px-3 py-1 rounded-full text-[0.75rem] font-bold uppercase tracking-wider">{product.category}</span>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-[0.8rem] text-[#7a6e8a] uppercase tracking-widest mb-1 italic font-luxury">{product.brand}</p>
        <h3 className="text-lg font-bold text-[#f0e6ff] mb-2 line-clamp-1">{product.name}</h3>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-[#c9a96e] text-sm font-semibold">
            <HiStar className="text-lg" />
            <span>{product.rating}</span>
            <span className="text-[#7a6e8a] font-normal">({product.numReviews})</span>
          </div>
          <p className="text-[0.85rem] text-[#b8a9cc] font-medium">{product.volume}</p>
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-[rgba(155,89,182,0.1)] pt-4">
          <p className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">${product.price.toFixed(2)}</p>
          <button onClick={handleAdd} className="w-10 h-10 rounded-full bg-[#16162a] border border-[rgba(155,89,182,0.15)] flex items-center justify-center text-[#b8a9cc] hover:bg-[#6a0dad] hover:text-white hover:border-[#6a0dad] transition-all shadow-glow-sm" title="Add to cart">
            <HiShoppingBag />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
