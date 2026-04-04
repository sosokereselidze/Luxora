import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
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
  const navigate = useNavigate();
  const { login, register, googleLogin } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const data = await googleLogin(credentialResponse.credential);
      toast.success('Signed in with Google!');
      if (data.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (error) {
      toast.error('Google Sign-In failed');
    } finally {
      setLoading(false);
    }
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
        const data = await login(formData.email, formData.password);
        toast.success('Welcome back!');
        if (data.role === 'admin') {
          navigate('/admin');
          return;
        }
      }
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg-dark min-h-screen flex items-center justify-center relative overflow-hidden pt-24 pb-20">
      {/* Ambient Luxury Gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 blur-[200px] rounded-full mix-blend-screen pointer-events-none animate-float"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-gold/5 blur-[150px] rounded-full mix-blend-screen pointer-events-none"></div>
      
      <div className="container mx-auto px-6 flex justify-center relative z-10 w-full">
        {/* High-End Glass Container */}
        <div className="bg-white/[0.02] border border-white/10 p-10 md:p-14 backdrop-blur-2xl max-w-[480px] w-full shadow-2xl relative overflow-hidden group/card transform transition-all duration-700 hover:border-white/20">
          {/* Subtle gold line decoration */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-gold/50 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000"></div>

          <div className="text-center mb-14">
            <h2 className="font-luxury text-3xl lg:text-4xl text-gradient-gold mb-3 tracking-widest uppercase">
              {isRegister ? 'The Boutique' : 'Welcome Back'}
            </h2>
            <p className="text-text-secondary text-xs uppercase tracking-[0.3em] font-light opacity-80">
              {isRegister ? 'Begin Your Olfactory Journey' : 'Access Your Private Collection'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            {isRegister && (
              <div className="relative group">
                <input 
                  type="text" 
                  name="name"
                  placeholder=" " 
                  className="peer w-full bg-transparent border-b border-white/20 py-3 pl-10 text-white text-sm focus:border-accent-gold outline-none transition-colors"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <label className={`absolute left-10 transition-all cursor-text z-0 pointer-events-none peer-focus:-top-5 peer-focus:text-[0.6rem] peer-focus:text-accent-gold peer-focus:font-bold peer-focus:tracking-widest peer-focus:uppercase ${formData.name ? '-top-5 text-[0.6rem] text-white/60 uppercase tracking-widest' : 'top-3 text-sm text-white/40 font-light'}`}>
                  Full Name
                </label>
                <HiUser className="absolute left-1 top-3 text-white/30 text-xl transition-all peer-focus:text-accent-gold" />
              </div>
            )}

            <div className="relative group">
              <input 
                type="email" 
                name="email"
                placeholder=" " 
                className="peer w-full bg-transparent border-b border-white/20 py-3 pl-10 text-white text-sm focus:border-accent-gold outline-none transition-colors"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label className={`absolute left-10 transition-all cursor-text z-0 pointer-events-none peer-focus:-top-5 peer-focus:text-[0.6rem] peer-focus:text-accent-gold peer-focus:font-bold peer-focus:tracking-widest peer-focus:uppercase ${formData.email ? '-top-5 text-[0.6rem] text-white/60 uppercase tracking-widest' : 'top-3 text-sm text-white/40 font-light'}`}>
                Email Address
              </label>
              <HiMail className="absolute left-1 top-3 text-white/30 text-xl transition-all peer-focus:text-accent-gold" />
            </div>

            <div className="relative group">
              <input 
                type="password" 
                name="password"
                placeholder=" " 
                className="peer w-full bg-transparent border-b border-white/20 py-3 pl-10 text-white text-sm focus:border-accent-gold outline-none transition-colors"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <label className={`absolute left-10 transition-all cursor-text z-0 pointer-events-none peer-focus:-top-5 peer-focus:text-[0.6rem] peer-focus:text-accent-gold peer-focus:font-bold peer-focus:tracking-widest peer-focus:uppercase ${formData.password ? '-top-5 text-[0.6rem] text-white/60 uppercase tracking-widest' : 'top-3 text-sm text-white/40 font-light'}`}>
                Password
              </label>
              <HiLockClosed className="absolute left-1 top-3 text-white/30 text-xl transition-all peer-focus:text-accent-gold" />
            </div>

            {isRegister && (
              <div className="relative group">
                <input 
                  type="password" 
                  name="confirmPassword"
                  placeholder=" " 
                  className="peer w-full bg-transparent border-b border-white/20 py-3 pl-10 text-white text-sm focus:border-accent-gold outline-none transition-colors"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <label className={`absolute left-10 transition-all cursor-text z-0 pointer-events-none peer-focus:-top-5 peer-focus:text-[0.6rem] peer-focus:text-accent-gold peer-focus:font-bold peer-focus:tracking-widest peer-focus:uppercase ${formData.confirmPassword ? '-top-5 text-[0.6rem] text-white/60 uppercase tracking-widest' : 'top-3 text-sm text-white/40 font-light'}`}>
                  Confirm Password
                </label>
                <HiLockClosed className="absolute left-1 top-3 text-white/30 text-xl transition-all peer-focus:text-accent-gold" />
              </div>
            )}

            {!isRegister && (
              <div className="text-right -mt-6">
                <Link to="/forgot-password" size="sm" className="text-white/40 hover:text-accent-gold text-[0.6rem] uppercase tracking-[0.2em] font-normal transition-colors duration-300">Forgot password?</Link>
              </div>
            )}

            <button 
              type="submit" 
              className="mt-4 border border-accent-gold/40 bg-transparent hover:bg-accent-gold hover:text-black text-accent-gold text-white w-full py-4 text-[0.65rem] uppercase tracking-[0.4em] font-bold transition-all duration-500 flex justify-center items-center gap-3 group overflow-hidden relative"
              disabled={loading}
            >
              <span className="relative z-10">{loading ? 'Processing...' : (isRegister ? 'Join the Cult' : 'Sign In')}</span>
              {!loading && <HiArrowRight className="text-lg opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 relative z-10" />}
            </button>
          </form>

          <div className="flex items-center gap-6 my-10">
            <div className="h-[1px] bg-gradient-to-r from-transparent to-white/10 flex-1"></div>
            <span className="text-[0.55rem] font-bold text-white/20 uppercase tracking-[0.4em]">Exclusive Access</span>
            <div className="h-[1px] bg-gradient-to-l from-transparent to-white/10 flex-1"></div>
          </div>

          <div className="flex justify-center mb-8 relative group cursor-pointer w-full">
            {/* Animated Glow Array */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[270px] h-[55px] bg-gradient-to-r from-accent-gold/0 via-accent-gold/20 to-accent-gold/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700 rounded-lg pointer-events-none"></div>
            
            {/* Elegant Outer Shell */}
            <div className="relative border border-white/5 group-hover:border-accent-gold/40 bg-black/40 backdrop-blur-xl p-1.5 transition-all duration-500 w-full max-w-[260px] flex justify-center shadow-2xl overflow-hidden hover:shadow-[0_0_20px_rgba(201,169,110,0.15)] group-hover:-translate-y-0.5">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Google Login Error')}
                useOneTap
                theme="filled_black"
                shape="rectangular"
                width="246px"
                text={isRegister ? "signup_with" : "continue_with"}
                locale="en"
              />
            </div>
          </div>

          <p className="text-center text-[0.65rem] uppercase tracking-[0.2em] font-light text-white/40 mt-8">
            {isRegister ? 'Already a patron?' : "New to Luxora?"}{' '}
            <Link to={isRegister ? '/login' : '/register'} className="text-accent-gold hover:text-white transition-colors duration-300 ml-2 font-bold underline-offset-4">
              {isRegister ? 'Sign in here' : 'Apply for access'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
