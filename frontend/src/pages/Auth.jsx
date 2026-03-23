import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiMail, HiLockClosed, HiUser, HiArrowRight } from 'react-icons/hi';
import './Auth.css';

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
    <div className="auth-page pt-nav">
      <div className="auth-glow"></div>
      <div className="container section flex-center">
        <div className="auth-card glass-card animate-fade-in-up">
          <div className="auth-header">
            <h2 className="section-title">{isRegister ? 'Join Luxora' : 'Welcome Back'}</h2>
            <p className="auth-subtitle">
              {isRegister 
                ? 'Create an account to start your fragrance journey.' 
                : 'Sign in to access your collection and orders.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {isRegister && (
              <div className="input-group">
                <label>Your Name</label>
                <div className="input-wrapper">
                  <HiUser className="input-icon" />
                  <input 
                    type="text" 
                    name="name"
                    placeholder="John Doe" 
                    className="input-field"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <HiMail className="input-icon" />
                <input 
                  type="email" 
                  name="email"
                  placeholder="name@example.com" 
                  className="input-field"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <HiLockClosed className="input-icon" />
                <input 
                  type="password" 
                  name="password"
                  placeholder="••••••••" 
                  className="input-field"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {isRegister && (
              <div className="input-group">
                <label>Confirm Password</label>
                <div className="input-wrapper">
                  <HiLockClosed className="input-icon" />
                  <input 
                    type="password" 
                    name="confirmPassword"
                    placeholder="••••••••" 
                    className="input-field"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            {!isRegister && (
              <div className="auth-forgot">
                <Link to="/forgot-password">Forgot password?</Link>
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary btn-lg full-size mt-20"
              disabled={loading}
            >
              {loading ? 'Processing...' : (isRegister ? 'Create Account' : 'Sign In')}
              {!loading && <HiArrowRight />}
            </button>
          </form>

          <p className="auth-switch">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Link to={isRegister ? '/login' : '/register'}>
              {isRegister ? 'Sign in here' : 'Register now'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
