import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/products';
import { getAllOrders, updateOrderStatus } from '../api/orders';
import Loading from '../components/Loading';
import { HiPlus, HiPencil, HiTrash, HiCheck, HiX, HiAdjustments, HiShoppingBag, HiTrendingUp } from 'react-icons/hi';
import './Admin.css';
import toast from 'react-hot-toast';

const Admin = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
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

  const updateOrderStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      toast.success('Order status updated');
      fetchData();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  if (loading) return <Loading fullPage />;

  return (
    <div className="admin-page pt-nav">
      <div className="container section">
        <div className="admin-header">
          <h1 className="admin-title">Admin Management</h1>
          <div className="admin-tabs">
            <button 
              className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <HiAdjustments /> Products
            </button>
            <button 
              className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <HiShoppingBag /> Orders
            </button>
          </div>
        </div>

        {activeTab === 'products' ? (
          <div className="admin-content">
            <div className="content-toolbar">
              <h3>Inventory ({products.length})</h3>
              <button 
                className="btn btn-primary"
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
            
            <div className="admin-table-wrapper glass-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id}>
                      <td><img src={p.image} alt={p.name} className="table-img" /></td>
                      <td className="font-600">{p.name} {p.featured && '✦'}</td>
                      <td>{p.brand}</td>
                      <td>${p.price.toFixed(2)}</td>
                      <td>{p.stock}</td>
                      <td><span className="badge badge-purple">{p.category}</span></td>
                      <td className="actions-cell">
                        <button className="icon-btn-edit" onClick={() => handleEdit(p)}><HiPencil /></button>
                        <button className="icon-btn-delete" onClick={() => handleDelete(p._id)}><HiTrash /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="admin-content">
            <h3>Recent Orders ({orders.length})</h3>
            <div className="admin-table-wrapper glass-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id}>
                      <td className="order-id">#{o._id.slice(-8).toUpperCase()}</td>
                      <td>
                        <p className="font-600">{o.user?.name}</p>
                        <p className="text-muted text-xs">{o.user?.email}</p>
                      </td>
                      <td className="text-accent font-700">${o.totalPrice.toFixed(2)}</td>
                      <td>
                        <span className={`status-badge status-${o.status}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="actions-cell">
                        {o.status === 'pending' && <button className="icon-btn-ok" title="Confirm order" onClick={() => updateOrderStatus(o._id, 'processing')}><HiCheck /></button>}
                        {o.status === 'processing' && <button className="icon-btn-ok" title="Ship order" onClick={() => updateOrderStatus(o._id, 'shipped')}><HiCheck /></button>}
                        {o.status === 'shipped' && <button className="icon-btn-ok" title="Mark delivered" onClick={() => updateOrderStatus(o._id, 'delivered')}><HiCheck /></button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Mock */}
      {showProductModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card animate-slide-down">
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit' : 'New'} Product</h3>
              <button className="close-btn" onClick={() => setShowProductModal(false)}><HiX /></button>
            </div>
            <form onSubmit={handleSubmitProduct} className="modal-form">
              <div className="form-row">
                <div className="input-group">
                  <label>Name</label>
                  <input type="text" className="input-field" required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Brand</label>
                  <input type="text" className="input-field" required value={productForm.brand} onChange={e => setProductForm({...productForm, brand: e.target.value})} />
                </div>
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea className="input-field" required rows="3" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />
              </div>
              <div className="form-row-3">
                <div className="input-group">
                  <label>Price ($)</label>
                  <input type="number" step="0.01" className="input-field" required value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} />
                </div>
                <div className="input-group">
                  <label>Stock</label>
                  <input type="number" className="input-field" required value={productForm.stock} onChange={e => setProductForm({...productForm, stock: Number(e.target.value)})} />
                </div>
                <div className="input-group">
                  <label>Category</label>
                  <select className="input-field" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label>Image URL</label>
                <input type="text" className="input-field" value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} />
              </div>
              <div className="input-group-check">
                <input type="checkbox" id="featured" checked={productForm.featured} onChange={e => setProductForm({...productForm, featured: e.target.checked})} />
                <label htmlFor="featured">Featured Product (appears on Home page)</label>
              </div>
              <button type="submit" className="btn btn-primary btn-lg mt-10">Save Product</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
