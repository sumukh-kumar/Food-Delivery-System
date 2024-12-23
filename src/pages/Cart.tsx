import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Cart() {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [deliveryType, setDeliveryType] = useState<'Delivery' | 'Pickup'>('Delivery');
  const [couponCode, setCouponCode] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);

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
  const tax = 0.25 * cartTotal;
  const deliveryFee = deliveryType === 'Delivery' ? 50 : 0;
  const discount = isCouponApplied ? cartTotal * 0.1 : 0;
  const totalAmount = cartTotal + tax + deliveryFee - discount;

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'discount10') {
      setIsCouponApplied(true);
      toast.success('Coupon applied successfully!');
    } else {
      toast.error('Invalid coupon code');
    }
  };

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
        deliveryType,
        totalAmount,
        discount: isCouponApplied ? discount : 0
      };

      const response = await axios.post('http://localhost:8080/api/orders', orderData);
      
      if (response.status === 200) {
        navigate('/payment', { 
          state: { 
            orderId: response.data.orderId,
            amount: totalAmount
          }
        });
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
                  <span className="text-gray-600">Taxes</span>
                  <span className="text-gray-900">Rs.{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="text-gray-900">Rs.{deliveryFee.toFixed(2)}</span>
                </div>
                {isCouponApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (10%)</span>
                    <span>-Rs.{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-semibold">Rs.{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-gray-700 font-medium">Delivery Option</label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-orange-500"
                        name="deliveryType"
                        value="Delivery"
                        checked={deliveryType === 'Delivery'}
                        onChange={() => setDeliveryType('Delivery')}
                      />
                      <span className="ml-2">Delivery</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-orange-500"
                        name="deliveryType"
                        value="Pickup"
                        checked={deliveryType === 'Pickup'}
                        onChange={() => setDeliveryType('Pickup')}
                      />
                      <span className="ml-2">Pickup</span>
                    </label>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="coupon" className="text-gray-700 font-medium">
                    Apply Coupon
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      id="coupon"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      Apply
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
}