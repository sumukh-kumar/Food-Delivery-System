import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RestaurantCard from '../components/RestaurantCard';
import { Search } from 'lucide-react';

interface Restaurant {
  RestaurantID: number;
  Restaurant_Name: string;
  Location: string;
  Cuisine: string;
  Image_URL: string;
  Rating: number | null;
}

const RestaurantList: React.FC = () => {
  const [cuisineFilter, setCuisineFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [cuisines, setCuisines] = useState<string[]>(['all']);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get<Restaurant[]>('http://localhost:8080/api/restaurants');
        const fetchedRestaurants = response.data.map(restaurant => ({
          ...restaurant,
          Rating: typeof restaurant.Rating === 'number' ? restaurant.Rating : null
        }));
        setRestaurants(fetchedRestaurants);
        
        const uniqueCuisines = ['all', ...new Set(fetchedRestaurants.map(r => r.Cuisine).filter(Boolean))];
        setCuisines(uniqueCuisines);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesCuisine = cuisineFilter === 'all' || restaurant.Cuisine === cuisineFilter;
    const matchesSearch = searchQuery === '' || 
      restaurant.Restaurant_Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.Cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.Location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCuisine && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Restaurants</h1>
          <p className="mt-2 text-gray-600">Find your favorite restaurants and dishes</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search restaurants or locations..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={cuisineFilter}
            onChange={(e) => setCuisineFilter(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
          >
            {cuisines.map(cuisine => (
              <option key={cuisine} value={cuisine}>
                {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredRestaurants.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No restaurants found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map(restaurant => (
            <RestaurantCard key={restaurant.RestaurantID} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantList;