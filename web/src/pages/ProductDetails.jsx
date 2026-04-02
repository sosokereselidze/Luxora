import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct, createReview } from '../api/products';
import { getStoredFragrance } from '../api/fragrances';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import { HiStar, HiShoppingBag, HiShieldCheck, HiTruck, HiClock, HiArrowLeft } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        let responseData;
        try {
          const { data } = await getProduct(id);
          responseData = data;
        } catch (e) {
          // Fallback to Fragrance Store
          const { data } = await getStoredFragrance(id);
          // Map Fragrance data to show in ProductDetails
          responseData = {
            ...data,
            category: data.category || 'Fragrance',
            stock: 100, // API products don't have stock, default to available
            numReviews: data.numReviews || 0,
            volume: '100ml', // Default volume
            Longevity: data.Longevity || data['Image Longevity'],
            Sillage: data.Sillage || data['Image Sillage'],
            accords: data.accords || data['Main Accords'] || [],
            topNotes: data.topNotes || data['Top Notes'] || [],
            middleNotes: data.middleNotes || data['Middle Notes'] || data['Heart Notes'] || [],
            baseNotes: data.baseNotes || data['Base Notes'] || []
          };
        }
        setProduct(responseData);
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

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to leave a review');
      navigate('/auth');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setSubmittingReview(true);
    try {
      await createReview(id, { rating, comment });
      toast.success('Review submitted successfully!', {
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
      setComment('');
      setRating(5);
      // Refresh product data
      const { data } = await getProduct(id);
      setProduct(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
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

            {/* Accords (Chords) Section */}
            {product.accords?.length > 0 && (
              <div className="mb-10 animate-fade-in-up">
                <h4 className="text-white font-display text-xl mb-6 flex items-center gap-3">
                  Olfactory <span className="italic font-light text-gradient-gold">Accords</span>
                </h4>
                <div className="flex flex-wrap gap-3">
                  {product.accords.map((accord, i) => (
                    <div
                      key={i}
                      className="group relative px-6 py-3 bg-white/[0.02] border border-white/5 backdrop-blur-md overflow-hidden transition-all hover:bg-white/[0.05] hover:border-accent-gold/30"
                    >
                      {/* Glow background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                      <span className="relative z-10 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-white/80 group-hover:text-accent-gold transition-colors">
                        {accord}
                      </span>

                      {/* Corner accent */}
                      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-accent-gold/20 group-hover:bg-accent-gold/60 transition-colors"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fragrance Notes Section */}
            {(product.topNotes?.length > 0 || product.middleNotes?.length > 0 || product.baseNotes?.length > 0) && (
              <div className="mb-10 animate-fade-in">
                <h4 className="text-white font-display text-xl mb-8 flex items-center gap-3">
                  Fragrance <span className="italic font-light text-gradient-purple">Profile</span>
                </h4>

                <div className="space-y-8">
                  {/* Top Notes */}
                  {product.topNotes?.length > 0 && (
                    <div className="group">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-gold/40"></span>
                        <h5 className="text-[0.6rem] font-bold text-accent-gold uppercase tracking-[0.4em]">Top Notes</h5>
                        <div className="h-px bg-white/5 flex-1"></div>
                        <span className="text-[0.5rem] font-medium text-white/20 uppercase tracking-[0.2em] italic">Immediate Impression</span>
                      </div>
                      <div className="flex flex-wrap gap-2 ml-5">
                        {product.topNotes.map((note, i) => (
                          <span key={i} className="px-4 py-1.5 bg-white/[0.02] border border-white/5 text-white/70 text-[0.65rem] tracking-wider hover:border-accent-gold/30 hover:text-white transition-all cursor-default">
                            {typeof note === 'string' ? note : (note.Name || note.name)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Middle Notes */}
                  {product.middleNotes?.length > 0 && (
                    <div className="group">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                        <h5 className="text-[0.6rem] font-bold text-primary uppercase tracking-[0.4em]">Heart Notes</h5>
                        <div className="h-px bg-white/5 flex-1"></div>
                        <span className="text-[0.5rem] font-medium text-white/20 uppercase tracking-[0.2em] italic">The Soul</span>
                      </div>
                      <div className="flex flex-wrap gap-2 ml-5">
                        {product.middleNotes.map((note, i) => (
                          <span key={i} className="px-4 py-1.5 bg-white/[0.02] border border-white/5 text-white/70 text-[0.65rem] tracking-wider hover:border-primary/30 hover:text-white transition-all cursor-default">
                            {typeof note === 'string' ? note : (note.Name || note.name)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Base Notes */}
                  {product.baseNotes?.length > 0 && (
                    <div className="group">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                        <h5 className="text-[0.6rem] font-bold text-white/50 uppercase tracking-[0.4em]">Base Notes</h5>
                        <div className="h-px bg-white/5 flex-1"></div>
                        <span className="text-[0.5rem] font-medium text-white/20 uppercase tracking-[0.2em] italic">Long-term Depth</span>
                      </div>
                      <div className="flex flex-wrap gap-2 ml-5">
                        {product.baseNotes.map((note, i) => (
                          <span key={i} className="px-4 py-1.5 bg-white/[0.02] border border-white/5 text-white/70 text-[0.65rem] tracking-wider border-dashed hover:border-white/20 hover:text-white transition-all cursor-default">
                            {typeof note === 'string' ? note : (note.Name || note.name)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

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
                disabled={product.stock === 0 && !product.id}
              >
                <HiShoppingBag className="text-sm" /> {product.stock > 0 || product.id ? 'Add to Bag' : 'Out of Stock'}
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
              <p className="flex items-center gap-2 font-bold text-white/30"><span className="text-white/60">SKU:</span> LX-{(product._id || product.id).slice(-6).toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-24 lg:mt-32 pt-16 border-t border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Review List */}
            <div className="animate-fade-in-up">
              <h3 className="text-white font-display text-2xl mb-8 flex items-center gap-3">
                Audience <span className="italic font-light text-gradient-gold">Feedback</span>
              </h3>

              <div className="max-h-[500px] overflow-y-auto pr-4 space-y-6 custom-scrollbar">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review) => (
                    <div key={review._id} className="bg-white/[0.02] border border-white/5 p-6 backdrop-blur-md relative group hover:bg-white/[0.03] transition-all">
                      <div className="absolute top-0 right-0 w-2 h-2 bg-accent-gold/10 group-hover:bg-accent-gold/30"></div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-white font-bold text-[0.6rem] uppercase tracking-[0.2em]">{review.name}</p>
                          <p className="text-text-secondary text-[0.5rem] uppercase tracking-widest opacity-40 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <HiStar key={i} className={i < review.rating ? 'text-[0.65rem] text-accent-gold' : 'text-[0.65rem] text-white/5'} />
                          ))}
                        </div>
                      </div>
                      <p className="text-text-secondary text-sm font-light leading-relaxed italic opacity-80">"{review.comment}"</p>
                    </div>
                  ))
                ) : (
                  <div className="py-20 border border-dashed border-white/10 text-center bg-white/[0.01]">
                    <p className="text-text-secondary text-[0.55rem] uppercase tracking-[0.3em] opacity-30">No reviews yet for this masterpiece.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Add Review Form */}
            <div className="bg-white/[0.01] border border-white/5 p-8 lg:p-12 relative overflow-hidden group animate-fade-in">
              {/* Decorative background element */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent-gold/5 blur-[100px] rounded-full group-hover:bg-accent-gold/10 transition-all duration-1000"></div>

              <div className="relative z-10">
                <h4 className="text-white font-display text-2xl mb-8">Share Your <span className="italic font-light text-gradient-purple">Impression</span></h4>

                {user ? (
                  <form onSubmit={submitHandler} className="space-y-8">
                    <div>
                      <label className="block text-[0.55rem] font-bold text-white/50 uppercase tracking-[0.3em] mb-4">Select Rating</label>
                      <div className="flex items-center gap-3">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setRating(num)}
                            className="transition-all hover:scale-125 focus:outline-none p-1"
                          >
                            <HiStar className={`text-2xl ${rating >= num ? 'text-accent-gold' : 'text-white/5 hover:text-accent-gold/30'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[0.55rem] font-bold text-white/50 uppercase tracking-[0.3em] mb-4">Your Commentary</label>
                      <textarea
                        rows="5"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        placeholder="Describe the olfactory journey: the opening, heart, and longevity..."
                        className="w-full bg-white/[0.02] border border-white/10 p-5 text-white text-sm font-light focus:border-accent-gold/30 focus:outline-none transition-all placeholder:text-white/10 resize-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="btn btn-primary w-full h-[52px] text-[0.6rem] uppercase tracking-[0.4em] gap-3"
                    >
                      {submittingReview ? (
                        <span className="flex items-center gap-2">Processing...</span>
                      ) : (
                        "Post Testimonial"
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="flex flex-col items-center text-center py-10">
                    <div className="w-16 h-16 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center mb-6">
                      <HiShieldCheck className="text-2xl text-accent-gold/40" />
                    </div>
                    <p className="text-text-secondary text-sm mb-10 font-light leading-relaxed max-w-[300px]">Authentication is required to ensure the authenticity of our fragrance community.</p>
                    <Link to="/auth" className="btn btn-secondary text-[0.55rem] px-12 h-12 uppercase tracking-[0.3em] border border-white/10 hover:border-accent-gold/30">
                      Sign In / Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ProductDetails;
