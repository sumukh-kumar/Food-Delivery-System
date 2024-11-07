import React from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

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
    RestaurantID: number;
  };
}

const MenuItemCard: React.FC<MenuItemProps> = ({ item }) => {
  const { state, dispatch } = useCart();
  const price = typeof item.Price === 'string' ? parseFloat(item.Price) : item.Price;

  const cartItem = state.items.find(i => i.Menu_Item_ID === item.Menu_Item_ID);

  const handleAddToCart = () => {
    if (state.restaurantId && state.restaurantId !== item.RestaurantID) {
      toast.error('Cannot add items from different restaurants');
      return;
    }
    
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        Menu_Item_ID: item.Menu_Item_ID,
        Name: item.Name,
        Price: price,
        Quantity: 1,
        RestaurantID: item.RestaurantID
      }
    });
    toast.success('Item added to cart');
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity === 0) {
      dispatch({ type: 'REMOVE_ITEM', payload: item.Menu_Item_ID });
      toast.success('Item removed from cart');
    } else {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { id: item.Menu_Item_ID, quantity: newQuantity }
      });
    }
  };

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
          {!cartItem ? (
            <button 
              className={`flex items-center px-4 py-2 rounded-md ${
                item.In_Stock 
                  ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!item.In_Stock}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {item.In_Stock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                className="p-1 rounded-full bg-orange-500 text-white hover:bg-orange-600"
                onClick={() => handleUpdateQuantity(cartItem.Quantity - 1)}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-medium">{cartItem.Quantity}</span>
              <button
                className="p-1 rounded-full bg-orange-500 text-white hover:bg-orange-600"
                onClick={() => handleUpdateQuantity(cartItem.Quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;