import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { createOrder } from '../api/orders';
import toast from 'react-hot-toast';
import { HiTruck, HiCreditCard, HiCheckCircle, HiArrowLeft } from 'react-icons/hi';

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
      <div className="bg-[#0a0a0f] min-h-screen pt-24 animate-fade-in flex items-center justify-center">
        <div className="container mx-auto px-6 py-12 flex justify-center">
          <div className="bg-gradient-card border border-[rgba(155,89,182,0.15)] rounded-2xl p-16 backdrop-blur-md max-w-[600px] w-full text-center flex flex-col items-center gap-6 animate-fade-in-up">
            <div className="w-20 h-20 rounded-full bg-[#6a0dad]/10 flex items-center justify-center text-[#d4a5ff] text-4xl mb-2">
              <HiCheckCircle />
            </div>
            <h2 className="font-['Playfair_Display'] text-3xl font-bold text-[#f0e6ff]">Order Confirmed!</h2>
            <p className="text-[#7a6e8a] max-w-sm">Thank you for choosing Luxora. Your fragrance journey has begun.</p>
            <Link to="/" className="btn btn-primary mt-4 px-10">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="bg-[#0a0a0f] min-h-screen pt-24 animate-fade-in">
      <div className="container mx-auto px-6 py-12">
        <Link to="/cart" className="flex items-center gap-2 text-[#7a6e8a] hover:text-[#f0e6ff] transition-all mb-10 w-fit group">
          <HiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Return to Cart
        </Link>
        <h1 className="font-['Playfair_Display'] text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-12">Secure Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <form onSubmit={handlePlaceOrder} className="lg:col-span-2 flex flex-col gap-8">
            <div className="bg-gradient-card border border-[rgba(155,89,182,0.15)] rounded-2xl p-8 backdrop-blur-md">
              <div className="flex items-center gap-4 mb-8 text-[#f0e6ff]">
                <HiTruck className="text-2xl text-[#6a0dad]" />
                <h3 className="text-xl font-bold">Shipping Details</h3>
              </div>
              
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[0.75rem] font-bold text-[#7a6e8a] uppercase tracking-widest ml-1">Full Name</label>
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full h-[56px] px-6 bg-[#16162a] border border-[rgba(155,89,182,0.15)] rounded-xl text-[#f0e6ff] text-sm focus:border-[#6a0dad] outline-none transition-all placeholder:text-[#7a6e8a]" placeholder="John Doe" />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-[0.75rem] font-bold text-[#7a6e8a] uppercase tracking-widest ml-1">Detailed Address</label>
                  <input type="text" name="address" required value={formData.address} onChange={handleChange} className="w-full h-[56px] px-6 bg-[#16162a] border border-[rgba(155,89,182,0.15)] rounded-xl text-[#f0e6ff] text-sm focus:border-[#6a0dad] outline-none transition-all placeholder:text-[#7a6e8a]" placeholder="123 Luxury Ave, Apt 4B" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.75rem] font-bold text-[#7a6e8a] uppercase tracking-widest ml-1">City</label>
                    <input type="text" name="city" required value={formData.city} onChange={handleChange} className="w-full h-[56px] px-6 bg-[#16162a] border border-[rgba(155,89,182,0.15)] rounded-xl text-[#f0e6ff] text-sm focus:border-[#6a0dad] outline-none transition-all placeholder:text-[#7a6e8a]" placeholder="Grasse" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.75rem] font-bold text-[#7a6e8a] uppercase tracking-widest ml-1">Postal Code</label>
                    <input type="text" name="postalCode" required value={formData.postalCode} onChange={handleChange} className="w-full h-[56px] px-6 bg-[#16162a] border border-[rgba(155,89,182,0.15)] rounded-xl text-[#f0e6ff] text-sm focus:border-[#6a0dad] outline-none transition-all placeholder:text-[#7a6e8a]" placeholder="06130" />
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-[0.75rem] font-bold text-[#7a6e8a] uppercase tracking-widest ml-1">Country</label>
                  <input type="text" name="country" required value={formData.country} onChange={handleChange} className="w-full h-[56px] px-6 bg-[#16162a] border border-[rgba(155,89,182,0.15)] rounded-xl text-[#f0e6ff] text-sm focus:border-[#6a0dad] outline-none transition-all placeholder:text-[#7a6e8a]" placeholder="France" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-card border border-[rgba(155,89,182,0.15)] rounded-2xl p-8 backdrop-blur-md">
              <div className="flex items-center gap-4 mb-8 text-[#f0e6ff]">
                <HiCreditCard className="text-2xl text-[#6a0dad]" />
                <h3 className="text-xl font-bold">Payment Method</h3>
              </div>
              <p className="text-[#b8a9cc] text-sm mb-8">Currently accepting Credit/Debit Card payments via secure portal.</p>
              
              <div className="p-8 bg-[#16162a] border border-[rgba(155,89,182,0.15)] rounded-2xl text-center flex flex-col items-center gap-4 border-dashed relative">
                 <div className="w-4 h-4 bg-[#6a0dad] rounded-full animate-ping absolute top-4 left-4"></div>
                 <p className="font-bold text-[#f0e6ff] text-lg uppercase tracking-widest font-luxury">Stripe Secure Portal</p>
                 <p className="text-xs text-[#7a6e8a] font-medium tracking-wider">Transaction will be simulated for this production preview.</p>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary h-[56px] w-full text-lg mt-10"
                disabled={loading}
              >
                {loading ? 'Processing Order...' : `Pay $${totalPrice.toFixed(2)} Now`}
              </button>
            </div>
          </form>

          <aside className="sticky top-32">
            <div className="bg-gradient-card border border-[rgba(155,89,182,0.15)] rounded-2xl p-8 backdrop-blur-md">
              <h3 className="font-['Playfair_Display'] text-2xl font-bold text-white mb-8 border-b border-[rgba(155,89,182,0.15)] pb-4">Summary</h3>
              <div className="flex flex-col gap-5">
                {cartItems.map(item => (
                  <div key={item._id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#16162a] p-2 flex items-center justify-center flex-shrink-0 border border-[rgba(155,89,182,0.1)]">
                      <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-bold truncate w-40">{item.name}</p>
                      <p className="text-[#7a6e8a] text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-[#f0e6ff] font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <div className="h-px bg-[rgba(155,89,182,0.15)] my-8"></div>
              
              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-[#b8a9cc] text-sm font-medium">
                  <span>Subtotal</span>
                  <span className="text-[#f0e6ff] font-bold">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#7a6e8a] text-sm">
                  <span>Shipping</span>
                  <span className="text-green-400 font-bold uppercase tracking-widest text-[0.7rem] bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">FREE</span>
                </div>
                <div className="flex justify-between items-center bg-[#6a0dad]/10 border border-[#6a0dad]/20 rounded-xl p-5 mt-6">
                  <span className="text-[#f0e6ff] font-bold text-lg">Total</span>
                  <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              <p className="text-center text-[0.65rem] text-[#7a6e8a] mt-8 uppercase tracking-[3px] font-bold">
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
