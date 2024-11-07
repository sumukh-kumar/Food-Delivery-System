import { createContext, useContext, useReducer, ReactNode } from 'react';

interface CartItem {
  Menu_Item_ID: number;
  Name: string;
  Price: number;
  Quantity: number;
  RestaurantID: number;
}

interface CartState {
  items: CartItem[];
  restaurantId: number | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        item => item.Menu_Item_ID === action.payload.Menu_Item_ID
      );

      // If cart is empty or same restaurant, proceed
      if (!state.restaurantId || state.restaurantId === action.payload.RestaurantID) {
        if (existingItem) {
          return {
            ...state,
            items: state.items.map(item =>
              item.Menu_Item_ID === action.payload.Menu_Item_ID
                ? { ...item, Quantity: item.Quantity + 1 }
                : item
            ),
          };
        }
        return {
          restaurantId: action.payload.RestaurantID,
          items: [...state.items, { ...action.payload, Quantity: 1 }],
        };
      }
      return state;
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.Menu_Item_ID !== action.payload),
        restaurantId: state.items.length === 1 ? null : state.restaurantId,
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.Menu_Item_ID === action.payload.id
            ? { ...item, Quantity: action.payload.quantity }
            : item
        ),
      };

    case 'CLEAR_CART':
      return {
        items: [],
        restaurantId: null,
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    restaurantId: null,
  });

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};