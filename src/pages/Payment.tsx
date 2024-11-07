import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Wallet } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

interface PaymentDetails {
  orderId: number;
  amount: number;
}

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<string>('Credit Card');
  const [loading, setLoading] = useState(false);
  const paymentDetails = location.state as PaymentDetails;

  useEffect(() => {
    if (!paymentDetails) {
      navigate('/cart');
    }
  }, [paymentDetails, navigate]);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await axios.post('http://localhost:8080/api/payments', {
        userId: user.id,
        orderId: paymentDetails.orderId,
        amount: paymentDetails.amount,
        method: paymentMethod
      });

      if (response.status === 200) {
        dispatch({ type: 'CLEAR_CART' });
        toast.success('Payment successful!');
        navigate('/payment-success', { 
          state: { 
            orderId: paymentDetails.orderId,
            amount: paymentDetails.amount 
          }
        });
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!paymentDetails) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between mb-2">
              <span>Order ID</span>
              <span>#{paymentDetails.orderId}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total Amount</span>
              <span>Rs.{paymentDetails.amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Select Payment Method</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              className={`p-4 border rounded-lg flex items-center ${
                paymentMethod === 'Credit Card'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200'
              }`}
              onClick={() => setPaymentMethod('Credit Card')}
            >
              <CreditCard className={`w-6 h-6 ${
                paymentMethod === 'Credit Card' ? 'text-orange-500' : 'text-gray-400'
              }`} />
              <span className="ml-2">Credit Card</span>
            </button>
            <button
              className={`p-4 border rounded-lg flex items-center ${
                paymentMethod === 'Wallet'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200'
              }`}
              onClick={() => setPaymentMethod('Wallet')}
            >
              <Wallet className={`w-6 h-6 ${
                paymentMethod === 'Wallet' ? 'text-orange-500' : 'text-gray-400'
              }`} />
              <span className="ml-2">Digital Wallet</span>
            </button>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-orange-500 text-white py-3 rounded-md hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : `Pay Rs.${paymentDetails.amount.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
};

export default Payment;