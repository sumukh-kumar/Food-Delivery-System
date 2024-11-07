import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Star, Search } from 'lucide-react';
import axios from 'axios';
import MenuItemCard from '../components/MenuItemCard';

interface Restaurant {
  RestaurantID: number;
  Restaurant_Name: string;
  Location: string;
  Cuisine: string;
  Image_URL: string;
  Rating: number | string | null;
}

interface MenuItem {
  Menu_Item_ID: number;
  Name: string;
  Description: string;
  Price: number | string;
  Category: string;
  Veg_NonVeg: 'Veg' | 'Non-Veg';
  Image_URL: string;
  In_Stock: boolean;
}

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      try {
        const [restaurantRes, menuRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/restaurants/${id}`),
          axios.get(`http://localhost:8080/api/restaurants/${id}/menu`)
        ]);
        
        setRestaurant(restaurantRes.data);
        setMenuItems(menuRes.data);
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
      }
    };

    if (id) {
      fetchRestaurantAndMenu();
    }
  }, [id]);

  if (!restaurant) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const categories = ['all', ...new Set(menuItems.map(item => item.Category))];
  
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.Category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.Description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.Category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const rating = typeof restaurant.Rating === 'string' 
    ? parseFloat(restaurant.Rating) 
    : restaurant.Rating;

  return (
    <div>
      <div className="relative h-[300px]">
        <img
          src={restaurant.Image_URL || 'https://via.placeholder.com/1200x400'}
          alt={restaurant.Restaurant_Name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.Restaurant_Name}</h1>
          <p className="text-gray-600 mb-4">{restaurant.Cuisine}</p>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="ml-1 text-gray-700">
                {rating ? rating.toFixed(1) : 'New'}
              </span>
            </div>
            <div className="flex items-center">
              {/* <Clock className="h-5 w-5 text-gray-600" />
              <span className="ml-1 text-gray-700">30-45 min</span> */}
            </div>
            <div className="flex items-center">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-600" />
              <span className="ml-1 text-gray-700">{restaurant.Location}</span>
            </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Menu</h2>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search menu items..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No menu items found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <MenuItemCard key={item.Menu_Item_ID} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;