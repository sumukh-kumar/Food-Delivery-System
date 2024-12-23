import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, LogOut, ClipboardList } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  user: {
    name: string;
    isAdmin: boolean;
  } | null;
  setUser: (user: any) => void;
}

const Navbar = ({ user, setUser }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useCart();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login', { replace: true });
  };

  const cartItemCount = state.items.reduce((total, item) => total + item.Quantity, 0);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-orange-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">Hungry</span>
            </Link>
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.isAdmin && (
                  <>
                    <Link
                      to="/admin"
                      className={`text-gray-700 hover:text-gray-900 ${
                        location.pathname === '/admin' ? 'text-orange-500' : ''
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/orders"
                      className={`flex items-center text-gray-700 hover:text-gray-900 ${
                        location.pathname === '/admin/orders' ? 'text-orange-500' : ''
                      }`}
                    >
                      <ClipboardList className="h-5 w-5 mr-1" />
                      Orders
                    </Link>
                  </>
                )}
                <span className="text-gray-700">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-gray-900"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center text-gray-700 hover:text-gray-900"
              >
                <User className="h-6 w-6" />
              </Link>
            )}
            {!user?.isAdmin && location.pathname !== '/cart' && (
              <Link
                to="/cart"
                className="ml-4 p-2 text-gray-400 hover:text-gray-500 relative"
              >
                <ShoppingBag className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-orange-500 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;