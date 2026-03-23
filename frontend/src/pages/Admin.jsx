import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProducts, deleteProduct } from '../api/products';
import { getAllOrders, updateOrderStatus as updateOrderApiStatus } from '../api/orders';
import Loading from '../components/Loading';
import { HiPlus, HiPencil, HiTrash, HiCheck, HiX, HiAdjustments, HiShoppingBag, HiSearch } from 'react-icons/hi';
import toast from 'react-hot-toast';
import axios from 'axios';

const Admin = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [productForm, setProductForm] = useState({
    name: '', brand: '', description: '', price: 0, 
    image: '', category: 'Unisex', volume: '100ml', stock: 50, featured: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pRes, oRes] = await Promise.all([getProducts(), getAllOrders()]);
      setProducts(pRes.data);
      setOrders(oRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p) => {
    setEditingProduct(p);
    setProductForm(p);
    setShowProductModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p._id !== id));
      toast.success('Product deleted');
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, productForm);
        toast.success('Product updated');
      } else {
        await axios.post('http://localhost:5000/api/products', productForm);
        toast.success('Product created');
      }
      setShowProductModal(false);
      setEditingProduct(null);
      fetchData();
    } catch (error) {
      toast.error('Save failed');
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await updateOrderApiStatus(id, status);
      toast.success('Order status updated');
      fetchData();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loading fullPage />;

  return (
    <div className="bg-[#0a0a0f] min-h-screen pt-24 animate-fade-in px-6">
      <div className="container mx-auto py-12">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 bg-gradient-card border border-[rgba(155,89,182,0.15)] rounded-2xl p-8 backdrop-blur-md">
          <div className="flex flex-col gap-2">
            <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#f0e6ff]">Admin Management</h1>
            <p className="text-[#7a6e8a] text-sm font-medium">Manage your boutique's inventory and orders.</p>
          </div>
          <div className="flex items-center gap-2 bg-[#0a0a0f]/50 p-1.5 rounded-full border border-[rgba(155,89,182,0.1)]">
            <button 
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'products' ? 'bg-[#6a0dad] text-white shadow-lg shadow-[#6a0dad]/20' : 'text-[#7a6e8a] hover:text-[#f0e6ff]'}`}
              onClick={() => setActiveTab('products')}
            >
              <HiAdjustments /> Products
            </button>
            <button 
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-[#6a0dad] text-white shadow-lg shadow-[#6a0dad]/20' : 'text-[#7a6e8a] hover:text-[#f0e6ff]'}`}
              onClick={() => setActiveTab('orders')}
            >
              <HiShoppingBag /> Orders
            </button>
          </div>
        </div>

        {activeTab === 'products' ? (
          <div className="flex flex-col gap-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <h3 className="text-[#f0e6ff] font-bold text-xl">Inventory <span className="text-[#6a0dad] text-sm font-medium ml-2">({products.length} Items)</span></h3>
                <div className="hidden md:flex items-center gap-3 bg-[#16162a] border border-[rgba(155,89,182,0.15)] rounded-full px-4 py-2 min-w-[300px]">
                  <HiSearch className="text-[#6a0dad]" />
                  <input 
                    type="text" 
                    placeholder="Search inventory..." 
                    className="bg-transparent border-none outline-none text-[#f0e6ff] text-sm w-full placeholder:text-[#7a6e8a]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <button 
                className="btn btn-primary h-[48px] px-8 gap-2"
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({
                    name: '', brand: '', description: '', price: 0, 
                    image: '', category: 'Unisex', volume: '100ml', stock: 50, featured: false
                  });
                  setShowProductModal(true);
                }}
              >
                <HiPlus /> Add Product
              </button>
            </div>
            
            <div className="bg-gradient-card border border-[rgba(155,89,182,0.15)] rounded-2xl overflow-hidden backdrop-blur-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[rgba(155,89,182,0.1)] bg-[#16162a]/50">
                      <th className="p-6 text-[#7a6e8a] text-[0.7rem] uppercase tracking-widest font-bold">Image</th>
                      <th className="p-6 text-[#7a6e8a] text-[0.7rem] uppercase tracking-widest font-bold">Name</th>
                      <th className="p-6 text-[#7a6e8a] text-[0.7rem] uppercase tracking-widest font-bold">Brand</th>
                      <th className="p-6 text-[#7a6e8a] text-[0.7rem] uppercase tracking-widest font-bold">Price</th>
                      <th className="p-6 text-[#7a6e8a] text-[0.7rem] uppercase tracking-widest font-bold">Stock</th>
                      <th className="p-6 text-[#7a6e8a] text-[0.7rem] uppercase tracking-widest font-bold">Category</th>
                      <th className="p-6 text-[#7a6e8a] text-[0.7rem] uppercase tracking-widest font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(155,89,182,0.05)]">
                    {filteredProducts.map(p => (
                      <tr key={p._id} className="hover:bg-[#6a0dad]/5 transition-all">
                        <td className="p-6">
                           <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#0a0a0f] p-1 border border-[rgba(155,89,182,0.1)]">
                             <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                           </div>
                        </td>
                        <td className="p-6">
                           <p className="text-[#f0e6ff] font-bold text-sm flex items-center gap-2">
                             {p.name} {p.featured && <span className="text-[#c9a96e] text-xs">✦</span>}
                           </p>
                        </td>
                        <td className="p-6 text-[#b8a9cc] text-sm">{p.brand}</td>
                        <td className="p-6 text-white font-bold text-sm">${p.price.toFixed(2)}</td>
                        <td className="p-6">
                           <span className={`text-sm px-2 py-1 rounded ${p.stock < 10 ? 'text-red-400 bg-red-400/10' : 'text-[#7a6e8a]'}`}>{p.stock}</span>
                        </td>
                        <td className="p-6">
                          <span className="bg-[#6a0dad]/20 text-[#d4a5ff] px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wider border border-[#6a0dad]/30">{p.category}</span>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <button className="w-8 h-8 rounded-lg bg-[#b8a9cc]/10 text-[#b8a9cc] flex items-center justify-center hover:bg-[#6a0dad] hover:text-white transition-all" onClick={() => handleEdit(p)}><HiPencil /></button>
                            <button className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all" onClick={() => handleDelete(p._id)}><HiTrash /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 animate-fade-in-up">
            <h3 className="text-[#f0e6ff] font-bold text-xl">Recent Orders <span className="text-[#6a0dad] text-sm font-medium ml-2">({orders.length} Total)</span></h3>
            <div className="bg-gradient-card border border-[rgba(155,89,182,0.15)] rounded-2xl overflow-hidden backdrop-blur-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[rgba(155,89,182,0.1)] bg-[#16162a]/50">
                      <th className="p-6 text-[#7a6e8a] text-[0.7rem] uppercase tracking-widest font-bold">Order ID</th>
                      <th className="p-6 text-[#7a6e8a] text-[0.7rem] uppercase tracking-widest font-bold">Customer</th>
                      <th className="p-6 text-[#7a6e8a] text-[0.7rem] uppercase tracking-widest font-bold">Total</th>
                      <th className="p-6 text-[#7a6e8a] text-[0.7rem] uppercase tracking-widest font-bold">Status</th>
                      <th className="p-6 text-[#7a6e8a] text-[0.7rem] uppercase tracking-widest font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(155,89,182,0.05)]">
                    {orders.map(o => (
                      <tr key={o._id} className="hover:bg-[#6a0dad]/5 transition-all">
                        <td className="p-6 text-[#7a6e8a] text-xs font-mono font-bold tracking-wider">#{o._id.slice(-8).toUpperCase()}</td>
                        <td className="p-6">
                          <p className="text-[#f0e6ff] font-bold text-sm mb-0.5">{o.user?.name}</p>
                          <p className="text-[#7a6e8a] text-xs">{o.user?.email}</p>
                        </td>
                        <td className="p-6 text-[#d4a5ff] font-extrabold text-base">${o.totalPrice.toFixed(2)}</td>
                        <td className="p-6">
                          <span className={`px-4 py-1.5 rounded-full text-[0.7rem] font-bold uppercase tracking-widest border transition-all ${
                            o.status === 'delivered' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            o.status === 'shipped' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            o.status === 'processing' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                            'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="p-6">
                            <div className="flex items-center gap-3">
                              {o.status !== 'delivered' && (
                                <button className="flex items-center gap-2 px-4 py-2 bg-[#6a0dad]/10 text-[#d4a5ff] text-xs font-bold rounded-lg border border-[#6a0dad]/30 hover:bg-[#6a0dad] hover:text-white transition-all" onClick={() => handleUpdateOrderStatus(o._id, o.status === 'pending' ? 'processing' : o.status === 'processing' ? 'shipped' : 'delivered')}>
                                  <HiCheck /> Update Status
                                </button>
                              )}
                            </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 sm:p-12 transition-all">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowProductModal(false)}></div>
          <div className="bg-[#1a1a2e] border border-[rgba(155,89,182,0.2)] rounded-3xl w-full max-w-[800px] max-h-[90vh] overflow-y-auto relative z-20 shadow-2xl animate-fade-in-up">
            <div className="p-8 border-b border-[rgba(155,89,182,0.15)] flex items-center justify-between sticky top-0 bg-[#1a1a2e] z-10">
              <h3 className="font-['Playfair_Display'] text-2xl font-bold text-white">{editingProduct ? 'Edit' : 'New'} Product</h3>
              <button className="w-10 h-10 rounded-full bg-[#0a0a0f] text-[#7a6e8a] flex items-center justify-center hover:text-white transition-all" onClick={() => setShowProductModal(false)}><HiX className="text-2xl" /></button>
            </div>
            <form onSubmit={handleSubmitProduct} className="p-8 flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-[#7a6e8a] uppercase tracking-widest ml-1">Product Name</label>
                  <input type="text" className="w-full h-14 px-6 bg-[#0a0a0f]/50 border border-[rgba(155,89,182,0.15)] rounded-xl text-white text-sm focus:border-[#6a0dad] outline-none" required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-[#7a6e8a] uppercase tracking-widest ml-1">Brand</label>
                  <input type="text" className="w-full h-14 px-6 bg-[#0a0a0f]/50 border border-[rgba(155,89,182,0.15)] rounded-xl text-white text-sm focus:border-[#6a0dad] outline-none" required value={productForm.brand} onChange={e => setProductForm({...productForm, brand: e.target.value})} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#7a6e8a] uppercase tracking-widest ml-1">Description</label>
                <textarea className="w-full p-6 bg-[#0a0a0f]/50 border border-[rgba(155,89,182,0.15)] rounded-xl text-white text-sm focus:border-[#6a0dad] outline-none resize-none" required rows="4" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-[#7a6e8a] uppercase tracking-widest ml-1">Price ($)</label>
                  <input type="number" step="0.01" className="w-full h-14 px-6 bg-[#0a0a0f]/50 border border-[rgba(155,89,182,0.15)] rounded-xl text-white text-sm focus:border-[#6a0dad] outline-none" required value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-[#7a6e8a] uppercase tracking-widest ml-1">Stock Level</label>
                  <input type="number" className="w-full h-14 px-6 bg-[#0a0a0f]/50 border border-[rgba(155,89,182,0.15)] rounded-xl text-white text-sm focus:border-[#6a0dad] outline-none" required value={productForm.stock} onChange={e => setProductForm({...productForm, stock: Number(e.target.value)})} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-[#7a6e8a] uppercase tracking-widest ml-1">Category</label>
                  <select className="w-full h-14 px-6 bg-[#0a0a0f]/50 border border-[rgba(155,89,182,0.15)] rounded-xl text-white text-sm focus:border-[#6a0dad] outline-none cursor-pointer" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}>
                    <option value="Men" className="bg-[#1a1a2e]">Men</option>
                    <option value="Women" className="bg-[#1a1a2e]">Women</option>
                    <option value="Unisex" className="bg-[#1a1a2e]">Unisex</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#7a6e8a] uppercase tracking-widest ml-1">Image URL</label>
                <input type="text" className="w-full h-14 px-6 bg-[#0a0a0f]/50 border border-[rgba(155,89,182,0.15)] rounded-xl text-white text-sm focus:border-[#6a0dad] outline-none" value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} />
              </div>
              <label className="flex items-center gap-3 cursor-pointer group w-fit">
                <input type="checkbox" className="w-6 h-6 rounded bg-[#0a0a0f]/50 border border-[rgba(155,89,182,0.15)] checked:bg-[#6a0dad] appearance-none cursor-pointer relative checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-white" checked={productForm.featured} onChange={e => setProductForm({...productForm, featured: e.target.checked})} />
                <span className="text-sm font-medium text-[#7a6e8a] group-hover:text-[#f0e6ff] transition-all">Featured Product (appears on Home page)</span>
              </label>
              <button type="submit" className="btn btn-primary h-14 text-lg mt-4 shadow-xl shadow-[#6a0dad]/20">Save Product</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
