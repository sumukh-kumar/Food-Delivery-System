import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home.tsx';
import RestaurantList from './pages/RestaurantList.tsx';
import RestaurantDetail from './pages/RestaurantDetail.tsx';
import Cart from './pages/Cart.tsx';
import Login from './pages/Login';
import Register from './pages/Register.tsx';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Toaster position="top-center" />
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/restaurants" element={<RestaurantList />} />
            <Route path="/restaurant/:id" element={<RestaurantDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;