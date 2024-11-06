import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart3, Users, DollarSign, TrendingUp } from 'lucide-react';

interface Analytics {
  totalOrders: number;
  totalRevenue: number;
  popularItems: Array<{
    Name: string;
    orderCount: number;
  }>;
}

interface Restaurant {
  id: string;
  name: string;
  location: string;
  cuisine: string;
  rating: number;
}

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalOrders: 0,
    totalRevenue: 0,
    popularItems: []
  });
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData?.restaurant) {
      setRestaurant(userData.restaurant);
      fetchAnalytics(userData.restaurant.id);
    }
  }, []);

  const fetchAnalytics = async (restaurantId: string) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/admin/analytics/${restaurantId}`);
      const data = response.data;
      
      setAnalytics({
        totalOrders: Number(data.totalOrders) || 0,
        totalRevenue: Number(data.totalRevenue) || 0,
        popularItems: data.popularItems || []
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  if (!restaurant) {
    return <div>Loading...</div>;
  }

  const averageOrderValue = analytics.totalOrders > 0 
    ? (analytics.totalRevenue / analytics.totalOrders) 
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Restaurant Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back to {restaurant.name}</p>
      </div>

      {/* Restaurant Info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Restaurant Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Location: {restaurant.location}</p>
            <p className="text-gray-600">Cuisine: {restaurant.cuisine}</p>
          </div>
          <div>
            <p className="text-gray-600">Rating: {restaurant.rating} ⭐</p>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${analytics.totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Order Value</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${averageOrderValue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Items */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <TrendingUp className="h-6 w-6 text-orange-500" />
          <h2 className="text-xl font-semibold ml-2">Popular Items</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analytics.popularItems.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.Name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.orderCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;