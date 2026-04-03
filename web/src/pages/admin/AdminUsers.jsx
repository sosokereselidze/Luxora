import { useState, useEffect } from 'react';
import { getAdminUsers, updateAdminUser, deleteAdminUser } from '../../api/admin';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try { const r = await getAdminUsers(); setUsers(r.data); }
    catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const toggleRole = async (u) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change ${u.name}'s role to ${newRole}?`)) return;
    try {
      await updateAdminUser(u._id, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      load();
    } catch { toast.error('Update failed'); }
  };

  const handleDelete = async (u) => {
    if (!window.confirm(`Delete user "${u.name}"? This cannot be undone.`)) return;
    try { await deleteAdminUser(u._id); toast.success('User deleted'); load(); }
    catch(e) { toast.error(e?.response?.data?.message || 'Delete failed'); }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const S = {
    th: { padding:'14px 16px', fontSize:'10px', fontWeight:'700', letterSpacing:'0.25em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', borderBottom:'1px solid rgba(255,255,255,0.05)', textAlign:'left', whiteSpace:'nowrap' },
    td: { padding:'14px 16px', fontSize:'13px', borderBottom:'1px solid rgba(255,255,255,0.04)', verticalAlign:'middle' },
    input: { padding:'12px 14px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'#f8f4ff', fontSize:'13px', outline:'none', boxSizing:'border-box', fontFamily:'inherit' },
  };

  const admins = users.filter(u => u.role === 'admin').length;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'24px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <h2 style={{ fontFamily:'"Playfair Display",serif', fontSize:'26px', fontWeight:'400', color:'#f8f4ff', margin:'0 0 4px 0' }}>Users</h2>
          <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'12px', margin:0 }}>{users.length} registered accounts · {admins} admin{admins !== 1 ? 's' : ''}</p>
        </div>
        <div style={{ position:'relative' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
            style={{ ...S.input, width:'240px', paddingLeft:'36px' }} />
          <svg style={{ position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'12px' }}>
        {[
          { label:'Total Users', value: users.length, color:'#6366f1' },
          { label:'Admins', value: admins, color:'#c9a96e' },
          { label:'Regular Users', value: users.length - admins, color:'#10b981' },
          { label:'New This Month', value: users.filter(u => { const d = new Date(u.createdAt); const now = new Date(); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).length, color:'#f59e0b' },
        ].map(c => (
          <div key={c.label} style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', padding:'18px 20px' }}>
            <div style={{ fontSize:'10px', fontWeight:'700', letterSpacing:'0.25em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', marginBottom:'8px' }}>{c.label}</div>
            <div style={{ fontFamily:'"Playfair Display",serif', fontSize:'28px', color: c.color, fontWeight:'400' }}>{c.value}</div>
          </div>
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
              <tr>{['Avatar','Name','Email','Role','Joined','Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan="6" style={{...S.td, textAlign:'center', padding:'48px', color:'rgba(255,255,255,0.2)'}}>No users found</td></tr>}
              {filtered.map(u => {
                const initials = u.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
                const isAdmin = u.role === 'admin';
                return (
                  <tr key={u._id} onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background='transparent'} style={{ transition:'background .2s' }}>
                    <td style={S.td}>
                      <div style={{ width:38, height:38, borderRadius:'50%', background:`linear-gradient(135deg, ${isAdmin ? '#c9a96e' : '#6366f1'}, ${isAdmin ? '#e8d5a3' : '#818cf8'})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:'700', color:'#050508' }}>{initials}</div>
                    </td>
                    <td style={S.td}><span style={{ color:'#f8f4ff', fontWeight:'600' }}>{u.name}</span></td>
                    <td style={S.td}><span style={{ color:'rgba(255,255,255,0.45)', fontSize:'12px' }}>{u.email}</span></td>
                    <td style={S.td}>
                      <span style={{ padding:'4px 10px', fontSize:'10px', fontWeight:'700', letterSpacing:'0.15em', textTransform:'uppercase', background: isAdmin ? 'rgba(201,169,110,0.12)' : 'rgba(99,102,241,0.12)', color: isAdmin ? '#c9a96e' : '#818cf8', border:`1px solid ${isAdmin ? 'rgba(201,169,110,0.25)' : 'rgba(99,102,241,0.25)'}` }}>
                        {isAdmin ? '★ Admin' : 'User'}
                      </span>
                    </td>
                    <td style={S.td}><span style={{ color:'rgba(255,255,255,0.35)', fontSize:'11px' }}>{new Date(u.createdAt).toLocaleDateString()}</span></td>
                    <td style={S.td}>
                      <div style={{ display:'flex', gap:'6px' }}>
                        <button onClick={() => toggleRole(u)} style={{ padding:'5px 10px', background: isAdmin ? 'rgba(239,68,68,0.1)' : 'rgba(201,169,110,0.1)', border:`1px solid ${isAdmin ? 'rgba(239,68,68,0.2)' : 'rgba(201,169,110,0.2)'}`, color: isAdmin ? '#ef4444' : '#c9a96e', cursor:'pointer', fontSize:'10px', fontWeight:'700', letterSpacing:'0.1em', textTransform:'uppercase' }}>
                          {isAdmin ? 'Revoke Admin' : 'Make Admin'}
                        </button>
                        <button onClick={() => handleDelete(u)} style={{ padding:'5px 8px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#ef4444', cursor:'pointer' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
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

export default AdminUsers;
