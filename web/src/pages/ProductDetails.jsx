import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../api/products';
import { useCart } from '../context/CartContext';
import Loading from '../components/Loading';
import { HiStar, HiShoppingBag, HiShieldCheck, HiTruck, HiClock, HiArrowLeft } from 'react-icons/hi';
import toast from 'react-hot-toast';

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

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`, {
      style: {
        background: '#0a0a0f',
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '0',
        padding: '12px 18px',
        fontWeight: '400',
        fontSize: '11px',
        letterSpacing: '0.1em',
        fontFamily: 'Montserrat, sans-serif'
      },
    });
  };

  if (loading) return <Loading fullPage />;
  if (!product) return (
    <div className="container mx-auto px-6 py-24 text-center">
      <h2 className="text-xl font-display text-white mb-4">Product not found</h2>
      <Link to="/shop" className="btn btn-primary text-[0.6rem]">Back to Shop</Link>
    </div>
  );

  return (
    <div className="bg-bg-dark min-h-screen pt-24 lg:pt-32 animate-fade-in">
      <div className="container mx-auto px-6 pb-16">
        <Link to="/shop" className="flex items-center gap-2 text-text-secondary hover:text-white transition-all mb-8 w-fit group text-[0.55rem] font-bold uppercase tracking-[0.25em]">
          <HiArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Main Image */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[3/4] lg:aspect-[4/5] max-w-[320px] lg:max-w-[400px] bg-white/[0.01] border border-white/5 flex items-center justify-center p-6 lg:p-8 group mx-auto lg:mx-0">
              <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain transform group-hover:scale-110 transition-transform duration-[2s] ease-out brightness-90 group-hover:brightness-100" />
              {product.featured && <span className="absolute top-3 left-3 bg-black/40 text-accent-gold border border-accent-gold/20 px-2 py-1 text-[0.45rem] font-bold uppercase tracking-[0.25em] backdrop-blur-md">Premium</span>}
              {/* Animated Corner Overlay */}
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[50px] border-r-[50px] border-t-transparent border-r-white/5 group-hover:border-r-accent-gold/20 transition-all duration-700"></div>
            </div>
            
            {/* Thumbnails row */}
            <div className="grid grid-cols-4 gap-2 max-w-[320px] lg:max-w-[400px] mx-auto lg:mx-0">
              <div className="aspect-square bg-white/[0.03] border border-accent-gold/50 p-2 flex items-center justify-center cursor-pointer transition-colors">
                <img src={product.image} alt="thumbnail" className="max-w-full max-h-full object-contain" />
              </div>
              <div className="aspect-square bg-white/[0.01] border border-white/5 p-2 flex items-center justify-center opacity-50 hover:opacity-100 hover:bg-white/[0.02] transition-all cursor-pointer">
                <img src={product.image} alt="thumbnail" className="max-w-full max-h-full object-contain" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col h-full lg:py-4">
            <div className="mb-6">
              <p className="text-accent-gold font-luxury uppercase tracking-[0.5em] text-[0.55rem] mb-3 opacity-80">{product.brand}</p>
              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-white mb-4 leading-[1.1]">{product.name}</h1>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <HiStar key={i} className={i < Math.floor(product.rating) ? 'text-sm text-accent-gold' : 'text-sm text-white/10'} />
                  ))}
                </div>
                <div className="flex items-center gap-3 text-[0.55rem] font-bold uppercase tracking-[0.15em] text-text-secondary border-l border-white/10 pl-4 border-transparent">
                  <span className="text-white">{product.rating} / 5.0</span>
                  <span className="opacity-20">•</span>
                  <span>{product.numReviews} Reviews</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 mb-6">
              <p className="text-xl lg:text-2xl font-body font-light text-white tracking-wider">${product.price.toFixed(2)}</p>
              <span className="bg-white/[0.02] text-white/50 border border-white/10 px-3 py-1 text-[0.5rem] font-bold tracking-[0.25em] uppercase">{product.volume}</span>
            </div>

            <p className="text-text-secondary text-sm lg:text-base leading-relaxed font-light mb-8 pb-8 border-b border-white/5">{product.description}</p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="flex items-center h-[44px] px-4 bg-white/[0.02] border border-white/10 gap-6 w-fit mx-auto sm:mx-0">
                <button
                  className="text-white/50 text-lg hover:text-white disabled:opacity-20 transition-all font-light"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >-</button>
                <span className="text-sm font-body font-light text-white min-w-[24px] text-center">{quantity}</span>
                <button
                  className="text-white/50 text-lg hover:text-white disabled:opacity-20 transition-all font-light"
                  onClick={() => setQuantity(q => q + 1)}
                  disabled={quantity >= product.stock}
                >+</button>
              </div>

              <button
                className="btn btn-primary flex-1 h-[44px] text-[0.55rem] gap-3"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <HiShoppingBag className="text-sm" /> {product.stock > 0 ? 'Add to Bag' : 'Out of Stock'}
              </button>
            </div>

            {/* Features Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white/[0.01] border border-white/5 mb-6">
              {[
                { icon: <HiShieldCheck />, title: 'Authentic', desc: '100% genuine guaranteed.' },
                { icon: <HiTruck />, title: 'Shipping', desc: 'Complimentary shipping.' },
                { icon: <HiClock />, title: 'Lasting', desc: '8h+ projection.' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
                  <div className="w-10 h-10 bg-white/[0.02] border border-white/5 flex items-center justify-center text-accent-gold text-base mb-1">{item.icon}</div>
                  <h5 className="text-white font-bold text-[0.55rem] uppercase tracking-[0.15em]">{item.title}</h5>
                  <p className="text-text-secondary font-light text-[0.6rem] leading-snug">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-4 text-[0.55rem] uppercase tracking-[0.15em] mt-auto pt-6 border-t border-white/5">
              <p className="flex items-center gap-2 font-bold text-white/30"><span className="text-white/60">Category:</span> {product.category}</p>
              <p className="flex items-center gap-2 font-bold text-white/30"><span className="text-white/60">Stock:</span> {product.stock > 10 ? 'Available' : product.stock > 0 ? `Only ${product.stock} left` : 'Sold Out'}</p>
              <p className="flex items-center gap-2 font-bold text-white/30"><span className="text-white/60">SKU:</span> LX-{product._id.slice(-6).toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
