import { Link } from 'react-router-dom';
import { Clock, Star } from 'lucide-react';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <Link to={`/restaurant/${restaurant.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:-translate-y-1">
        <div className="relative h-48">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <h3 className="text-white text-xl font-semibold">{restaurant.name}</h3>
            <p className="text-white/90 text-sm">{restaurant.cuisine}</p>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="ml-1 text-gray-700">{restaurant.rating}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-5 w-5" />
              <span className="ml-1">{restaurant.deliveryTime}</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm">Minimum order: ${restaurant.minimumOrder}</p>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;