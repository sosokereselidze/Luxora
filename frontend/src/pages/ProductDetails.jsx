import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../api/products';
import { useCart } from '../context/CartContext';
import Loading from '../components/Loading';
import { HiStar, HiShoppingBag, HiShieldCheck, HiTruck, HiClock, HiArrowLeft } from 'react-icons/hi';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getProduct(id);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <Loading fullPage />;
  if (!product) return (
    <div className="container mx-auto px-6 py-32 text-center">
      <h2 className="text-2xl font-bold text-white mb-6">Product not found</h2>
      <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
    </div>
  );

  return (
    <div className="bg-[#0a0a0f] min-h-screen pt-24 animate-fade-in">
      <div className="container mx-auto px-6 py-12">
        <Link to="/shop" className="flex items-center gap-2 text-[#7a6e8a] hover:text-[#f0e6ff] transition-all mb-10 w-fit group">
          <HiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Shop
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Main Image */}
          <div className="flex flex-col gap-6">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-card border border-[rgba(155,89,182,0.15)] flex items-center justify-center p-12 group shadow-2xl">
              <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain transform group-hover:scale-110 transition-transform duration-700" />
              {product.featured && <span className="absolute top-6 left-6 bg-[#c9a96e]/15 text-[#c9a96e] border border-[#c9a96e]/30 px-4 py-1.5 rounded-full text-[0.8rem] font-bold uppercase tracking-widest backdrop-blur-md">Featured Selection</span>}
            </div>
            {/* Thumbnails row */}
            <div className="grid grid-cols-4 gap-4">
              <div className="aspect-square rounded-xl overflow-hidden border-2 border-[#6a0dad] bg-[#16162a] p-2 flex items-center justify-center">
                <img src={product.image} alt="th" className="max-w-full max-h-full object-contain" />
              </div>
              <div className="aspect-square rounded-xl overflow-hidden border border-[rgba(155,89,182,0.15)] bg-[#16162a] p-2 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
                <img src={product.image} alt="th" className="max-w-full max-h-full object-contain" />
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex flex-col h-full">
            <div className="mb-8">
              <p className="text-[#6a0dad] font-bold uppercase tracking-[4px] text-sm mb-3 font-luxury">{product.brand}</p>
              <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-extrabold text-[#f0e6ff] mb-4 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 text-[#c9a96e]">
                  {[...Array(5)].map((_, i) => (
                    <HiStar key={i} className={i < Math.floor(product.rating) ? 'text-xl text-[#c9a96e]' : 'text-xl text-[#c9a96e] opacity-20'} />
                  ))}
                </div>
                <div className="flex items-center gap-3 text-sm text-[#7a6e8a] font-medium border-l border-[rgba(155,89,182,0.15)] pl-6">
                  <span className="text-[#f0e6ff]">{product.rating} / 5.0</span>
                  <span className="opacity-30">•</span>
                  <span>{product.numReviews} Reviews</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6 mb-8">
              <p className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">${product.price.toFixed(2)}</p>
              <span className="bg-[#6a0dad]/20 text-[#d4a5ff] border border-[#6a0dad]/30 px-4 py-1.5 rounded-full text-[0.85rem] font-bold tracking-wider">{product.volume}</span>
            </div>
            
            <p className="text-[#b8a9cc] text-lg leading-[1.8] mb-10 pb-8 border-b border-[rgba(155,89,182,0.1)]">{product.description}</p>
            
            <div className="flex flex-col sm:flex-row gap-6 mb-12">
              <div className="flex items-center h-[56px] px-6 bg-[#16162a] border border-[rgba(155,89,182,0.15)] rounded-full gap-8 w-fit mx-auto sm:mx-0">
                <button 
                  className="text-[#b8a9cc] text-2xl hover:text-[#f0e6ff] disabled:opacity-20 transition-all" 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >-</button>
                <span className="text-xl font-bold text-[#f0e6ff] min-w-[20px] text-center">{quantity}</span>
                <button 
                  className="text-[#b8a9cc] text-2xl hover:text-[#f0e6ff] disabled:opacity-20 transition-all font-bold" 
                  onClick={() => setQuantity(q => q + 1)}
                  disabled={quantity >= product.stock}
                >+</button>
              </div>
              
              <button 
                className="btn btn-primary flex-1 h-[56px] text-lg gap-3"
                onClick={() => addToCart(product, quantity)}
                disabled={product.stock === 0}
              >
                <HiShoppingBag className="text-2xl" /> {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
            
            {/* Features Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-gradient-card border border-[rgba(155,89,182,0.15)] rounded-2xl mb-10">
              {[
                { icon: <HiShieldCheck />, title: 'Genuine Guarantee', desc: '100% authentic designer fragrances.' },
                { icon: <HiTruck />, title: 'Express Shipping', desc: 'Free priority shipping on all orders.' },
                { icon: <HiClock />, title: 'Lasting Quality', desc: 'Long-wear formula tested for 8h+ projection.' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#6a0dad]/10 flex items-center justify-center text-[#d4a5ff] text-2xl mb-2">{item.icon}</div>
                  <h5 className="text-[#f0e6ff] font-bold text-sm">{item.title}</h5>
                  <p className="text-[#7a6e8a] text-[0.75rem] leading-snug">{item.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-x-12 gap-y-4 text-sm mt-auto py-6 border-t border-[rgba(155,89,182,0.1)]">
              <p className="flex items-center gap-3 font-semibold text-[#7a6e8a]"><span className="text-[#f0e6ff]">Category:</span> {product.category}</p>
              <p className="flex items-center gap-3 font-semibold text-[#7a6e8a]"><span className="text-[#f0e6ff]">Inventory:</span> {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Sold Out'}</p>
              <p className="flex items-center gap-3 font-semibold text-[#7a6e8a]"><span className="text-[#f0e6ff]">SKU:</span> LX-{product._id.slice(-6).toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
