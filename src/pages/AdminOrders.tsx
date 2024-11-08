import { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface OrderItem {
  Menu_Item_ID: number;
  Name: string;
  Quantity: number;
  Price: number;
}

interface Order {
  OrderID: number;
  UserID: number;
  Status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  Date: string;
  Total_Amount: number;
  Delivery_Pickup: 'Delivery' | 'Pickup';
  User_Name: string;
  User_Phone: string;
  User_Address: string;
  items: OrderItem[];
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'completed'>('all');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/admin/orders/${user.restaurant.id}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    }
  };

  const handleUpdateStatus = async (orderId: number, newStatus: Order['Status']) => {
    try {
      await axios.put(`http://localhost:8080/api/admin/orders/${orderId}/status`, {
        status: newStatus
      });
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'pending') return order.Status === 'Pending';
    if (filter === 'processing') return order.Status === 'Processing';
    if (filter === 'completed') return order.Status === 'Completed';
    return true;
  });

  const getStatusColor = (status: Order['Status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No orders found
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <div key={order.OrderID} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-4">
                      <h3 className="text-lg font-semibold">Order #{order.OrderID}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.Status)}`}>
                        {order.Status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(order.Date).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">Rs.{order.Total_Amount}</p>
                    <p className="text-sm text-gray-600">{order.Delivery_Pickup}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Customer Details</h4>
                  <p className="text-sm text-gray-600">{order.User_Name}</p>
                  <p className="text-sm text-gray-600">{order.User_Phone}</p>
                  <p className="text-sm text-gray-600">{order.User_Address}</p>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Order Items</h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.Menu_Item_ID} className="flex justify-between text-sm">
                        <span>{item.Name} x {item.Quantity}</span>
                        {/* <span>Rs.{(item.Price * item.Quantity)}</span> */}
                      </div>
                    ))}
                  </div>
                </div>

                {order.Status !== 'Completed' && order.Status !== 'Cancelled' && (
                  <div className="flex justify-end gap-2">
                    {order.Status === 'Pending' && (
                      <button
                        onClick={() => handleUpdateStatus(order.OrderID, 'Processing')}
                        className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Mark as Processing
                      </button>
                    )}
                    {order.Status === 'Processing' && (
                      <button
                        onClick={() => handleUpdateStatus(order.OrderID, 'Completed')}
                        className="flex items-center px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Mark as Completed
                      </button>
                    )}
                    <button
                      onClick={() => handleUpdateStatus(order.OrderID, 'Cancelled')}
                      className="flex items-center px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;