USE FoodDeliverySystem;

-- Sample Restaurants Data
INSERT INTO Restaurants (Restaurant_Name, Location, Cuisine, Image_URL, Rating) VALUES
('Spice Garden', '123 Main St', 'Indian', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', 4.5),
('Burger Palace', '456 Oak Ave', 'American', 'https://images.unsplash.com/photo-1552566626-52f8b828add9', 4.2),
('Sushi Haven', '789 Pine St', 'Japanese', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', 4.8);

-- Sample Menu Items Data
INSERT INTO Menu_Item (RestaurantID, Name, Description, Price, Category, Veg_NonVeg, In_Stock, Image_URL) VALUES
-- Spice Garden Menu
(1, 'Butter Chicken', 'Tender chicken in rich tomato gravy', 15.99, 'Main Course', 'Non-Veg', TRUE, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398'),
(1, 'Paneer Tikka', 'Grilled cottage cheese with spices', 12.99, 'Starters', 'Veg', TRUE, 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8'),
(1, 'Dal Makhani', 'Creamy black lentils', 10.99, 'Main Course', 'Veg', TRUE, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d'),
(1, 'Naan Bread', 'Freshly baked Indian bread', 3.99, 'Breads', 'Veg', TRUE, 'https://images.unsplash.com/photo-1601050690597-df0568f70950'),

-- Burger Palace Menu
(2, 'Classic Cheeseburger', 'Beef patty with cheese and fresh veggies', 12.99, 'Burgers', 'Non-Veg', TRUE, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd'),
(2, 'Veggie Burger', 'Plant-based patty with premium toppings', 11.99, 'Burgers', 'Veg', TRUE, 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2'),
(2, 'French Fries', 'Crispy golden fries', 4.99, 'Sides', 'Veg', TRUE, 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d'),
(2, 'Chocolate Shake', 'Rich and creamy milkshake', 5.99, 'Beverages', 'Veg', TRUE, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699'),

-- Sushi Haven Menu
(3, 'California Roll', 'Crab, avocado, and cucumber roll', 14.99, 'Rolls', 'Non-Veg', TRUE, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c'),
(3, 'Vegetable Tempura', 'Assorted vegetables in crispy batter', 9.99, 'Appetizers', 'Veg', TRUE, 'https://images.unsplash.com/photo-1615557960916-5f4791effe9d'),
(3, 'Salmon Nigiri', 'Fresh salmon over seasoned rice', 16.99, 'Nigiri', 'Non-Veg', TRUE, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351'),
(3, 'Miso Soup', 'Traditional Japanese soup', 3.99, 'Soups', 'Veg', TRUE, 'https://images.unsplash.com/photo-1547592166-23ac45744acd');