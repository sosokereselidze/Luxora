import { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api/products';
import toast from 'react-hot-toast';

const EMPTY = { name:'', brand:'', description:'', price:0, image:'', category:'Unisex', volume:'100ml', stock:50, featured:false };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const r = await getProducts();
    setProducts(r.data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (p) => { setEditing(p); setForm({...p}); setShowModal(true); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await deleteProduct(id); toast.success('Product deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) { await updateProduct(editing._id, form); toast.success('Product updated'); }
      else { await createProduct(form); toast.success('Product created'); }
      setShowModal(false);
      load();
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const S = {
    th: { padding:'14px 16px', fontSize:'10px', fontWeight:'700', letterSpacing:'0.25em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', borderBottom:'1px solid rgba(255,255,255,0.05)', textAlign:'left', whiteSpace:'nowrap' },
    td: { padding:'14px 16px', fontSize:'13px', color:'rgba(255,255,255,0.8)', borderBottom:'1px solid rgba(255,255,255,0.04)', verticalAlign:'middle' },
    input: { width:'100%', padding:'12px 14px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'#f8f4ff', fontSize:'13px', outline:'none', boxSizing:'border-box', fontFamily:'inherit' },
    label: { fontSize:'10px', fontWeight:'700', letterSpacing:'0.25em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)', display:'block', marginBottom:'6px' }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'24px' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <h2 style={{ fontFamily:'"Playfair Display",serif', fontSize:'26px', fontWeight:'400', color:'#f8f4ff', margin:'0 0 4px 0' }}>Products</h2>
          <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'12px', margin:0 }}>{products.length} items in catalogue</p>
        </div>
        <div style={{ display:'flex', gap:'12px', alignItems:'center', flexWrap:'wrap' }}>
          <div style={{ position:'relative' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
              style={{ ...S.input, width:'220px', paddingLeft:'36px' }} />
            <svg style={{ position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <button onClick={openAdd} style={{ padding:'12px 20px', background:'linear-gradient(135deg,#c9a96e,#e8d5a3)', border:'none', cursor:'pointer', color:'#050508', fontSize:'11px', fontWeight:'800', letterSpacing:'0.2em', textTransform:'uppercase', display:'flex', alignItems:'center', gap:'6px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Product
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', overflowX:'auto' }}>
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'60px' }}>
            <div style={{ width:28, height:28, border:'2px solid rgba(201,169,110,0.3)', borderTopColor:'#c9a96e', borderRadius:'50%', animation:'spin 1s linear infinite' }} />
          </div>
        ) : (
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                {['Image','Name','Brand','Price','Stock','Category','Featured','Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan="8" style={{ ...S.td, textAlign:'center', padding:'48px', color:'rgba(255,255,255,0.2)' }}>No products found</td></tr>
              )}
              {filtered.map(p => (
                <tr key={p._id} style={{ transition:'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <td style={S.td}>
                    <img src={p.image} alt={p.name} style={{ width:44, height:44, objectFit:'contain', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)', padding:'4px' }} onError={e => e.target.src='https://images.unsplash.com/photo-1541643600914-78b084683601?w=100'} />
                  </td>
                  <td style={S.td}><span style={{ fontFamily:'"Playfair Display",serif', color:'#f8f4ff' }}>{p.name}</span></td>
                  <td style={S.td}><span style={{ fontSize:'10px', letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)' }}>{p.brand}</span></td>
                  <td style={S.td}><span style={{ fontWeight:'600', color:'#c9a96e' }}>${p.price.toFixed(2)}</span></td>
                  <td style={S.td}>
                    <span style={{ padding:'3px 10px', fontSize:'11px', fontWeight:'700', background: p.stock < 10 ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: p.stock < 10 ? '#ef4444' : '#10b981', border:`1px solid ${p.stock < 10 ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}` }}>{p.stock}</span>
                  </td>
                  <td style={S.td}><span style={{ fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(255,255,255,0.5)' }}>{p.category}</span></td>
                  <td style={S.td}>{p.featured ? <span style={{ color:'#c9a96e', fontSize:'16px' }}>✦</span> : <span style={{ color:'rgba(255,255,255,0.15)' }}>—</span>}</td>
                  <td style={S.td}>
                    <div style={{ display:'flex', gap:'8px' }}>
                      <button onClick={() => openEdit(p)} title="Edit" style={{ background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.2)', color:'#6366f1', padding:'6px 8px', cursor:'pointer', transition:'all 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background='rgba(99,102,241,0.2)'}
                        onMouseLeave={e => e.currentTarget.style.background='rgba(99,102,241,0.1)'}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button onClick={() => handleDelete(p._id)} title="Delete" style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#ef4444', padding:'6px 8px', cursor:'pointer', transition:'all 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.2)'}
                        onMouseLeave={e => e.currentTarget.style.background='rgba(239,68,68,0.1)'}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position:'fixed', inset:0, zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.85)', backdropFilter:'blur(12px)' }} onClick={() => setShowModal(false)} />
          <div style={{ position:'relative', zIndex:1, background:'#0a0a0f', border:'1px solid rgba(255,255,255,0.1)', width:'100%', maxWidth:'680px', maxHeight:'90vh', overflowY:'auto', boxShadow:'0 30px 80px rgba(0,0,0,0.7)' }}>
            <div style={{ padding:'24px 28px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, background:'#0a0a0f', zIndex:2 }}>
              <h3 style={{ fontFamily:'"Playfair Display",serif', fontSize:'22px', color:'#f8f4ff', margin:0, fontWeight:'400' }}>{editing ? 'Edit Product' : 'New Product'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', padding:'4px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding:'28px', display:'flex', flexDirection:'column', gap:'20px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
                <div><label style={S.label}>Product Name</label><input style={S.input} required value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="Velvet Orchid" /></div>
                <div><label style={S.label}>Brand</label><input style={S.input} required value={form.brand} onChange={e => setForm({...form, brand:e.target.value})} placeholder="LUXORA" /></div>
              </div>
              <div><label style={S.label}>Description</label><textarea style={{...S.input, resize:'none', height:'90px'}} required value={form.description} onChange={e => setForm({...form, description:e.target.value})} placeholder="Describe the fragrance..." /></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'16px' }}>
                <div><label style={S.label}>Price ($)</label><input style={S.input} type="number" step="0.01" min="0" required value={form.price} onChange={e => setForm({...form, price:Number(e.target.value)})} /></div>
                <div><label style={S.label}>Stock</label><input style={S.input} type="number" min="0" required value={form.stock} onChange={e => setForm({...form, stock:Number(e.target.value)})} /></div>
                <div><label style={S.label}>Category</label>
                  <select style={{...S.input, cursor:'pointer'}} value={form.category} onChange={e => setForm({...form, category:e.target.value})}>
                    <option value="Men">Men</option><option value="Women">Women</option><option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
                <div><label style={S.label}>Volume</label><input style={S.input} value={form.volume} onChange={e => setForm({...form, volume:e.target.value})} placeholder="100ml" /></div>
                <div><label style={S.label}>Image URL</label><input style={S.input} value={form.image} onChange={e => setForm({...form, image:e.target.value})} placeholder="https://..." /></div>
              </div>
              <label style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer' }}>
                <input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured:e.target.checked})} style={{ width:16, height:16, cursor:'pointer', accentColor:'#c9a96e' }} />
                <span style={{ fontSize:'11px', fontWeight:'700', letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)' }}>Featured (show on homepage)</span>
              </label>
              <div style={{ display:'flex', gap:'12px', justifyContent:'flex-end', paddingTop:'8px', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding:'12px 24px', background:'none', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.5)', cursor:'pointer', fontSize:'11px', fontWeight:'700', letterSpacing:'0.2em', textTransform:'uppercase' }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ padding:'12px 24px', background:'linear-gradient(135deg,#c9a96e,#e8d5a3)', border:'none', cursor:saving?'not-allowed':'pointer', color:'#050508', fontSize:'11px', fontWeight:'800', letterSpacing:'0.2em', textTransform:'uppercase', opacity:saving?0.7:1 }}>
                  {saving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default AdminProducts;
