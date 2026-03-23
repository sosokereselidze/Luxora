import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { HiShoppingBag, HiStar } from 'react-icons/hi';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link to={`/product/${product._id}`} className="product-card glass-card">
      <div className="product-image-wrapper">
        <img 
          src={product.image} 
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        <div className="product-overlay">
          <button onClick={handleAdd} className="add-to-cart-btn">
            <HiShoppingBag /> Add to Cart
          </button>
        </div>
        {product.featured && (
          <span className="product-badge badge badge-gold">Featured</span>
        )}
        <span className="product-category badge badge-purple">{product.category}</span>
      </div>
      <div className="product-info">
        <p className="product-brand">{product.brand}</p>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-meta">
          <div className="product-rating">
            <HiStar className="star-icon" />
            <span>{product.rating}</span>
            <span className="review-count">({product.numReviews})</span>
          </div>
          <p className="product-volume">{product.volume}</p>
        </div>
        <div className="product-bottom">
          <p className="product-price">${product.price.toFixed(2)}</p>
          <button onClick={handleAdd} className="quick-add-btn" title="Add to cart">
            <HiShoppingBag />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
