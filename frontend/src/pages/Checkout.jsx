import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { createOrder } from '../api/orders';
import toast from 'react-hot-toast';
import { HiTruck, HiCreditCard, HiCheckCircle, HiArrowLeft, HiLockClosed } from 'react-icons/hi';

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
      toast.success('Order placed successfully!', {
        style: {
          background: '#0a0a0f',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '0',
          padding: '16px 24px',
          fontWeight: '400',
          fontSize: '12px',
          letterSpacing: '0.1em',
          fontFamily: 'Montserrat, sans-serif'
        },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error placing order');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-bg-dark min-h-screen pt-32 animate-fade-in flex items-center justify-center">
        <div className="container mx-auto px-6 py-12 flex justify-center">
          <div className="bg-white/[0.01] border border-white/5 p-16 md:p-24 backdrop-blur-3xl max-w-[600px] w-full text-center flex flex-col items-center gap-8 animate-fade-in-up">
            <div className="w-16 h-16 bg-white/[0.02] border border-white/5 flex items-center justify-center text-accent-gold text-3xl mb-2">
              <HiCheckCircle />
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-normal text-white">Order Confirmed</h2>
            <p className="text-text-secondary font-light max-w-sm mb-4">Thank you for choosing Luxora. Your fragrance journey has begun.</p>
            <Link to="/" className="btn btn-primary w-full sm:w-auto">Return Home</Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="bg-bg-dark min-h-screen pt-32 lg:pt-40 animate-fade-in">
      <div className="container mx-auto px-6 pb-24">
        <Link to="/cart" className="flex items-center gap-3 text-text-secondary hover:text-white transition-all mb-12 w-fit group text-[0.6rem] font-bold uppercase tracking-[0.3em]">
          <HiArrowLeft className="group-hover:-translate-x-2 transition-transform" /> Return to Bag
        </Link>
        <h1 className="font-display text-4xl lg:text-5xl text-white mb-16 text-center lg:text-left">Secure Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">
          <form onSubmit={handlePlaceOrder} className="lg:col-span-2 flex flex-col gap-10">
            <div className="bg-white/[0.01] border border-white/5 p-8 md:p-12">
              <div className="flex items-center gap-4 mb-10 text-white">
                <HiTruck className="text-2xl text-accent-gold" />
                <h3 className="font-display text-2xl">Shipping Details</h3>
              </div>
              
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <label className="text-[0.6rem] font-bold text-white/50 uppercase tracking-[0.3em] ml-1">Full Name</label>
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="input-field" placeholder="John Doe" />
                </div>
                
                <div className="flex flex-col gap-3">
                  <label className="text-[0.6rem] font-bold text-white/50 uppercase tracking-[0.3em] ml-1">Detailed Address</label>
                  <input type="text" name="address" required value={formData.address} onChange={handleChange} className="input-field" placeholder="123 Luxury Ave, Apt 4B" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-3">
                    <label className="text-[0.6rem] font-bold text-white/50 uppercase tracking-[0.3em] ml-1">City</label>
                    <input type="text" name="city" required value={formData.city} onChange={handleChange} className="input-field" placeholder="Grasse" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-[0.6rem] font-bold text-white/50 uppercase tracking-[0.3em] ml-1">Postal Code</label>
                    <input type="text" name="postalCode" required value={formData.postalCode} onChange={handleChange} className="input-field" placeholder="06130" />
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <label className="text-[0.6rem] font-bold text-white/50 uppercase tracking-[0.3em] ml-1">Country</label>
                  <input type="text" name="country" required value={formData.country} onChange={handleChange} className="input-field" placeholder="France" />
                </div>
              </div>
            </div>

            <div className="bg-white/[0.01] border border-white/5 p-8 md:p-12">
              <div className="flex items-center gap-4 mb-8 text-white">
                <HiCreditCard className="text-2xl text-accent-gold" />
                <h3 className="font-display text-2xl">Payment Method</h3>
              </div>
              <p className="text-text-secondary font-light text-sm mb-10">Currently accepting Credit/Debit Card payments via secure portal.</p>
              
              <div className="p-8 bg-white/[0.02] border border-white/10 text-center flex flex-col items-center gap-4 border-dashed relative mb-10">
                 <div className="w-2 h-2 bg-accent-gold rounded-none animate-pulse absolute top-4 left-4"></div>
                 <p className="font-bold text-white text-[0.7rem] uppercase tracking-[0.3em]">Stripe Secure Portal</p>
                 <p className="text-[0.6rem] text-white/30 uppercase tracking-[0.2em]">Transaction will be simulated for this production preview.</p>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary h-[60px] w-full text-lg mt-4 flex items-center justify-between !px-8"
                disabled={loading}
              >
                <span>{loading ? 'Processing Order...' : 'Confirm & Pay'}</span>
                {!loading && <span className="font-body font-light tracking-widest">${totalPrice.toFixed(2)}</span>}
              </button>
            </div>
          </form>

          <aside className="sticky top-32">
            <div className="bg-white/[0.01] border border-white/5 p-8 md:p-10">
              <h3 className="font-display text-2xl text-white mb-8 border-b border-white/5 pb-6">Summary</h3>
              <div className="flex flex-col gap-6">
                {cartItems.map(item => (
                  <div key={item._id} className="flex gap-6 items-center">
                    <div className="w-16 h-20 bg-white/[0.02] border border-white/5 p-2 flex items-center justify-center flex-shrink-0">
                      <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-display mb-1">{item.name}</p>
                      <p className="text-white/30 text-[0.6rem] uppercase tracking-[0.2em] font-bold">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-white font-body font-light tracking-widest">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <div className="h-px bg-white/5 my-8"></div>
              
              <div className="flex flex-col gap-5 text-[0.75rem] font-bold uppercase tracking-[0.2em] text-white/50">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shipping</span>
                  <span className="text-accent-gold border border-accent-gold/20 px-3 py-1 bg-accent-gold/5 text-[0.6rem]">COMPLIMENTARY</span>
                </div>
              </div>
                  
              <div className="flex justify-between items-center py-6 border-t border-white/5 mt-8">
                <span className="text-white font-bold text-[0.7rem] uppercase tracking-[0.3em]">Total</span>
                <span className="text-2xl font-body font-light tracking-widest text-white">${totalPrice.toFixed(2)}</span>
              </div>
              
              <p className="text-center text-[0.6rem] text-white/30 mt-8 uppercase tracking-[0.3em] font-bold flex items-center justify-center gap-3">
                <HiLockClosed className="text-accent-gold text-lg" /> Secure Checkout
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
