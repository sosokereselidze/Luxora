import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { HiShoppingBag, HiStar } from 'react-icons/hi';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      style: {
        background: '#151525',
        color: '#f8f4ff',
        border: '1px solid rgba(106, 13, 173, 0.2)',
        borderRadius: '12px',
        padding: '16px 24px',
        fontWeight: '600',
        fontSize: '14px',
      },
    });
  };

  return (
    <div className="group relative flex flex-col h-full glass-card overflow-hidden hover:translate-y-[-8px] transition-all duration-700">
      <Link to={`/product/${product._id}`} className="relative block aspect-[3/4] overflow-hidden bg-[#0c0c1a]">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-1000 ease-out"
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070a]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-6">
            <div className="flex items-center gap-1 mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 delay-100">
                {[...Array(5)].map((_, i) => (
                    <HiStar key={i} className="text-[#c9a96e] text-sm" />
                ))}
            </div>
        </div>

        {product.featured && (
          <span className="absolute top-4 right-4 bg-gradient-gold px-3 py-1 rounded-full text-[0.65rem] font-bold text-[#07070a] uppercase tracking-widest shadow-xl">
            Premium
          </span>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-6 relative bg-[#151525]">
        <div className="flex-1">
          <p className="font-luxury text-[#c9a96e] text-[0.7rem] uppercase tracking-[4px] mb-2">{product.brand}</p>
          <Link to={`/product/${product._id}`} className="text-white font-bold text-lg hover:text-[#d4a5ff] transition-colors leading-tight block mb-2">
            {product.name}
          </Link>
          <p className="text-[#8a81ad] text-xs font-medium uppercase tracking-wider mb-4">{product.volume}</p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#6a0dad]/10">
          <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">${product.price.toFixed(2)}</span>
          <button 
            onClick={handleAddToCart}
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#6a0dad]/10 border border-[#6a0dad]/20 text-[#d4a5ff] hover:bg-gradient-primary hover:text-white hover:border-transparent transition-all duration-500 shadow-lg active:scale-95 group/btn"
            title="Add to Bag"
          >
            <HiShoppingBag className="text-xl transform group-hover/btn:scale-110" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
