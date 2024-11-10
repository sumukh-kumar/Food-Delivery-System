import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart3, Users, DollarSign, Edit, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

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
  image_url?: string;
}

interface MenuItem {
  Menu_Item_ID: number;
  Name: string;
  Description: string;
  Price: number;
  Category: string;
  Veg_NonVeg: 'Veg' | 'Non-Veg';
  Image_URL: string;
  In_Stock: boolean;
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalOrders: 0,
    totalRevenue: 0,
    popularItems: []
  });
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isEditingRestaurant, setIsEditingRestaurant] = useState(false);
  const [isAddingMenuItem, setIsAddingMenuItem] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [restaurantForm, setRestaurantForm] = useState({
    name: '',
    location: '',
    cuisine: '',
    image_url: ''
  });
  const [menuItemForm, setMenuItemForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    veg_nonveg: 'Veg',
    image_url: '',
    in_stock: true
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData?.restaurant) {
      setRestaurant(userData.restaurant);
      setRestaurantForm({
        name: userData.restaurant.name,
        location: userData.restaurant.location,
        cuisine: userData.restaurant.cuisine,
        image_url: userData.restaurant.image_url || ''
      });
      fetchAnalytics(userData.restaurant.id);
      fetchMenuItems(userData.restaurant.id);
    }
  }, []);

  const fetchAnalytics = async (restaurantId: string) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/admin/analytics/${restaurantId}`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchMenuItems = async (restaurantId: string) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/restaurants/${restaurantId}/menu`);
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast.error('Failed to fetch menu items');
    }
  };

  const handleToggleAvailability = async (menuItemId: number, currentStatus: boolean) => {
    try {
      const menuItem = menuItems.find(item => item.Menu_Item_ID === menuItemId);
      if (!menuItem) {
        throw new Error('Menu item not found');
      }

      await axios.put(`http://localhost:8080/api/admin/menu-item/${menuItemId}`, {
        name: menuItem.Name,
        description: menuItem.Description,
        price: menuItem.Price,
        category: menuItem.Category,
        veg_nonveg: menuItem.Veg_NonVeg,
        image_url: menuItem.Image_URL,
        in_stock: !currentStatus
      });
      
      toast.success(`Item marked as ${!currentStatus ? 'available' : 'unavailable'}`);
      if (restaurant?.id) {
        fetchMenuItems(restaurant.id);
      }
    } catch (error) {
      console.error('Error updating item availability:', error);
      toast.error('Failed to update availability');
    }
  };

  const handleUpdateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/admin/restaurant/${restaurant?.id}`, restaurantForm);
      toast.success('Restaurant details updated successfully');
      setIsEditingRestaurant(false);
      // Update local storage with new restaurant details
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      userData.restaurant = { ...userData.restaurant, ...restaurantForm };
      localStorage.setItem('user', JSON.stringify(userData));
      setRestaurant({ ...restaurant!, ...restaurantForm });
    } catch (error) {
      toast.error('Failed to update restaurant details');
    }
  };

  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurant?.id) {
      toast.error('Restaurant ID not found');
      return;
    }

    try {
      const payload = {
        ...menuItemForm,
        price: parseFloat(menuItemForm.price)
      };

      await axios.post(`http://localhost:8080/api/admin/restaurant/${restaurant.id}/menu`, payload);
      toast.success('Menu item added successfully');
      setIsAddingMenuItem(false);
      
      // Reset form
      setMenuItemForm({
        name: '',
        description: '',
        price: '',
        category: '',
        veg_nonveg: 'Veg',
        image_url: '',
        in_stock: true
      });

      // Fetch updated menu items
      await fetchMenuItems(restaurant.id);
    } catch (error) {
      console.error('Error adding menu item:', error);
      toast.error('Failed to add menu item');
    }
  };

  const handleUpdateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurant?.id || !editingMenuItem) {
      toast.error('Required information missing');
      return;
    }

    try {
      const payload = {
        ...menuItemForm,
        price: parseFloat(menuItemForm.price)
      };

      await axios.put(`http://localhost:8080/api/admin/menu-item/${editingMenuItem.Menu_Item_ID}`, payload);
      toast.success('Menu item updated successfully');
      setEditingMenuItem(null);
      
      // Fetch updated menu items
      await fetchMenuItems(restaurant.id);
    } catch (error) {
      console.error('Error updating menu item:', error);
      toast.error('Failed to update menu item');
    }
  };

  const handleDeleteMenuItem = async (menuItemId: number) => {
    if (!restaurant?.id) {
      toast.error('Restaurant ID not found');
      return;
    }

    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await axios.delete(`http://localhost:8080/api/admin/menu-item/${menuItemId}`);
        toast.success('Menu item deleted successfully');
        await fetchMenuItems(restaurant.id);
      } catch (error) {
        console.error('Error deleting menu item:', error);
        toast.error('Failed to delete menu item');
      }
    }
  };

  if (!restaurant) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
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
        {isEditingRestaurant ? (
          <form onSubmit={handleUpdateRestaurant} className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Edit Restaurant Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Restaurant Name</label>
              <input
                type="text"
                value={restaurantForm.name}
                onChange={(e) => setRestaurantForm({ ...restaurantForm, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={restaurantForm.location}
                onChange={(e) => setRestaurantForm({ ...restaurantForm, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cuisine</label>
              <input
                type="text"
                value={restaurantForm.cuisine}
                onChange={(e) => setRestaurantForm({ ...restaurantForm, cuisine: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="url"
                value={restaurantForm.image_url}
                onChange={(e) => setRestaurantForm({ ...restaurantForm, image_url: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsEditingRestaurant(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Restaurant Information</h2>
              <button
                onClick={() => setIsEditingRestaurant(true)}
                className="flex items-center text-orange-500 hover:text-orange-600"
              >
                <Edit className="h-5 w-5 mr-1" />
                Edit
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Location: {restaurant.location}</p>
                <p className="text-gray-600">Cuisine: {restaurant.cuisine}</p>
              </div>
              <div>
                <p className="text-gray-600">Rating: {restaurant.rating} ⭐⭐⭐⭐⭐  5</p>
              </div>
            </div>
          </div>
        )}
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
                Rs.{analytics.totalRevenue.toFixed(2)}
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
                Rs.{averageOrderValue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items Management */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Menu Items</h2>
          <button
            onClick={() => setIsAddingMenuItem(true)}
            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600"
          >
            <Plus className="h-5 w-5 mr-1" />
            Add Menu Item
          </button>
        </div>

        {isAddingMenuItem && (
          <div className="mb-8 p-4 border rounded-lg">
            <form onSubmit={handleAddMenuItem} className="space-y-4">
              <h3 className="text-lg font-medium">Add New Menu Item</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={menuItemForm.name}
                    onChange={(e) => setMenuItemForm({ ...menuItemForm, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    value={menuItemForm.price}
                    onChange={(e) => setMenuItemForm({ ...menuItemForm, price: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    value={menuItemForm.category}
                    onChange={(e) => setMenuItemForm({ ...menuItemForm, category: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    value={menuItemForm.veg_nonveg}
                    onChange={(e) => setMenuItemForm({ ...menuItemForm, veg_nonveg: e.target.value as 'Veg' | 'Non-Veg' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  >
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={menuItemForm.description}
                    onChange={(e) => setMenuItemForm({ ...menuItemForm, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    rows={3}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Image URL</label>
                  <input
                    type="url"
                    value={menuItemForm.image_url}
                    onChange={(e) => setMenuItemForm({ ...menuItemForm, image_url: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsAddingMenuItem(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Availability
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {menuItems.map((item) => (
                <tr key={item.Menu_Item_ID}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={item.Image_URL || 'https://via.placeholder.com/40'}
                          alt={item.Name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.Name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.Category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Rs.{item.Price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.Veg_NonVeg === 'Veg' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.Veg_NonVeg}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleAvailability(item.Menu_Item_ID, item.In_Stock)}
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.In_Stock
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {item.In_Stock ? 'Available' : 'Unavailable'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingMenuItem(item);
                        setMenuItemForm({
                          name: item.Name,
                          description: item.Description,
                          price: item.Price.toString(),
                          category: item.Category,
                          veg_nonveg: item.Veg_NonVeg,
                          image_url: item.Image_URL,
                          in_stock: item.In_Stock
                        });
                      }}
                      className="text-orange-500 hover:text-orange-600 mr-4"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMenuItem(item.Menu_Item_ID)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Menu Item Modal */}
        {editingMenuItem && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <form onSubmit={handleUpdateMenuItem} className="space-y-4">
                <h3 className="text-lg font-medium">Edit Menu Item</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={menuItemForm.name}
                      onChange={(e) => setMenuItemForm({ ...menuItemForm, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                      type="number"
                      value={menuItemForm.price}
                      onChange={(e) => setMenuItemForm({ ...menuItemForm, price: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <input
                      type="text"
                      value={menuItemForm.category}
                      onChange={(e) => setMenuItemForm({ ...menuItemForm, category: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                      value={menuItemForm.veg_nonveg}
                      onChange={(e) => setMenuItemForm({ ...menuItemForm, veg_nonveg: e.target.value as 'Veg' | 'Non-Veg' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    >
                      <option value="Veg">Veg</option>
                      <option value="Non-Veg">Non-Veg</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={menuItemForm.description}
                      onChange={(e) => setMenuItemForm({ ...menuItemForm, description: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                      type="url"
                      value={menuItemForm.image_url}
                      onChange={(e) => setMenuItemForm({ ...menuItemForm, image_url: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setEditingMenuItem(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}