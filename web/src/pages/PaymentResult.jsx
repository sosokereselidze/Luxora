import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { HiCheckCircle, HiXCircle, HiRefresh } from 'react-icons/hi';
import { getBogPaymentStatus } from '../api/orders';
import { useCart } from '../context/CartContext';

const PaymentResult = ({ type }) => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (type === 'success') {
      clearCart();
      checkStatus();
    } else {
      setLoading(false);
    }
  }, [type, orderId]);

  const checkStatus = async () => {
    if (!orderId) {
        setLoading(false);
        return;
    }
    try {
      const { data } = await getBogPaymentStatus(orderId);
      setStatus(data.status);
    } catch (error) {
      console.error('Error checking status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-bg-dark min-h-screen pt-32 animate-fade-in flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <HiRefresh className="text-accent-gold text-4xl animate-spin" />
          <p className="text-white/50 uppercase tracking-[0.3em] text-[0.7rem] font-bold text-center">Verifying Payment Status with Bank of Georgia...</p>
        </div>
      </div>
    );
  }

  return ( type === 'success' ? (
      <div className="bg-bg-dark min-h-screen pt-32 animate-fade-in flex items-center justify-center">
        <div className="container mx-auto px-6 py-12 flex justify-center">
          <div className="bg-white/[0.01] border border-white/5 p-16 md:p-24 backdrop-blur-3xl max-w-[600px] w-full text-center flex flex-col items-center gap-8 animate-fade-in-up">
            <div className="w-16 h-16 bg-white/[0.02] border border-white/5 flex items-center justify-center text-accent-gold text-3xl mb-2">
              <HiCheckCircle />
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-normal text-white">Payment Successful</h2>
            <p className="text-text-secondary font-light max-w-sm mb-4">
              Thank you for your purchase. Your order {orderId ? `#${orderId.slice(-6).toUpperCase()}` : ''} has been successfully processed.
            </p>
            <Link to="/" className="btn btn-primary w-full sm:w-auto">Return to Home</Link>
          </div>
        </div>
      </div>
    ) : (
      <div className="bg-bg-dark min-h-screen pt-32 animate-fade-in flex items-center justify-center">
        <div className="container mx-auto px-6 py-12 flex justify-center">
          <div className="bg-white/[0.01] border border-white/5 p-16 md:p-24 backdrop-blur-3xl max-w-[600px] w-full text-center flex flex-col items-center gap-8 animate-fade-in-up">
            <div className="w-16 h-16 bg-white/[0.02] border border-white/5 flex items-center justify-center text-red-500 text-3xl mb-2">
              <HiXCircle />
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-normal text-white">Payment Cancelled</h2>
            <p className="text-text-secondary font-light max-w-sm mb-4">
              The payment process was cancelled or failed. No charges were made to your account.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Link to="/checkout" className="btn btn-primary h-[60px] flex items-center justify-center">Back to Checkout</Link>
              <Link to="/" className="bg-white/5 h-[60px] hover:bg-white/10 text-white px-8 flex items-center justify-center uppercase tracking-[0.2em] text-[0.7rem] font-bold transition-all">Support</Link>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default PaymentResult;
