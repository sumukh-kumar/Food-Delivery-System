import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home.tsx';
import RestaurantList from './pages/RestaurantList.tsx';
import RestaurantDetail from './pages/RestaurantDetail.tsx';
import Cart from './pages/Cart.tsx';
import Payment from './pages/Payment.tsx';
import PaymentSuccess from './pages/PaymentSuccess.tsx';
import Login from './pages/Login';
import Register from './pages/Register.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import AdminOrders from './pages/AdminOrders.tsx';
import About from './pages/About.tsx';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  restaurant?: {
    id: string;
    name: string;
    location: string;
    cuisine: string;
    rating: number;
  };
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user || !user.isAdmin) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    if (user?.isAdmin) {
      return <Navigate to="/admin" replace />;
    }
    return <>{children}</>;
  };

  return (
    <CartProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Toaster position="top-center" />
          <Navbar user={user} setUser={setUser} />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
              <Route path="/restaurants" element={<PublicRoute><RestaurantList /></PublicRoute>} />
              <Route path="/restaurant/:id" element={<PublicRoute><RestaurantDetail /></PublicRoute>} />
              <Route path="/cart" element={<PublicRoute><Cart /></PublicRoute>} />
              <Route path="/payment" element={<PublicRoute><Payment /></PublicRoute>} />
              <Route path="/payment-success" element={<PublicRoute><PaymentSuccess /></PublicRoute>} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                } 
              />
              <Route 
                path="/admin/orders" 
                element={
                  <ProtectedAdminRoute>
                    <AdminOrders />
                  </ProtectedAdminRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;