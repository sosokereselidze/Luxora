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
    <div className="bg-bg-dark min-h-screen pt-32 animate-fade-in px-6">
      <div className="container mx-auto py-12">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8 bg-white/[0.01] border border-white/5 p-8 md:p-12 backdrop-blur-3xl">
          <div className="flex flex-col gap-3">
            <h1 className="font-display text-3xl md:text-4xl font-normal text-white">Admin Management</h1>
            <p className="text-text-secondary text-sm font-light">Manage your boutique's inventory and orders.</p>
          </div>
          <div className="flex items-center gap-4 bg-white/[0.01] p-2 border border-white/5 w-full md:w-auto overflow-x-auto">
            <button 
              className={`flex items-center gap-3 px-8 py-3 text-sm font-bold uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === 'products' ? 'bg-white text-black' : 'text-white/40 hover:text-white hover:bg-white/[0.02]'}`}
              onClick={() => setActiveTab('products')}
            >
              <HiAdjustments className="text-lg" /> Products
            </button>
            <button 
              className={`flex items-center gap-3 px-8 py-3 text-sm font-bold uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === 'orders' ? 'bg-white text-black' : 'text-white/40 hover:text-white hover:bg-white/[0.02]'}`}
              onClick={() => setActiveTab('orders')}
            >
              <HiShoppingBag className="text-lg" /> Orders
            </button>
          </div>
        </div>

        {activeTab === 'products' ? (
          <div className="flex flex-col gap-10 animate-fade-in-up">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full lg:w-auto">
                <h3 className="text-white font-display text-2xl">Inventory <span className="text-white/30 text-sm font-body tracking-wider ml-3">({products.length} Items)</span></h3>
                <div className="flex items-center gap-4 bg-white/[0.02] border border-white/10 px-5 py-3 w-full sm:w-[350px]">
                  <HiSearch className="text-white/30 text-lg" />
                  <input 
                    type="text" 
                    placeholder="Search inventory..." 
                    className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-white/30 font-light"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <button 
                className="btn btn-primary h-[50px] px-8 gap-3"
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({
                    name: '', brand: '', description: '', price: 0, 
                    image: '', category: 'Unisex', volume: '100ml', stock: 50, featured: false
                  });
                  setShowProductModal(true);
                }}
              >
                <HiPlus className="text-lg" /> Add Product
              </button>
            </div>
            
            <div className="bg-white/[0.01] border border-white/5 overflow-hidden backdrop-blur-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="p-6 text-white/40 text-[0.65rem] uppercase tracking-[0.3em] font-bold">Image</th>
                      <th className="p-6 text-white/40 text-[0.65rem] uppercase tracking-[0.3em] font-bold">Name</th>
                      <th className="p-6 text-white/40 text-[0.65rem] uppercase tracking-[0.3em] font-bold">Brand</th>
                      <th className="p-6 text-white/40 text-[0.65rem] uppercase tracking-[0.3em] font-bold">Price</th>
                      <th className="p-6 text-white/40 text-[0.65rem] uppercase tracking-[0.3em] font-bold">Stock</th>
                      <th className="p-6 text-white/40 text-[0.65rem] uppercase tracking-[0.3em] font-bold">Category</th>
                      <th className="p-6 text-white/40 text-[0.65rem] uppercase tracking-[0.3em] font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredProducts.map(p => (
                      <tr key={p._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-6">
                           <div className="w-14 h-14 bg-white/[0.02] p-2 border border-white/5 flex items-center justify-center">
                             <img src={p.image} alt={p.name} className="max-w-full max-h-full object-contain" />
                           </div>
                        </td>
                        <td className="p-6">
                           <p className="text-white font-display text-lg flex items-center gap-3">
                             {p.name} {p.featured && <span className="text-accent-gold text-sm animate-pulse">✦</span>}
                           </p>
                        </td>
                        <td className="p-6 text-text-secondary font-luxury text-[0.6rem] uppercase tracking-[0.3em]">{p.brand}</td>
                        <td className="p-6 text-white font-body tracking-wider">${p.price.toFixed(2)}</td>
                        <td className="p-6">
                           <span className={`text-[0.7rem] font-bold tracking-widest px-3 py-1 ${p.stock < 10 ? 'text-red-400 bg-red-400/10 border border-red-400/20' : 'text-white/50 bg-white/[0.02] border border-white/5'}`}>{p.stock}</span>
                        </td>
                        <td className="p-6">
                          <span className="bg-white/[0.02] text-text-secondary px-4 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.2em] border border-white/10">{p.category}</span>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <button className="text-white/30 hover:text-white transition-all text-lg" onClick={() => handleEdit(p)} title="Edit"><HiPencil /></button>
                            <button className="text-white/30 hover:text-red-400 transition-all text-lg" onClick={() => handleDelete(p._id)} title="Delete"><HiTrash /></button>
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
          <div className="flex flex-col gap-10 animate-fade-in-up">
            <h3 className="text-white font-display text-2xl">Recent Orders <span className="text-white/30 text-sm font-body tracking-wider ml-3">({orders.length} Total)</span></h3>
            <div className="bg-white/[0.01] border border-white/5 overflow-hidden backdrop-blur-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="p-6 text-white/40 text-[0.65rem] uppercase tracking-[0.3em] font-bold">Order ID</th>
                      <th className="p-6 text-white/40 text-[0.65rem] uppercase tracking-[0.3em] font-bold">Customer</th>
                      <th className="p-6 text-white/40 text-[0.65rem] uppercase tracking-[0.3em] font-bold">Total</th>
                      <th className="p-6 text-white/40 text-[0.65rem] uppercase tracking-[0.3em] font-bold">Status</th>
                      <th className="p-6 text-white/40 text-[0.65rem] uppercase tracking-[0.3em] font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map(o => (
                      <tr key={o._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-6 text-white/50 text-[0.65rem] uppercase font-bold tracking-[0.2em]">LX-{o._id.slice(-6).toUpperCase()}</td>
                        <td className="p-6">
                          <p className="text-white font-bold text-sm mb-1">{o.user?.name}</p>
                          <p className="text-text-secondary text-xs tracking-wider">{o.user?.email}</p>
                        </td>
                        <td className="p-6 text-white font-body tracking-widest">${o.totalPrice.toFixed(2)}</td>
                        <td className="p-6">
                          <span className={`px-4 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.2em] border transition-all ${
                            o.status === 'delivered' ? 'bg-white/5 text-white/70 border-white/20' :
                            o.status === 'shipped' ? 'bg-white/5 text-white/50 border-white/10' :
                            o.status === 'processing' ? 'bg-accent-gold/10 text-accent-gold border-accent-gold/20' :
                            'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="p-6">
                            <div className="flex items-center gap-3">
                              {o.status !== 'delivered' && (
                                <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] text-white/50 text-[0.6rem] uppercase tracking-[0.2em] font-bold border border-white/10 hover:bg-white hover:text-black hover:border-white transition-all" onClick={() => handleUpdateOrderStatus(o._id, o.status === 'pending' ? 'processing' : o.status === 'processing' ? 'shipped' : 'delivered')}>
                                  <HiCheck className="text-sm" /> Update Status
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
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 lg:p-12 transition-all">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowProductModal(false)}></div>
          <div className="bg-bg-dark border border-white/10 w-full max-w-[800px] max-h-[90vh] overflow-y-auto relative z-20 shadow-2xl animate-fade-in-up">
            <div className="p-8 border-b border-white/5 flex items-center justify-between sticky top-0 bg-bg-dark z-10">
              <h3 className="font-display text-2xl md:text-3xl text-white">{editingProduct ? 'Edit Product' : 'New Product'}</h3>
              <button className="text-white/30 hover:text-white transition-all text-2xl" onClick={() => setShowProductModal(false)}><HiX /></button>
            </div>
            <form onSubmit={handleSubmitProduct} className="p-8 flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-[0.6rem] font-bold text-white/50 uppercase tracking-[0.3em] ml-1">Product Name</label>
                  <input type="text" className="input-field" required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} placeholder="E.g. Velvet Orchid" />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[0.6rem] font-bold text-white/50 uppercase tracking-[0.3em] ml-1">Brand</label>
                  <input type="text" className="input-field font-luxury uppercase tracking-[0.3em]" required value={productForm.brand} onChange={e => setProductForm({...productForm, brand: e.target.value})} placeholder="LUXORA" />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[0.6rem] font-bold text-white/50 uppercase tracking-[0.3em] ml-1">Description</label>
                <textarea className="w-full p-6 bg-white/[0.02] border border-white/10 text-white text-sm focus:border-white/30 outline-none resize-none font-light leading-relaxed placeholder:text-white/20" required rows="4" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} placeholder="Describe the fragrance notes..."></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-[0.6rem] font-bold text-white/50 uppercase tracking-[0.3em] ml-1">Price ($)</label>
                  <input type="number" step="0.01" className="input-field font-body tracking-widest" required value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[0.6rem] font-bold text-white/50 uppercase tracking-[0.3em] ml-1">Stock Level</label>
                  <input type="number" className="input-field font-body tracking-wider" required value={productForm.stock} onChange={e => setProductForm({...productForm, stock: Number(e.target.value)})} />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[0.6rem] font-bold text-white/50 uppercase tracking-[0.3em] ml-1">Category</label>
                  <select className="input-field cursor-pointer appearance-none" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}>
                    <option value="Men" className="bg-bg-dark text-white">Pour Homme (Men)</option>
                    <option value="Women" className="bg-bg-dark text-white">Pour Femme (Women)</option>
                    <option value="Unisex" className="bg-bg-dark text-white">L'Universel (Unisex)</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[0.6rem] font-bold text-white/50 uppercase tracking-[0.3em] ml-1">Image URL</label>
                <input type="text" className="input-field font-light text-[0.7rem]" value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} placeholder="https://example.com/image.jpg" />
              </div>
              <label className="flex items-center gap-4 cursor-pointer group w-fit mt-2">
                <input type="checkbox" className="w-5 h-5 bg-white/[0.02] border border-white/20 checked:bg-white checked:border-white appearance-none cursor-pointer relative checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-black checked:after:text-xs checked:after:font-bold transition-all" checked={productForm.featured} onChange={e => setProductForm({...productForm, featured: e.target.checked})} />
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white/50 group-hover:text-white transition-all">Featured Product (appears on Home page)</span>
              </label>
              
              <div className="border-t border-white/5 mt-4 pt-8 flex justify-end gap-4">
                <button type="button" className="btn btn-outline border-white/10 hover:bg-white/5" onClick={() => setShowProductModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
