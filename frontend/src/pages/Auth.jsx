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
    <div className="bg-[#0a0a0f] min-h-screen pt-24 animate-fade-in flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6a0dad]/5 blur-[120px] rounded-full"></div>
      
      <div className="container mx-auto px-6 py-12 flex justify-center relative z-10">
        <div className="bg-gradient-card border border-[rgba(155,89,182,0.15)] rounded-2xl p-10 backdrop-blur-md max-w-[500px] w-full animate-fade-in-up">
          <div className="text-center mb-10">
            <h2 className="font-['Playfair_Display'] text-3xl font-bold text-[#f0e6ff] mb-3">{isRegister ? 'Join Luxora' : 'Welcome Back'}</h2>
            <p className="text-[#7a6e8a] text-sm">
              {isRegister 
                ? 'Create an account to start your fragrance journey.' 
                : 'Sign in to access your collection and orders.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {isRegister && (
              <div className="flex flex-col gap-2">
                <label className="text-[0.75rem] font-bold text-[#7a6e8a] uppercase tracking-widest ml-1">Your Name</label>
                <div className="relative group">
                  <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6a0dad] text-xl transition-all group-focus-within:text-[#d4a5ff]" />
                  <input 
                    type="text" 
                    name="name"
                    placeholder="John Doe" 
                    className="w-full h-[56px] pl-12 pr-6 bg-[#16162a] border border-[rgba(155,89,182,0.15)] rounded-xl text-[#f0e6ff] text-sm focus:border-[#6a0dad] outline-none transition-all placeholder:text-[#7a6e8a]"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-[0.75rem] font-bold text-[#7a6e8a] uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6a0dad] text-xl transition-all group-focus-within:text-[#d4a5ff]" />
                <input 
                  type="email" 
                  name="email"
                  placeholder="name@example.com" 
                  className="w-full h-[56px] pl-12 pr-6 bg-[#16162a] border border-[rgba(155,89,182,0.15)] rounded-xl text-[#f0e6ff] text-sm focus:border-[#6a0dad] outline-none transition-all placeholder:text-[#7a6e8a]"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[0.75rem] font-bold text-[#7a6e8a] uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6a0dad] text-xl transition-all group-focus-within:text-[#d4a5ff]" />
                <input 
                  type="password" 
                  name="password"
                  placeholder="••••••••" 
                  className="w-full h-[56px] pl-12 pr-6 bg-[#16162a] border border-[rgba(155,89,182,0.15)] rounded-xl text-[#f0e6ff] text-sm focus:border-[#6a0dad] outline-none transition-all placeholder:text-[#7a6e8a]"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {isRegister && (
              <div className="flex flex-col gap-2">
                <label className="text-[0.75rem] font-bold text-[#7a6e8a] uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative group">
                  <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6a0dad] text-xl transition-all group-focus-within:text-[#d4a5ff]" />
                  <input 
                    type="password" 
                    name="confirmPassword"
                    placeholder="••••••••" 
                    className="w-full h-[56px] pl-12 pr-6 bg-[#16162a] border border-[rgba(155,89,182,0.15)] rounded-xl text-[#f0e6ff] text-sm focus:border-[#6a0dad] outline-none transition-all placeholder:text-[#7a6e8a]"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            {!isRegister && (
              <div className="text-right">
                <Link to="/forgot-password" size="sm" className="text-[#7a6e8a] hover:text-[#d4a5ff] text-xs transition-all">Forgot password?</Link>
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary h-[56px] w-full text-lg gap-3 mt-4"
              disabled={loading}
            >
              {loading ? 'Processing...' : (isRegister ? 'Create Account' : 'Sign In')}
              {!loading && <HiArrowRight />}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-[#7a6e8a]">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Link to={isRegister ? '/login' : '/register'} className="text-[#d4a5ff] font-bold hover:text-[#f0e6ff] transition-all">
              {isRegister ? 'Sign in here' : 'Register now'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
