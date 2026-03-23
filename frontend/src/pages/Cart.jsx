import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { HiTrash, HiShoppingBag, HiArrowRight, HiMinus, HiPlus } from 'react-icons/hi';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#0a0a0f] min-h-screen pt-24 animate-fade-in flex items-center justify-center">
        <div className="container mx-auto px-6 py-12 flex justify-center">
          <div className="bg-gradient-card border border-[rgba(155,89,182,0.15)] rounded-2xl p-16 backdrop-blur-md max-w-[600px] w-full text-center flex flex-col items-center gap-6 animate-fade-in-up">
            <div className="w-20 h-20 rounded-full bg-[#6a0dad]/10 flex items-center justify-center text-[#d4a5ff] text-4xl mb-2">
              <HiShoppingBag />
            </div>
            <h2 className="font-['Playfair_Display'] text-3xl font-bold text-[#f0e6ff]">Your Bag is Empty</h2>
            <p className="text-[#7a6e8a] max-w-sm">Discover the perfect scent to start your collection.</p>
            <Link to="/shop" className="btn btn-primary mt-4 px-10">Start Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0f] min-h-screen pt-24 animate-fade-in">
      <div className="container mx-auto px-6 py-12">
        <h1 className="font-['Playfair_Display'] text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-12">Your Shopping Bag</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Items List */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {cartItems.map((item) => (
              <div key={item._id} className="group relative bg-gradient-card border border-[rgba(155,89,182,0.15)] rounded-2xl p-6 backdrop-blur-md flex flex-col sm:flex-row items-center gap-8 transition-all hover:bg-[#6a0dad]/5">
                <Link to={`/product/${item._id}`} className="w-full sm:w-32 aspect-square rounded-xl overflow-hidden bg-[#16162a] p-4 flex items-center justify-center border border-[rgba(155,89,182,0.1)] group-hover:border-[#6a0dad]/30 transition-all">
                  <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain transform group-hover:scale-110 transition-transform duration-500" />
                </Link>
                
                <div className="flex-1 w-full sm:w-auto flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6">
                  <div className="text-center sm:text-left">
                    <p className="text-[#6a0dad] text-[0.7rem] uppercase tracking-[3px] font-bold mb-1 font-luxury">{item.brand}</p>
                    <Link to={`/product/${item._id}`} className="text-xl font-bold text-[#f0e6ff] hover:text-[#d4a5ff] transition-all block mb-1">{item.name}</Link>
                    <p className="text-sm text-[#7a6e8a] font-medium">{item.volume}</p>
                  </div>
                  
                  <div className="flex flex-col items-center sm:items-end gap-6 w-full sm:w-auto">
                    <div className="flex items-center h-[40px] px-4 bg-[#16162a] border border-[rgba(155,89,182,0.15)] rounded-full gap-5">
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="text-[#b8a9cc] hover:text-[#f0e6ff] transition-all"
                      ><HiMinus /></button>
                      <span className="text-[#f0e6ff] font-bold text-sm min-w-[20px] text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="text-[#b8a9cc] hover:text-[#f0e6ff] transition-all"
                      ><HiPlus /></button>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <p className="text-2xl font-bold text-[#d4a5ff]">${(item.price * item.quantity).toFixed(2)}</p>
                      <button 
                        onClick={() => removeFromCart(item._id)} 
                        className="w-10 h-10 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
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
          <div className="bg-gradient-card border border-[rgba(155,89,182,0.15)] rounded-2xl p-8 backdrop-blur-md sticky top-32">
            <h3 className="font-['Playfair_Display'] text-2xl font-bold text-white mb-8 border-b border-[rgba(155,89,182,0.15)] pb-4">Order Summary</h3>
            
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex justify-between text-[#b8a9cc]">
                <span>Subtotal</span>
                <span className="text-[#f0e6ff] font-bold">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#7a6e8a] text-sm">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-[#7a6e8a] text-sm">
                <span>Tax</span>
                <span>Estimated $0.00</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center bg-[#6a0dad]/10 border border-[#6a0dad]/20 rounded-xl p-5 mb-8">
              <span className="text-[#f0e6ff] font-bold text-lg">Total</span>
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">${totalPrice.toFixed(2)}</span>
            </div>
            
            <div className="flex flex-col gap-3 mb-10 text-[0.8rem] text-[#7a6e8a]">
              <p className="flex items-center gap-2 text-[#d4a5ff]">✓ Free complimentary samples</p>
              <p className="flex items-center gap-2 text-[#d4a5ff]">✓ Premium gift packaging included</p>
            </div>
            
            <div className="flex flex-col gap-4">
              <Link to="/checkout" className="btn btn-primary h-[56px] text-lg gap-3 w-full">
                Proceed to Checkout <HiArrowRight />
              </Link>
              
              <Link to="/shop" className="flex items-center justify-center h-[56px] text-[#b8a9cc] hover:text-[#f0e6ff] transition-all text-sm font-bold w-full border border-transparent hover:border-[rgba(155,89,182,0.15)] rounded-full">
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
