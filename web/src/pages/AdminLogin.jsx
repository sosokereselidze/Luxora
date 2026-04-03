import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // If already admin, redirect
  if (user && user.role === 'admin') {
    navigate('/admin');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      if (data.role !== 'admin') {
        toast.error('Access denied. Admin credentials required.');
        return;
      }
      toast.success('Welcome back, Administrator');
      navigate('/admin');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #050508 0%, #0a0014 50%, #050508 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Montserrat", sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute', top: '-20%', right: '-10%',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(106,13,173,0.12) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', left: '-10%',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%', maxWidth: '440px', padding: '0 24px',
        animation: 'fadeInUp 0.6s ease forwards'
      }}>
        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '72px', height: '72px', marginBottom: '24px',
            background: 'linear-gradient(135deg, rgba(106,13,173,0.3), rgba(201,169,110,0.2))',
            border: '1px solid rgba(201,169,110,0.2)',
            borderRadius: '0'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
          </div>
          <h1 style={{
            fontFamily: '"Cinzel", serif',
            fontSize: '13px', fontWeight: '700',
            letterSpacing: '0.4em', textTransform: 'uppercase',
            color: '#c9a96e', marginBottom: '8px', margin: '0 0 8px 0'
          }}>LUXORA</h1>
          <h2 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '28px', fontWeight: '400',
            color: '#f8f4ff', margin: '0 0 8px 0', letterSpacing: '-0.02em'
          }}>Admin Portal</h2>
          <p style={{ color: 'rgba(200,189,255,0.5)', fontSize: '13px', margin: 0 }}>
            Restricted access — authorized personnel only
          </p>
        </div>

        {/* Login Card */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
          padding: '48px 40px',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Email/Username field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{
                fontSize: '10px', fontWeight: '700', letterSpacing: '0.3em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)'
              }}>Email or Username</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="soso.kereselidze1@gmail.com"
                  style={{
                    width: '100%', padding: '14px 16px 14px 44px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#f8f4ff', fontSize: '13px',
                    outline: 'none', boxSizing: 'border-box',
                    fontFamily: '"Montserrat", sans-serif',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(201,169,110,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
                <span style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: 'rgba(255,255,255,0.25)'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
              </div>
            </div>

            {/* Password field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{
                fontSize: '10px', fontWeight: '700', letterSpacing: '0.3em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)'
              }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '14px 44px 14px 44px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#f8f4ff', fontSize: '13px',
                    outline: 'none', boxSizing: 'border-box',
                    fontFamily: '"Montserrat", sans-serif',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(201,169,110,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
                <span style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: 'rgba(255,255,255,0.25)'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(255,255,255,0.25)', padding: 0
                }}>
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '16px',
                background: loading ? 'rgba(201,169,110,0.3)' : 'linear-gradient(135deg, #c9a96e, #e8d5a3)',
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                color: '#050508', fontSize: '11px', fontWeight: '800',
                letterSpacing: '0.3em', textTransform: 'uppercase',
                fontFamily: '"Montserrat", sans-serif',
                transition: 'all 0.3s', marginTop: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  Enter Admin Panel
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            marginTop: '32px', paddingTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            textAlign: 'center'
          }}>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px', letterSpacing: '0.1em', margin: 0 }}>
              Luxora © 2025 · All rights reserved
            </p>
          </div>
        </div>

        {/* Back to store */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <a href="/" style={{
            color: 'rgba(255,255,255,0.3)', fontSize: '11px',
            textDecoration: 'none', letterSpacing: '0.15em',
            textTransform: 'uppercase', transition: 'color 0.3s'
          }}
            onMouseEnter={e => e.target.style.color = 'rgba(201,169,110,0.8)'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}
          >
            ← Back to Store
          </a>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=Montserrat:wght@100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
