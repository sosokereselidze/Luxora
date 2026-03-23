import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../api/products';
import { useCart } from '../context/CartContext';
import Loading from '../components/Loading';
import { HiStar, HiShoppingBag, HiShieldCheck, HiTruck, HiClock, HiArrowLeft } from 'react-icons/hi';
import './ProductDetails.css';

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
    <div className="container section pt-nav text-center">
      <h2>Product not found</h2>
      <Link to="/shop" className="btn btn-primary mt-20">Back to Shop</Link>
    </div>
  );

  return (
    <div className="product-details-page pt-nav animate-fade-in">
      <div className="container section">
        <Link to="/shop" className="back-link">
          <HiArrowLeft /> Back to Shop
        </Link>
        
        <div className="details-grid">
          {/* Main Image */}
          <div className="product-visuals">
            <div className="main-image-wrapper glass-card">
              <img src={product.image} alt={product.name} className="main-image" />
              {product.featured && <span className="badge badge-gold detail-badge">Featured Selection</span>}
            </div>
            {/* Minimal Mock thumbnails */}
            <div className="thumbnails-row">
              <div className="thumbnail active glass-card"><img src={product.image} alt="th" /></div>
              <div className="thumbnail glass-card"><img src={product.image} alt="th" style={{ opacity: 0.6 }} /></div>
              {/* Other mock variations could go here */}
            </div>
          </div>
          
          {/* Content */}
          <div className="product-content">
            <div className="content-header">
              <p className="detail-brand">{product.brand}</p>
              <h1 className="detail-name">{product.name}</h1>
              <div className="detail-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <HiStar key={i} className={i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'} />
                  ))}
                </div>
                <span>{product.rating} / 5.0</span>
                <span className="divider">•</span>
                <span>{product.numReviews} Reviews</span>
              </div>
            </div>
            
            <div className="detail-price-row">
              <p className="detail-price">${product.price.toFixed(2)}</p>
              <span className="badge badge-purple">{product.volume}</span>
            </div>
            
            <p className="detail-description">{product.description}</p>
            
            <div className="detail-selection">
              <div className="qty-picker glass-card">
                <button 
                  className="qty-btn" 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >-</button>
                <span className="qty-value">{quantity}</span>
                <button 
                  className="qty-btn" 
                  onClick={() => setQuantity(q => q + 1)}
                  disabled={quantity >= product.stock}
                >+</button>
              </div>
              
              <button 
                className="btn btn-primary btn-lg flex-1 grow"
                onClick={() => addToCart(product, quantity)}
                disabled={product.stock === 0}
              >
                <HiShoppingBag /> {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
            
            {/* Features Info */}
            <div className="trust-grid glass-card p-24">
              <div className="trust-item">
                <HiShieldCheck className="trust-icon" />
                <div className="trust-text">
                  <h5>Genuine Guarantee</h5>
                  <p>100% authentic designer fragrances.</p>
                </div>
              </div>
              <div className="trust-item">
                <HiTruck className="trust-icon" />
                <div className="trust-text">
                  <h5>Express Shipping</h5>
                  <p>Free priority shipping on all orders.</p>
                </div>
              </div>
              <div className="trust-item">
                <HiClock className="trust-icon" />
                <div className="trust-text">
                  <h5>Lasting Quality</h5>
                  <p>Long-wear formula tested for 8h+ projection.</p>
                </div>
              </div>
            </div>
            
            <div className="product-meta-extra">
              <p><span>Category:</span> {product.category}</p>
              <p><span>Inventory:</span> {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Sold Out'}</p>
              <p><span>SKU:</span> LX-{product._id.slice(-6).toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
