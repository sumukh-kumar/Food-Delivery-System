import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface MenuItemProps {
  item: {
    Menu_Item_ID: number;
    Name: string;
    Description: string;
    Price: number | string;
    Category: string;
    Veg_NonVeg: 'Veg' | 'Non-Veg';
    Image_URL: string;
    In_Stock: boolean;
  };
}

const MenuItemCard: React.FC<MenuItemProps> = ({ item }) => {
  const price = typeof item.Price === 'string' ? parseFloat(item.Price) : item.Price;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img
          src={item.Image_URL || 'https://via.placeholder.com/300x200'}
          alt={item.Name}
          className="w-full h-48 object-cover"
        />
        <span className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${
          item.Veg_NonVeg === 'Veg' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {item.Veg_NonVeg}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{item.Name}</h3>
        <p className="text-sm text-gray-600 mt-1">{item.Description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">Rs.{price.toFixed(2)}</span>
          <button 
            className={`flex items-center px-4 py-2 rounded-md ${
              item.In_Stock 
                ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!item.In_Stock}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {item.In_Stock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;