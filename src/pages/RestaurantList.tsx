import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RestaurantCard from '../components/RestaurantCard';

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
        console.log(fetchedRestaurants);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter(
    restaurant => cuisineFilter === 'all' || restaurant.Cuisine === cuisineFilter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Restaurants</h1>
          <p className="mt-2 text-gray-600">Find your favorite restaurants and dishes</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={cuisineFilter}
            onChange={(e) => setCuisineFilter(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
          >
            {cuisines.map(cuisine => (
              <option key={cuisine} value={cuisine}>
                {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map(restaurant => (
          <RestaurantCard key={restaurant.RestaurantID} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
};

export default RestaurantList;