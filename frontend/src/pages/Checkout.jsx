import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { createOrder } from '../api/orders';
import toast from 'react-hot-toast';
import { HiTruck, HiCreditCard, HiCheckCircle, HiArrowLeft } from 'react-icons/hi';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', address: '', city: '', postalCode: '', country: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity
        })),
        shippingAddress: formData,
        paymentMethod: 'Card',
        totalPrice: totalPrice
      };

      await createOrder(orderData);
      setSuccess(true);
      clearCart();
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error placing order');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="checkout-page pt-nav">
        <div className="container section flex-center">
          <div className="success-card glass-card animate-fade-in-up text-center">
            <HiCheckCircle className="success-icon" />
            <h2 className="section-title">Order Confirmed!</h2>
            <p className="section-subtitle">Thank you for choosing Luxora. Your fragrance journey has begun.</p>
            <Link to="/" className="btn btn-primary mt-20">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="checkout-page pt-nav animate-fade-in">
      <div className="container section">
        <Link to="/cart" className="back-link">
          <HiArrowLeft /> Return to Cart
        </Link>
        <h1 className="section-title text-left">Secure Checkout</h1>
        
        <div className="checkout-grid">
          <form onSubmit={handlePlaceOrder} className="checkout-form">
            <div className="form-section glass-card">
              <div className="section-title-row">
                <HiTruck className="section-icon" />
                <h3>Shipping Details</h3>
              </div>
              
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="input-field" placeholder="John Doe" />
              </div>
              
              <div className="input-group">
                <label>Detailed Address</label>
                <input type="text" name="address" required value={formData.address} onChange={handleChange} className="input-field" placeholder="123 Luxury Ave, Apt 4B" />
              </div>
              
              <div className="form-row">
                <div className="input-group">
                  <label>City</label>
                  <input type="text" name="city" required value={formData.city} onChange={handleChange} className="input-field" placeholder="Grasse" />
                </div>
                <div className="input-group">
                  <label>Postal Code</label>
                  <input type="text" name="postalCode" required value={formData.postalCode} onChange={handleChange} className="input-field" placeholder="06130" />
                </div>
              </div>
              
              <div className="input-group">
                <label>Country</label>
                <input type="text" name="country" required value={formData.country} onChange={handleChange} className="input-field" placeholder="France" />
              </div>
            </div>

            <div className="form-section glass-card">
              <div className="section-title-row">
                <HiCreditCard className="section-icon" />
                <h3>Payment Method</h3>
              </div>
              <p className="payment-note text-muted">Currently accepting Credit/Debit Card payments via secure portal.</p>
              
              <div className="mock-card-field glass-card">
                <div className="mock-card-dot"></div>
                <p>Mock Stripe/Payment Integration UI Placeholder</p>
                <p className="text-xs opacity-50">Transaction will be simulated for this production preview.</p>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary btn-lg full-width mt-30"
                disabled={loading}
              >
                {loading ? 'Processing Order...' : `Pay $${totalPrice.toFixed(2)} Now`}
              </button>
            </div>
          </form>

          <aside className="checkout-sidebar">
            <div className="summary-card glass-card">
              <h3 className="summary-title">Summary</h3>
              <div className="checkout-items">
                {cartItems.map(item => (
                  <div key={item._id} className="checkout-item-row">
                    <img src={item.image} alt={item.name} className="item-thumb" />
                    <div className="item-info">
                      <p className="item-name">{item.name}</p>
                      <p className="item-qty">Qty: {item.quantity}</p>
                    </div>
                    <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="text-green">FREE</span>
              </div>
              <div className="summary-total bold-total">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <p className="text-center text-xs text-muted mt-20">
                Secure SSL Encrypted Checkout
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
