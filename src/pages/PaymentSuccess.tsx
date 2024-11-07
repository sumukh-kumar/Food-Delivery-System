import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

interface PaymentSuccessState {
  orderId: number;
  amount: number;
}

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const paymentDetails = location.state as PaymentSuccessState;

  useEffect(() => {
    if (!paymentDetails) {
      navigate('/');
    }
  }, [paymentDetails, navigate]);

  if (!paymentDetails) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">Thank you for your order.</p>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-4">
            <p className="text-gray-600">Order ID</p>
            <p className="text-xl font-semibold">#{paymentDetails.orderId}</p>
          </div>
          <div>
            <p className="text-gray-600">Amount Paid</p>
            <p className="text-xl font-semibold">Rs.{paymentDetails.amount.toFixed(2)}</p>
          </div>
        </div>

        <Link
          to="/restaurants"
          className="inline-block bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;