import { useParams } from 'react-router-dom';
import { Clock, Star, DollarSign } from 'lucide-react';
import { Restaurant, MenuItem } from '../types';
import axios from 'axios';

const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'American Diner',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80',
    cuisine: 'American',
    rating: 4.5,
    deliveryTime: '25-35 min',
    minimumOrder: 15,
    description: 'Best burgers in town'
  },
  {
    id: '2',
    name: 'Indian Heaven',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80',
    cuisine: 'Indian',
    rating: 4.5,
    deliveryTime: '20-30 min',
    minimumOrder: 10,
    description: 'Best Naan in town'
  },
  {
    id: '3',
    name: 'Sushi Master',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80',
    cuisine: 'Japanese',
    rating: 4.5,
    deliveryTime: '20-30 min',
    minimumOrder: 10,
    description: 'Best Sushi in town'
  }
];

const MOCK_MENU: MenuItem[] = [
  {
    id: '1',
    name: 'Classic Burger',
    description: 'Beef patty with lettuce, tomato, and special sauce',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80',
    category: 'Burgers'
  },
  {
    id: '2',
    name: 'Cheese Fries',
    description: 'Crispy fries topped with melted cheese',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&q=80',
    category: 'Sides'
  }
];

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const restaurant = MOCK_RESTAURANTS.find(r => r.id === id);

  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

  return (
    <div>
      <div className="relative h-[300px]">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
          <p className="text-gray-600 mb-4">{restaurant.description}</p>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="ml-1 text-gray-700">{restaurant.rating}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-600" />
              <span className="ml-1 text-gray-700">{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-gray-600" />
              <span className="ml-1 text-gray-700">Min. ${restaurant.minimumOrder}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_MENU.map(item => (
              <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                  <p className="text-orange-500 font-semibold">${item.price.toFixed(2)}</p>
                  <button className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;