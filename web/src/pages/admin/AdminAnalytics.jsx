import { useState, useEffect } from 'react';
import { getAdminAnalytics } from '../../api/admin';
import toast from 'react-hot-toast';

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminAnalytics()
      .then(r => setData(r.data))
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'300px' }}>
      <div style={{ width:32, height:32, border:'2px solid rgba(201,169,110,0.3)', borderTopColor:'#c9a96e', borderRadius:'50%', animation:'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const dailyEntries = data ? Object.entries(data.dailyData) : [];
  const maxRevenue = dailyEntries.length ? Math.max(...dailyEntries.map(([,v]) => v.revenue), 1) : 1;
  const maxOrders = dailyEntries.length ? Math.max(...dailyEntries.map(([,v]) => v.orders), 1) : 1;
  const totalRev = dailyEntries.reduce((s,[,v]) => s + v.revenue, 0);
  const totalOrd = dailyEntries.reduce((s,[,v]) => s + v.orders, 0);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'28px' }}>
      <div>
        <h2 style={{ fontFamily:'"Playfair Display",serif', fontSize:'26px', fontWeight:'400', color:'#f8f4ff', margin:'0 0 4px 0' }}>Analytics</h2>
        <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'12px', margin:0 }}>Last 14 days performance</p>
      </div>

      {/* Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'12px' }}>
        {[
          { label:'Revenue (14d)', value:`$${totalRev.toFixed(2)}`, color:'#c9a96e' },
          { label:'Orders (14d)', value:totalOrd, color:'#6366f1' },
          { label:'Avg Order Value', value: totalOrd ? `$${(totalRev / totalOrd).toFixed(2)}` : '$0.00', color:'#10b981' },
        ].map(c => (
          <div key={c.label} style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', padding:'20px 22px' }}>
            <div style={{ fontSize:'10px', fontWeight:'700', letterSpacing:'0.25em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', marginBottom:'10px' }}>{c.label}</div>
            <div style={{ fontFamily:'"Playfair Display",serif', fontSize:'30px', color: c.color, fontWeight:'400' }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', padding:'24px' }}>
        <h3 style={{ fontFamily:'"Playfair Display",serif', fontSize:'16px', color:'#f8f4ff', margin:'0 0 24px 0', fontWeight:'400' }}>Daily Revenue</h3>
        <div style={{ display:'flex', alignItems:'flex-end', gap:'6px', height:'140px' }}>
          {dailyEntries.map(([day, val]) => {
            const h = maxRevenue > 0 ? (val.revenue / maxRevenue) * 100 : 0;
            return (
              <div key={day} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'6px', position:'relative' }} title={`${day}: $${val.revenue.toFixed(2)}`}>
                <div style={{ position:'relative', width:'100%', display:'flex', alignItems:'flex-end', justifyContent:'center', height:'120px' }}>
                  <div style={{ width:'100%', background:`linear-gradient(to top, #c9a96e, rgba(201,169,110,0.25))`, height:`${Math.max(h, 2)}%`, borderRadius:'2px 2px 0 0', minHeight:'2px', transition:'height 0.8s ease' }} />
                </div>
                <span style={{ fontSize:'9px', color:'rgba(255,255,255,0.25)', textAlign:'center', letterSpacing:'0.03em', transform:'rotate(-40deg)', transformOrigin:'center', display:'block', whiteSpace:'nowrap' }}>{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Orders chart */}
      <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', padding:'24px' }}>
        <h3 style={{ fontFamily:'"Playfair Display",serif', fontSize:'16px', color:'#f8f4ff', margin:'0 0 24px 0', fontWeight:'400' }}>Daily Orders</h3>
        <div style={{ display:'flex', alignItems:'flex-end', gap:'6px', height:'100px' }}>
          {dailyEntries.map(([day, val]) => {
            const h = maxOrders > 0 ? (val.orders / maxOrders) * 100 : 0;
            return (
              <div key={day} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'6px' }} title={`${day}: ${val.orders} orders`}>
                <div style={{ width:'100%', background:`linear-gradient(to top, #6366f1, rgba(99,102,241,0.25))`, height:`${Math.max(h, 2)}%`, borderRadius:'2px 2px 0 0', minHeight:'2px', transition:'height 0.8s ease' }} />
                <span style={{ fontSize:'9px', color:'rgba(255,255,255,0.2)', transform:'rotate(-40deg)', transformOrigin:'center', display:'block', whiteSpace:'nowrap' }}>{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Products */}
      {data?.topProducts?.length > 0 && (
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', padding:'24px' }}>
          <h3 style={{ fontFamily:'"Playfair Display",serif', fontSize:'16px', color:'#f8f4ff', margin:'0 0 20px 0', fontWeight:'400' }}>Top Products by Revenue</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {data.topProducts.map((p, i) => {
              const maxP = data.topProducts[0].revenue;
              return (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'16px' }}>
                  <span style={{ fontSize:'11px', fontWeight:'700', color:'rgba(255,255,255,0.25)', width:'20px' }}>#{i+1}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
                      <span style={{ fontSize:'13px', color:'#f8f4ff', fontWeight:'500' }}>{p.name}</span>
                      <div style={{ display:'flex', gap:'16px' }}>
                        <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.35)' }}>{p.units} units</span>
                        <span style={{ fontSize:'13px', color:'#c9a96e', fontWeight:'700' }}>${p.revenue.toFixed(2)}</span>
                      </div>
                    </div>
                    <div style={{ height:'4px', background:'rgba(255,255,255,0.05)', borderRadius:'2px' }}>
                      <div style={{ width:`${(p.revenue/maxP)*100}%`, height:'100%', background:'linear-gradient(90deg,#c9a96e,#e8d5a3)', borderRadius:'2px', transition:'width 0.8s ease' }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default AdminAnalytics;
