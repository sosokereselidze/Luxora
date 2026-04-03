import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../api/orders';
import { markOrderPaid } from '../../api/admin';
import toast from 'react-hot-toast';

const STATUS_CHAIN = ['pending', 'processing', 'shipped', 'delivered'];
const STATUS_COLOR = {
  pending: { bg:'rgba(245,158,11,0.12)', text:'#f59e0b', border:'rgba(245,158,11,0.25)' },
  processing: { bg:'rgba(201,169,110,0.12)', text:'#c9a96e', border:'rgba(201,169,110,0.25)' },
  shipped: { bg:'rgba(99,102,241,0.12)', text:'#818cf8', border:'rgba(99,102,241,0.25)' },
  delivered: { bg:'rgba(16,185,129,0.12)', text:'#10b981', border:'rgba(16,185,129,0.25)' },
  cancelled: { bg:'rgba(239,68,68,0.12)', text:'#ef4444', border:'rgba(239,68,68,0.25)' },
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const load = async () => {
    setLoading(true);
    try { const r = await getAllOrders(); setOrders(r.data); }
    catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const advanceStatus = async (order) => {
    const idx = STATUS_CHAIN.indexOf(order.status);
    if (idx === -1 || idx === STATUS_CHAIN.length - 1) return;
    const next = STATUS_CHAIN[idx + 1];
    try { await updateOrderStatus(order._id, next); toast.success(`Order marked as ${next}`); load(); }
    catch { toast.error('Update failed'); }
  };

  const handlePay = async (id) => {
    try { await markOrderPaid(id); toast.success('Order marked as paid'); load(); }
    catch { toast.error('Failed'); }
  };

  const handleCancel = async (id) => {
    try { await updateOrderStatus(id, 'cancelled'); toast.success('Order cancelled'); load(); }
    catch { toast.error('Cancel failed'); }
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  const S = {
    th: { padding:'14px 16px', fontSize:'10px', fontWeight:'700', letterSpacing:'0.25em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', borderBottom:'1px solid rgba(255,255,255,0.05)', textAlign:'left', whiteSpace:'nowrap' },
    td: { padding:'14px 16px', fontSize:'13px', color:'rgba(255,255,255,0.8)', borderBottom:'1px solid rgba(255,255,255,0.04)', verticalAlign:'middle' },
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'24px' }}>
      <div>
        <h2 style={{ fontFamily:'"Playfair Display",serif', fontSize:'26px', fontWeight:'400', color:'#f8f4ff', margin:'0 0 4px 0' }}>Orders</h2>
        <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'12px', margin:0 }}>{orders.length} total orders</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:'4px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', padding:'4px', width:'fit-content', flexWrap:'wrap' }}>
        {['all', ...STATUS_CHAIN, 'cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding:'8px 16px', border:'none', cursor:'pointer', fontSize:'10px', fontWeight:'700',
            letterSpacing:'0.2em', textTransform:'uppercase', transition:'all 0.2s',
            background: filter === s ? (s === 'all' ? '#c9a96e' : STATUS_COLOR[s]?.bg || '#c9a96e') : 'transparent',
            color: filter === s ? (s === 'all' ? '#050508' : STATUS_COLOR[s]?.text || '#050508') : 'rgba(255,255,255,0.35)',
            border: filter === s ? `1px solid ${s === 'all' ? '#c9a96e' : STATUS_COLOR[s]?.border}` : '1px solid transparent'
          }}>{s}</button>
        ))}
      </div>

      <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', overflowX:'auto' }}>
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'60px' }}>
            <div style={{ width:28, height:28, border:'2px solid rgba(201,169,110,0.3)', borderTopColor:'#c9a96e', borderRadius:'50%', animation:'spin 1s linear infinite' }} />
          </div>
        ) : (
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>{['#','Customer','Total','Status','Payment','Date','Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan="7" style={{...S.td, textAlign:'center', padding:'48px', color:'rgba(255,255,255,0.2)'}}>No orders found</td></tr>}
              {filtered.map(o => {
                const sc = STATUS_COLOR[o.status] || STATUS_COLOR.pending;
                const isExpanded = expanded === o._id;
                return (
                  <>
                    <tr key={o._id} style={{ transition:'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <td style={S.td}>
                        <button onClick={() => setExpanded(isExpanded ? null : o._id)} style={{ background:'none', border:'none', cursor:'pointer', color:'#c9a96e', fontSize:'11px', fontWeight:'700', letterSpacing:'0.15em', display:'flex', alignItems:'center', gap:'6px' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: isExpanded?'rotate(90deg)':'rotate(0deg)', transition:'0.2s' }}><polyline points="9 18 15 12 9 6"/></svg>
                          LX-{o._id.slice(-6).toUpperCase()}
                        </button>
                      </td>
                      <td style={S.td}>
                        <div style={{ fontWeight:'600', color:'#f8f4ff', fontSize:'13px' }}>{o.user?.name || 'Unknown'}</div>
                        <div style={{ color:'rgba(255,255,255,0.3)', fontSize:'11px' }}>{o.user?.email}</div>
                      </td>
                      <td style={S.td}><span style={{ fontWeight:'700', color:'#c9a96e' }}>${o.totalPrice.toFixed(2)}</span></td>
                      <td style={S.td}><span style={{ padding:'4px 10px', fontSize:'10px', fontWeight:'700', letterSpacing:'0.15em', textTransform:'uppercase', background:sc.bg, color:sc.text, border:`1px solid ${sc.border}` }}>{o.status}</span></td>
                      <td style={S.td}>
                        <span style={{ padding:'4px 10px', fontSize:'10px', fontWeight:'700', letterSpacing:'0.15em', textTransform:'uppercase', background: o.isPaid ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', color: o.isPaid ? '#10b981' : '#ef4444', border:`1px solid ${o.isPaid ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}` }}>{o.isPaid ? 'Paid' : 'Unpaid'}</span>
                      </td>
                      <td style={S.td}><span style={{ color:'rgba(255,255,255,0.4)', fontSize:'11px' }}>{new Date(o.createdAt).toLocaleDateString()}</span></td>
                      <td style={S.td}>
                        <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                          {o.status !== 'delivered' && o.status !== 'cancelled' && (
                            <button onClick={() => advanceStatus(o)} style={{ padding:'5px 10px', background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.2)', color:'#818cf8', cursor:'pointer', fontSize:'10px', fontWeight:'700', letterSpacing:'0.1em', textTransform:'uppercase' }}>
                              → {STATUS_CHAIN[STATUS_CHAIN.indexOf(o.status) + 1] || ''}
                            </button>
                          )}
                          {!o.isPaid && o.status !== 'cancelled' && (
                            <button onClick={() => handlePay(o._id)} style={{ padding:'5px 10px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', color:'#10b981', cursor:'pointer', fontSize:'10px', fontWeight:'700', letterSpacing:'0.1em', textTransform:'uppercase' }}>Mark Paid</button>
                          )}
                          {o.status === 'pending' && (
                            <button onClick={() => handleCancel(o._id)} style={{ padding:'5px 10px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#ef4444', cursor:'pointer', fontSize:'10px', fontWeight:'700', letterSpacing:'0.1em', textTransform:'uppercase' }}>Cancel</button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={o._id + '-exp'}>
                        <td colSpan="7" style={{ padding:'0 16px 16px 40px', background:'rgba(255,255,255,0.01)', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', paddingTop:'12px' }}>
                            <div>
                              <p style={{ fontSize:'10px', fontWeight:'700', letterSpacing:'0.25em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', margin:'0 0 8px 0' }}>Items</p>
                              {o.items.map((item, i) => (
                                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.03)', fontSize:'12px' }}>
                                  <span style={{ color:'rgba(255,255,255,0.7)' }}>{item.name} × {item.quantity}</span>
                                  <span style={{ color:'#c9a96e' }}>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                            <div>
                              <p style={{ fontSize:'10px', fontWeight:'700', letterSpacing:'0.25em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', margin:'0 0 8px 0' }}>Shipping</p>
                              {['fullName','address','city','postalCode','country'].map(k => (
                                <div key={k} style={{ fontSize:'12px', color:'rgba(255,255,255,0.5)', lineHeight:'1.8' }}>{o.shippingAddress?.[k]}</div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default AdminOrders;
