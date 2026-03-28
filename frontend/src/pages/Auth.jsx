import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiMail, HiLockClosed, HiUser, HiArrowRight } from 'react-icons/hi';

const Auth = ({ isRegister = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await register(formData.name, formData.email, formData.password);
        toast.success('Welcome to Luxora!');
      } else {
        await login(formData.email, formData.password);
        toast.success('Welcome back!');
      }
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg-dark min-h-screen pt-32 animate-fade-in flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full pointer-events-none opacity-20"></div>
      
      <div className="container mx-auto px-6 py-12 flex justify-center relative z-10">
        <div className="bg-white/[0.01] border border-white/5 p-10 md:p-16 backdrop-blur-3xl max-w-[500px] w-full animate-fade-in-up">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl lg:text-4xl text-white mb-4">{isRegister ? 'Join Luxora' : 'Welcome Back'}</h2>
            <p className="text-text-secondary text-sm font-light">
              {isRegister 
                ? 'Create an account to start your fragrance journey.' 
                : 'Sign in to access your collection and orders.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {isRegister && (
              <div className="flex flex-col gap-3">
                <label className="text-[0.6rem] font-bold text-white/50 uppercase tracking-[0.3em] ml-1">Your Name</label>
                <div className="relative group">
                  <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-xl transition-all group-focus-within:text-accent-gold" />
                  <input 
                    type="text" 
                    name="name"
                    placeholder="John Doe" 
                    className="input-field pl-12"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <label className="text-[0.6rem] font-bold text-white/50 uppercase tracking-[0.3em] ml-1">Email Address</label>
              <div className="relative group">
                <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-xl transition-all group-focus-within:text-accent-gold" />
                <input 
                  type="email" 
                  name="email"
                  placeholder="name@example.com" 
                  className="input-field pl-12"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[0.6rem] font-bold text-white/50 uppercase tracking-[0.3em] ml-1">Password</label>
              <div className="relative group">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-xl transition-all group-focus-within:text-accent-gold" />
                <input 
                  type="password" 
                  name="password"
                  placeholder="••••••••" 
                  className="input-field pl-12"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {isRegister && (
              <div className="flex flex-col gap-3">
                <label className="text-[0.6rem] font-bold text-white/50 uppercase tracking-[0.3em] ml-1">Confirm Password</label>
                <div className="relative group">
                  <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-xl transition-all group-focus-within:text-accent-gold" />
                  <input 
                    type="password" 
                    name="confirmPassword"
                    placeholder="••••••••" 
                    className="input-field pl-12"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            {!isRegister && (
              <div className="text-right mt-2">
                <Link to="/forgot-password" size="sm" className="text-white/40 hover:text-white text-[0.65rem] uppercase tracking-[0.2em] font-bold transition-all">Forgot password?</Link>
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary w-full mt-6 flex justify-between items-center"
              disabled={loading}
            >
              <span>{loading ? 'Processing...' : (isRegister ? 'Create Account' : 'Sign In')}</span>
              {!loading && <HiArrowRight className="text-lg" />}
            </button>
          </form>

          <p className="text-center mt-10 text-[0.7rem] uppercase tracking-[0.2em] font-bold text-white/30">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Link to={isRegister ? '/login' : '/register'} className="text-white hover:text-accent-gold transition-all ml-2 underline underline-offset-4 decoration-white/20">
              {isRegister ? 'Sign in' : 'Register'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
