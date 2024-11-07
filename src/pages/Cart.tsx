import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Cart = () => {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      dispatch({ type: 'REMOVE_ITEM', payload: itemId });
    } else {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { id: itemId, quantity: newQuantity }
      });
    }
  };

  const handleRemoveItem = (itemId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
    toast.success('Item removed from cart');
  };

  const cartTotal = state.items.reduce((total, item) => total + (item.Price * item.Quantity), 0);
  const deliveryFee = 5.00;
  const totalAmount = cartTotal + deliveryFee;

  const handleCheckout = async () => {
    if (!user.id) {
      toast.error('Please login to place order');
      navigate('/login');
      return;
    }

    try {
      const orderData = {
        userId: user.id,
        restaurantId: state.restaurantId,
        items: state.items.map(item => ({
          menuItemId: item.Menu_Item_ID,
          quantity: item.Quantity
        })),
        deliveryType: 'Delivery',
        totalAmount
      };

      const response = await axios.post('http://localhost:8080/api/orders', orderData);
      
      if (response.status === 200) {
        dispatch({ type: 'CLEAR_CART' });
        toast.success('Order placed successfully!');
        navigate('/');
      }
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

      {state.items.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h3>
          <p className="mt-1 text-gray-500">Start adding some delicious items!</p>
          <div className="mt-6">
            <Link
              to="/restaurants"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600"
            >
              Browse Restaurants
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {state.items.map((item) => (
                <div key={item.Menu_Item_ID} className="p-4 border-b last:border-b-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{item.Name}</h3>
                      <p className="text-gray-600">Rs.{item.Price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-1 rounded-full bg-orange-500 text-white hover:bg-orange-600"
                          onClick={() => handleUpdateQuantity(item.Menu_Item_ID, item.Quantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-medium">{item.Quantity}</span>
                        <button
                          className="p-1 rounded-full bg-orange-500 text-white hover:bg-orange-600"
                          onClick={() => handleUpdateQuantity(item.Menu_Item_ID, item.Quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.Menu_Item_ID)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">Rs.{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="text-gray-900">Rs.{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-semibold">Rs.{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;