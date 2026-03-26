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
        background: '#07070a',
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        padding: '16px 24px',
        fontWeight: '400',
        fontSize: '14px',
        fontFamily: 'Montserrat, sans-serif'
      },
    });
  };

  return (
    <div className="group relative flex flex-col h-full bg-white/[0.02] border border-white/5 rounded-none overflow-hidden hover:-translate-y-2 transition-transform duration-700">
      <Link to={`/product/${product._id}`} className="relative block aspect-[3/4] overflow-hidden bg-black/20">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-[1.5s] ease-out mix-blend-screen"
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-6">
            <div className="flex items-center gap-1 mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 delay-100">
                {[...Array(5)].map((_, i) => (
                    <HiStar key={i} className="text-[#c9a96e] text-xs" />
                ))}
            </div>
        </div>

        {product.featured && (
          <span className="absolute top-4 right-4 bg-[#c9a96e] px-4 py-1.5 text-[0.6rem] font-bold text-black uppercase tracking-[3px]">
            Premium
          </span>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-6 relative bg-transparent border-t border-white/5">
        <div className="flex-1">
          <p className="font-luxury text-[#c9a96e] text-[0.65rem] uppercase tracking-[4px] mb-2">{product.brand}</p>
          <Link to={`/product/${product._id}`} className="text-white font-luxury text-xl hover:text-[#c9a96e] transition-colors leading-tight block mb-2">
            {product.name}
          </Link>
          <p className="text-white/50 text-[0.7rem] font-medium uppercase tracking-widest mb-4">{product.volume}</p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-6">
          <span className="text-lg font-body font-light text-white">${product.price.toFixed(2)}</span>
          <button 
            onClick={handleAddToCart}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-transparent border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-500 group/btn"
            title="Add to Bag"
          >
            <HiShoppingBag className="text-lg transform group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
