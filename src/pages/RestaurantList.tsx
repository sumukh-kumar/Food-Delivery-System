import React, { useState } from 'react';
import RestaurantCard from '../components/RestaurantCard';
import { Restaurant } from '../types';

const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'Burger Palace',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80',
    cuisine: 'American',
    rating: 4.5,
    deliveryTime: '25-35 min',
    minimumOrder: 15,
    description: 'Best burgers in town'
  },
  {
    id: '2',
    name: 'Pizza Heaven',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80',
    cuisine: 'Italian',
    rating: 4.7,
    deliveryTime: '30-40 min',
    minimumOrder: 20,
    description: 'Authentic Italian pizzas'
  },
  {
    id: '3',
    name: 'Sushi Master',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80',
    cuisine: 'Japanese',
    rating: 4.8,
    deliveryTime: '35-45 min',
    minimumOrder: 25,
    description: 'Fresh sushi and sashimi'
  }
];

const RestaurantList = () => {
  const [cuisineFilter, setCuisineFilter] = useState<string>('all');
  const cuisines = ['all', 'American', 'Italian', 'Japanese'];

  const filteredRestaurants = MOCK_RESTAURANTS.filter(
    restaurant => cuisineFilter === 'all' || restaurant.cuisine === cuisineFilter
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
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
};

export default RestaurantList;