import { useState, useEffect } from 'react';
import { getAdminReviews, deleteAdminReview } from '../../api/admin';
import toast from 'react-hot-toast';

const Stars = ({ rating }) => (
  <div style={{ display:'flex', gap:'2px' }}>
    {[1,2,3,4,5].map(i => (
      <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= rating ? '#c9a96e' : 'none'} stroke={i <= rating ? '#c9a96e' : 'rgba(255,255,255,0.2)'} strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ))}
  </div>
);

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try { const r = await getAdminReviews(); setReviews(r.data); }
    catch { toast.error('Failed to load reviews'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async (productId, reviewId, name) => {
    if (!window.confirm(`Delete review by "${name}"?`)) return;
    try { await deleteAdminReview(productId, reviewId); toast.success('Review deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const filteredReviews = reviews.filter(r => {
    const matchRating = filter === 'all' || String(r.rating) === filter;
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.productName.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase());
    return matchRating && matchSearch;
  });

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '—';
  const ratingCounts = [5,4,3,2,1].map(n => ({ star: n, count: reviews.filter(r => r.rating === n).length }));

  const S = {
    input: { padding:'10px 14px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'#f8f4ff', fontSize:'13px', outline:'none', boxSizing:'border-box', fontFamily:'inherit' },
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'24px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <h2 style={{ fontFamily:'"Playfair Display",serif', fontSize:'26px', fontWeight:'400', color:'#f8f4ff', margin:'0 0 4px 0' }}>Reviews &amp; Comments</h2>
          <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'12px', margin:0 }}>{reviews.length} total reviews · avg {avgRating} ★</p>
        </div>
        <div style={{ position:'relative' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reviews..."
            style={{ ...S.input, width:'240px', paddingLeft:'36px' }} />
          <svg style={{ position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:'20px', alignItems:'start' }}>
        {/* Rating breakdown */}
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', padding:'20px' }}>
          <p style={{ fontSize:'10px', fontWeight:'700', letterSpacing:'0.25em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', margin:'0 0 16px 0' }}>Rating Filter</p>
          <button onClick={() => setFilter('all')} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%', padding:'8px 0', background:'none', border:'none', cursor:'pointer', color: filter==='all' ? '#c9a96e' : 'rgba(255,255,255,0.4)', borderBottom:'1px solid rgba(255,255,255,0.04)', marginBottom:'4px' }}>
            <span style={{ fontSize:'11px', fontWeight:'700', letterSpacing:'0.15em', textTransform:'uppercase' }}>All Reviews</span>
            <span style={{ fontSize:'13px', fontWeight:'700' }}>{reviews.length}</span>
          </button>
          {ratingCounts.map(({ star, count }) => {
            const pct = reviews.length ? (count / reviews.length) * 100 : 0;
            return (
              <button key={star} onClick={() => setFilter(String(star))} style={{ display:'flex', alignItems:'center', gap:'8px', width:'100%', padding:'7px 0', background:'none', border:'none', cursor:'pointer', color: filter===String(star) ? '#c9a96e' : 'rgba(255,255,255,0.4)' }}>
                <span style={{ fontSize:'11px', fontWeight:'700', width:'12px' }}>{star}</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#c9a96e" stroke="#c9a96e" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <div style={{ flex:1, height:'4px', background:'rgba(255,255,255,0.05)', borderRadius:'2px' }}>
                  <div style={{ width:`${pct}%`, height:'100%', background:'#c9a96e', borderRadius:'2px', transition:'width 0.5s' }} />
                </div>
                <span style={{ fontSize:'11px', width:'20px', textAlign:'right' }}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Reviews list */}
        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
          {loading ? (
            <div style={{ display:'flex', justifyContent:'center', padding:'60px' }}>
              <div style={{ width:28, height:28, border:'2px solid rgba(201,169,110,0.3)', borderTopColor:'#c9a96e', borderRadius:'50%', animation:'spin 1s linear infinite' }} />
            </div>
          ) : filteredReviews.length === 0 ? (
            <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', padding:'48px', textAlign:'center', color:'rgba(255,255,255,0.2)', fontSize:'14px' }}>No reviews found</div>
          ) : filteredReviews.map(r => (
            <div key={r._id} style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', padding:'20px', transition:'border-color 0.2s' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px', flexWrap:'wrap' }}>
                <div style={{ display:'flex', gap:'14px', alignItems:'flex-start' }}>
                  <img src={r.productImage} alt={r.productName} style={{ width:44, height:44, objectFit:'contain', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', padding:'4px', flexShrink:0 }} onError={e => e.target.src='https://images.unsplash.com/photo-1541643600914-78b084683601?w=100'} />
                  <div>
                    <div style={{ fontSize:'11px', letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', marginBottom:'2px' }}>{r.productBrand}</div>
                    <div style={{ fontFamily:'"Playfair Display",serif', color:'#f8f4ff', fontSize:'14px' }}>{r.productName}</div>
                  </div>
                </div>
                <button onClick={() => handleDelete(r.productId, r._id, r.name)} style={{ padding:'6px 8px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#ef4444', cursor:'pointer', flexShrink:0 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </button>
              </div>
              <div style={{ marginTop:'16px', paddingTop:'14px', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#818cf8)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'700', color:'#fff' }}>
                      {r.name.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize:'13px', fontWeight:'600', color:'#f8f4ff' }}>{r.name}</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <Stars rating={r.rating} />
                    <span style={{ color:'rgba(255,255,255,0.3)', fontSize:'11px' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'13px', lineHeight:'1.7', margin:0, fontStyle:'italic' }}>"{r.comment}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default AdminReviews;
