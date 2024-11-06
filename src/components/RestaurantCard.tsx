import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

interface Restaurant {
  RestaurantID: number;
  Restaurant_Name: string;
  Location: string;
  Cuisine: string;
  Image_URL: string;
  Rating: number | null;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <Link to={`/restaurant/${restaurant.RestaurantID}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:-translate-y-1">
        <div className="relative h-48">
          <img
            src={restaurant.Image_URL || 'https://via.placeholder.com/300x200'}
            alt={restaurant.Restaurant_Name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <h3 className="text-white text-xl font-semibold">{restaurant.Restaurant_Name}</h3>
            <p className="text-white/90 text-sm">{restaurant.Cuisine}</p>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="ml-1 text-gray-700">
                {typeof restaurant.Rating === 'number' ? restaurant.Rating.toFixed(1) : 'N/A'}
              </span>
            </div>
          </div>
          <p className="text-gray-600 text-sm">Location: {restaurant.Location}</p>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;