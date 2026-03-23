import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { HiTrash, HiShoppingBag, HiArrowRight, HiMinus, HiPlus } from 'react-icons/hi';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page pt-nav">
        <div className="container section text-center">
          <div className="empty-cart-message glass-card animate-fade-in-up">
            <HiShoppingBag className="empty-cart-icon" />
            <h2 className="section-title">Your Cart is Empty</h2>
            <p className="section-subtitle">Discover the perfect scent to start your collection.</p>
            <Link to="/shop" className="btn btn-primary mt-20">Start Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page pt-nav animate-fade-in">
      <div className="container section">
        <h1 className="section-title text-left">Your Shopping Bag</h1>
        
        <div className="cart-grid">
          {/* Items List */}
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item glass-card">
                <Link to={`/product/${item._id}`} className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </Link>
                
                <div className="cart-item-details">
                  <div className="cart-item-info">
                    <p className="cart-item-brand">{item.brand}</p>
                    <Link to={`/product/${item._id}`} className="cart-item-name">{item.name}</Link>
                    <p className="cart-item-volume">{item.volume}</p>
                  </div>
                  
                  <div className="cart-item-actions">
                    <div className="qty-picker-sm glass-card">
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="qty-btn-sm"
                      ><HiMinus /></button>
                      <span className="qty-value-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="qty-btn-sm"
                      ><HiPlus /></button>
                    </div>
                    
                    <div className="cart-item-price-area">
                      <p className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</p>
                      <button 
                        onClick={() => removeFromCart(item._id)} 
                        className="remove-btn"
                        title="Remove item"
                      >
                        <HiTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="cart-summary">
            <div className="summary-card glass-card">
              <h3 className="summary-title">Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="text-secondary">Calculated at checkout</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span className="text-secondary">Estimated 0.00</span>
              </div>
              
              <div className="summary-total">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="summary-perks">
                <p>✓ Free complimentary samples</p>
                <p>✓ Premium gift packaging included</p>
              </div>
              
              <Link to="/checkout" className="btn btn-primary btn-lg full-width">
                Proceed to Checkout <HiArrowRight />
              </Link>
              
              <Link to="/shop" className="btn btn-outline full-width mt-12">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
