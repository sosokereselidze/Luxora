import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';
import AdminDashboard from './admin/AdminDashboard';
import AdminProducts from './admin/AdminProducts';
import AdminOrders from './admin/AdminOrders';
import AdminUsers from './admin/AdminUsers';
import AdminReviews from './admin/AdminReviews';
import AdminAnalytics from './admin/AdminAnalytics';

const NAV = [
  { id:'dashboard', label:'Dashboard', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { id:'products', label:'Products', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> },
  { id:'orders', label:'Orders', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
  { id:'users', label:'Users', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { id:'reviews', label:'Reviews', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  { id:'analytics', label:'Analytics', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
];

const Admin = () => {
  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const SIDEBAR_W = sidebarOpen ? '240px' : '64px';

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#050508', fontFamily:'"Montserrat",sans-serif', color:'#f8f4ff' }}>
      <Toaster position="top-right" />

      {/* Sidebar */}
      <aside style={{
        width: SIDEBAR_W, flexShrink:0,
        background:'rgba(10,10,20,0.98)',
        borderRight:'1px solid rgba(255,255,255,0.06)',
        display:'flex', flexDirection:'column',
        position:'sticky', top:0, height:'100vh',
        transition:'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        overflow:'hidden', zIndex:100
      }}>
        {/* Logo */}
        <div style={{ padding: sidebarOpen ? '28px 24px 20px' : '28px 16px 20px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent: sidebarOpen ? 'space-between' : 'center' }}>
          {sidebarOpen && (
            <div>
              <div style={{ fontFamily:'"Cinzel",serif', fontSize:'12px', fontWeight:'700', letterSpacing:'0.4em', color:'#c9a96e', marginBottom:'2px' }}>LUXORA</div>
              <div style={{ fontSize:'9px', letterSpacing:'0.2em', color:'rgba(255,255,255,0.3)', textTransform:'uppercase' }}>Admin Panel</div>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.35)', padding:'4px', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {sidebarOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>}
            </svg>
          </button>
        </div>

        {/* Nav items */}
        <nav style={{ flex:1, padding:'16px 0', overflowY:'auto' }}>
          {NAV.map(n => {
            const isActive = active === n.id;
            return (
              <button key={n.id} onClick={() => setActive(n.id)} title={!sidebarOpen ? n.label : ''} style={{
                width:'100%', display:'flex', alignItems:'center', gap:'12px',
                padding: sidebarOpen ? '12px 24px' : '12px 0',
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                background: isActive ? 'rgba(201,169,110,0.08)' : 'transparent',
                borderLeft: isActive ? '2px solid #c9a96e' : '2px solid transparent',
                borderRight:'none', borderTop:'none', borderBottom:'none',
                color: isActive ? '#c9a96e' : 'rgba(255,255,255,0.35)',
                cursor:'pointer', fontSize:'11px', fontWeight:'700',
                letterSpacing:'0.15em', textTransform:'uppercase',
                transition:'all 0.2s', whiteSpace:'nowrap',
              }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color='rgba(255,255,255,0.7)'; e.currentTarget.style.background='rgba(255,255,255,0.03)'; }}}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color='rgba(255,255,255,0.35)'; e.currentTarget.style.background='transparent'; }}}
              >
                <span style={{ flexShrink:0 }}>{n.icon}</span>
                {sidebarOpen && <span>{n.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User profile + logout */}
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', padding: sidebarOpen ? '16px 24px' : '16px 0', display:'flex', flexDirection:'column', gap:'12px', alignItems: sidebarOpen ? 'flex-start' : 'center' }}>
          {sidebarOpen ? (
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#c9a96e,#e8d5a3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'700', color:'#050508', flexShrink:0 }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div style={{ overflow:'hidden' }}>
                <div style={{ fontSize:'11px', fontWeight:'700', color:'#f8f4ff', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.name}</div>
                <div style={{ fontSize:'9px', letterSpacing:'0.2em', textTransform:'uppercase', color:'#c9a96e' }}>Administrator</div>
              </div>
            </div>
          ) : (
            <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#c9a96e,#e8d5a3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'700', color:'#050508' }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
          )}
          <div style={{ display:'flex', gap:'8px', width: sidebarOpen ? '100%' : 'auto' }}>
            <button onClick={handleLogout} title="Logout" style={{ flex: 1, padding:'7px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.15)', color:'rgba(239,68,68,0.6)', cursor:'pointer', fontSize:'10px', fontWeight:'700', letterSpacing:'0.1em', textTransform:'uppercase', display:'flex', alignItems:'center', justifyContent:'center', gap:'4px', transition:'all 0.2s', width: sidebarOpen ? '100%' : '32px' }}
              onMouseEnter={e => { e.currentTarget.style.color='#ef4444'; e.currentTarget.style.background='rgba(239,68,68,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.color='rgba(239,68,68,0.6)'; e.currentTarget.style.background='rgba(239,68,68,0.08)'; }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              {sidebarOpen && 'Logout'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        {/* Top bar */}
        <header style={{ padding:'20px 32px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(5,5,8,0.8)', backdropFilter:'blur(12px)', position:'sticky', top:0, zIndex:50 }}>
          <div>
            <div style={{ fontSize:'10px', fontWeight:'700', letterSpacing:'0.3em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', marginBottom:'2px' }}>Admin Panel</div>
            <h1 style={{ fontFamily:'"Playfair Display",serif', fontSize:'20px', fontWeight:'400', color:'#f8f4ff', margin:0 }}>
              {NAV.find(n => n.id === active)?.label}
            </h1>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:'#10b981', boxShadow:'0 0 8px rgba(16,185,129,0.5)' }} />
            <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.35)', letterSpacing:'0.1em' }}>System Online</span>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex:1, padding:'32px', overflowY:'auto' }}>
          {active === 'dashboard' && <AdminDashboard />}
          {active === 'products' && <AdminProducts />}
          {active === 'orders' && <AdminOrders />}
          {active === 'users' && <AdminUsers />}
          {active === 'reviews' && <AdminReviews />}
          {active === 'analytics' && <AdminAnalytics />}
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=Montserrat:wght@100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        ::-webkit-scrollbar-thumb { background: rgba(201,169,110,0.2); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(201,169,110,0.4); }
        select option { background: #0a0a0f; color: #f8f4ff; }
      `}</style>
    </div>
  );
};

export default Admin;
