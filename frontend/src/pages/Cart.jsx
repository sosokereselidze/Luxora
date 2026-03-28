import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { HiTrash, HiShoppingBag, HiArrowRight, HiMinus, HiPlus } from 'react-icons/hi';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="bg-bg-dark min-h-screen pt-32 animate-fade-in flex items-center justify-center">
        <div className="container mx-auto px-6 py-12 flex justify-center">
          <div className="bg-white/[0.01] border border-white/5 p-16 md:p-24 backdrop-blur-3xl max-w-[600px] w-full text-center flex flex-col items-center gap-8 animate-fade-in-up">
            <div className="w-16 h-16 bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/50 text-2xl mb-2">
              <HiShoppingBag />
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-normal text-white">Your Bag is Empty</h2>
            <p className="text-text-secondary font-light max-w-sm mb-4">Discover the perfect scent to start your collection.</p>
            <Link to="/shop" className="btn btn-primary w-full sm:w-auto">Start Exploring</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-dark min-h-screen pt-32 lg:pt-40 animate-fade-in">
      <div className="container mx-auto px-6 pb-24">
        <h1 className="font-display text-4xl lg:text-5xl text-white mb-16 text-center lg:text-left">Your Shopping Bag</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">
          {/* Items List */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {cartItems.map((item) => (
              <div key={item._id} className="group relative bg-white/[0.01] border border-white/5 p-6 md:p-8 flex flex-col sm:flex-row items-center gap-8 transition-all hover:bg-white/[0.02]">
                <Link to={`/product/${item._id}`} className="w-full sm:w-32 aspect-[4/5] bg-white/[0.02] p-4 flex items-center justify-center border border-white/5 group-hover:border-accent-gold/20 transition-all">
                  <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain transform group-hover:scale-110 transition-transform duration-700" />
                </Link>
                
                <div className="flex-1 w-full sm:w-auto flex flex-col sm:flex-row justify-between items-center sm:items-start gap-8">
                  <div className="text-center sm:text-left">
                    <p className="text-accent-gold text-[0.55rem] uppercase tracking-[0.4em] mb-2 font-luxury opacity-80">{item.brand}</p>
                    <Link to={`/product/${item._id}`} className="text-lg md:text-xl font-display text-white hover:text-accent-gold transition-all block mb-2">{item.name}</Link>
                    <p className="text-[0.6rem] uppercase tracking-[0.3em] font-bold text-white/30">{item.volume}</p>
                  </div>
                  
                  <div className="flex flex-col items-center sm:items-end gap-6 w-full sm:w-auto mt-4 sm:mt-0">
                    <div className="flex items-center h-[40px] px-4 bg-white/[0.02] border border-white/10 gap-6">
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="text-white/40 hover:text-white transition-all font-light"
                      ><HiMinus /></button>
                      <span className="text-white font-body text-sm min-w-[20px] text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="text-white/40 hover:text-white transition-all font-light"
                      ><HiPlus /></button>
                    </div>
                    
                    <div className="flex items-center justify-between w-full sm:w-auto gap-8 mt-2 sm:mt-0">
                      <p className="text-xl font-body font-light tracking-widest text-white">${(item.price * item.quantity).toFixed(2)}</p>
                      <button 
                        onClick={() => removeFromCart(item._id)} 
                        className="text-white/20 hover:text-red-400 transition-all text-lg"
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
          <div className="bg-white/[0.01] border border-white/5 p-8 md:p-10 sticky top-32">
            <h3 className="font-display text-2xl text-white mb-8 border-b border-white/5 pb-6">Order Summary</h3>
            
            <div className="flex flex-col gap-5 mb-8 text-[0.8rem] font-bold uppercase tracking-[0.2em] text-white/50">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>Estimated</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center py-6 border-y border-white/5 mb-8">
              <span className="text-white font-bold text-[0.7rem] uppercase tracking-[0.3em]">Total</span>
              <span className="text-2xl font-body font-light tracking-widest text-white">${totalPrice.toFixed(2)}</span>
            </div>
            
            <div className="flex flex-col gap-4 mb-10 text-[0.65rem] uppercase tracking-[0.2em] font-bold text-text-secondary">
              <p className="flex items-center gap-3"><span className="text-accent-gold">✦</span> Free complimentary samples</p>
              <p className="flex items-center gap-3"><span className="text-accent-gold">✦</span> Premium gift packaging</p>
            </div>
            
            <div className="flex flex-col gap-4">
              <Link to="/checkout" className="btn btn-primary w-full flex items-center justify-between !px-6">
                <span>Proceed to Checkout</span> <HiArrowRight />
              </Link>
              
              <Link to="/shop" className="btn btn-outline w-full justify-center">
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
