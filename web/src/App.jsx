import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import FragranceExplorer from './pages/FragranceExplorer';

// Protected Route — any logged-in user
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
  return children;
};

// Admin Route — redirects non-admins to /admin/login
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/admin/login" />;
  if (user.role !== 'admin') return <Navigate to="/admin/login" />;
  return children;
};

// Inner app — needs access to location for layout decisions
const AppInner = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const isAdminPage = location.pathname.startsWith('/admin');

  // If user is admin and NOT on an admin page, force them to the admin dashboard
  // This ensures admins only see the admin platform.
  useEffect(() => {
    if (!loading && user && user.role === 'admin' && !isAdminPage) {
      navigate('/admin');
    }
  }, [user, loading, isAdminPage, navigate, location.pathname]);

  if (loading) return null;

  return (
    <div className={isAdminPage ? '' : 'flex flex-col min-h-screen'}>
      <Toaster position="top-right" />
      {!isAdminPage && <Navbar />}
      <main className={isAdminPage ? '' : 'flex-grow pt-0'}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/explore" element={<FragranceExplorer />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth isRegister />} />

          {/* Protected user routes */}
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

          {/* Admin routes — no Navbar/Footer */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
          <Route path="/admin/*" element={<AdminRoute><Admin /></AdminRoute>} />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppInner />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
