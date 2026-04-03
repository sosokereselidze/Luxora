import { useState, useEffect } from 'react';
import { getAdminStats } from '../../api/admin';

const StatCard = ({ label, value, sub, icon, color }) => (
  <div style={{
    background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)',
    padding:'28px 24px', display:'flex', flexDirection:'column', gap:'16px',
    transition:'border-color 0.3s'
  }}>
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
      <span style={{ fontSize:'10px', fontWeight:'700', letterSpacing:'0.3em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)' }}>{label}</span>
      <div style={{ width:36, height:36, background:color+'22', border:`1px solid ${color}33`, display:'flex', alignItems:'center', justifyContent:'center' }}>
        {icon}
      </div>
    </div>
    <div>
      <div style={{ fontFamily:'"Playfair Display",serif', fontSize:'32px', color:'#f8f4ff', fontWeight:'400', lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.3)', marginTop:'6px' }}>{sub}</div>}
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats().then(r => { setStats(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'300px' }}>
      <div style={{ width:32, height:32, border:'2px solid rgba(201,169,110,0.3)', borderTopColor:'#c9a96e', borderRadius:'50%', animation:'spin 1s linear infinite' }} />
    </div>
  );

  const revenueEntries = stats ? Object.entries(stats.revenueByMonth) : [];

  const orderStatusData = stats ? [
    { label: 'Pending', value: stats.pendingOrders, color: '#f59e0b' },
    { label: 'Processing', value: stats.processingOrders, color: '#c9a96e' },
    { label: 'Shipped', value: stats.shippedOrders, color: '#6366f1' },
    { label: 'Delivered', value: stats.deliveredOrders, color: '#10b981' },
    { label: 'Cancelled', value: stats.cancelledOrders, color: '#ef4444' },
  ] : [];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'32px' }}>
      <div>
        <h2 style={{ fontFamily:'"Playfair Display",serif', fontSize:'26px', fontWeight:'400', color:'#f8f4ff', margin:'0 0 4px 0' }}>Dashboard Overview</h2>
        <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'12px', margin:0 }}>Real-time business intelligence</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'16px' }}>
        <StatCard label="Total Revenue" value={`$${stats?.totalRevenue?.toFixed(2) || '0.00'}`}
          sub="From paid orders"
          color="#c9a96e"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
        />
        <StatCard label="Total Orders" value={stats?.totalOrders || 0}
          sub={`${stats?.pendingOrders || 0} pending`}
          color="#6366f1"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>}
        />
        <StatCard label="Products" value={stats?.totalProducts || 0}
          sub="In inventory"
          color="#10b981"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>}
        />
        <StatCard label="Users" value={stats?.totalUsers || 0}
          sub="Registered accounts"
          color="#f59e0b"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        {/* Order Status Breakdown */}
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', padding:'24px' }}>
          <h3 style={{ fontFamily:'"Playfair Display",serif', fontSize:'16px', color:'#f8f4ff', margin:'0 0 20px 0', fontWeight:'400' }}>Order Status</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {orderStatusData.map(s => (
              <div key={s.label} style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.4)', width:'80px', letterSpacing:'0.05em' }}>{s.label}</span>
                <div style={{ flex:1, height:'4px', background:'rgba(255,255,255,0.05)', borderRadius:'2px' }}>
                  <div style={{
                    height:'100%', borderRadius:'2px', background:s.color,
                    width: stats?.totalOrders ? `${(s.value / stats.totalOrders) * 100}%` : '0%',
                    transition:'width 0.8s ease'
                  }} />
                </div>
                <span style={{ fontSize:'13px', color:'#f8f4ff', fontWeight:'600', width:'24px', textAlign:'right' }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Month */}
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', padding:'24px' }}>
          <h3 style={{ fontFamily:'"Playfair Display",serif', fontSize:'16px', color:'#f8f4ff', margin:'0 0 20px 0', fontWeight:'400' }}>Revenue by Month</h3>
          {revenueEntries.length === 0 ? (
            <p style={{ color:'rgba(255,255,255,0.2)', fontSize:'13px', textAlign:'center', paddingTop:'40px' }}>No revenue data yet</p>
          ) : (
            <div style={{ display:'flex', alignItems:'flex-end', gap:'8px', height:'100px' }}>
              {revenueEntries.map(([month, rev]) => {
                const maxRev = Math.max(...revenueEntries.map(([,v]) => v), 1);
                const heightPct = (rev / maxRev) * 100;
                return (
                  <div key={month} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'6px' }}>
                    <div style={{
                      width:'100%', background:'linear-gradient(to top, #c9a96e, rgba(201,169,110,0.3))',
                      height:`${heightPct}%`, minHeight:'4px', borderRadius:'2px 2px 0 0',
                      transition:'height 0.8s ease'
                    }} title={`$${rev.toFixed(2)}`} />
                    <span style={{ fontSize:'9px', color:'rgba(255,255,255,0.3)', textAlign:'center', letterSpacing:'0.05em' }}>{month}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
};

export default AdminDashboard;
