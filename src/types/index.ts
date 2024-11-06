// types.ts

export interface Restaurantt {
  RestaurantID: number;
  Restaurant_Name: string;
  Location: string;
  Cuisine: string;
  Image_URL: string;
  Rating: number | null;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}