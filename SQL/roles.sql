-- Create User Role
CREATE ROLE 'UserRole';

-- Create Admin Role
CREATE ROLE 'AdminRole';

-- Grant Select and Insert privileges for registration and placing orders
GRANT SELECT, INSERT, UPDATE ON FoodDeliverySystem.User TO 'UserRole';
GRANT SELECT, INSERT ON FoodDeliverySystem.Orders TO 'UserRole';
GRANT SELECT, INSERT ON FoodDeliverySystem.Payment TO 'UserRole';
GRANT SELECT ON FoodDeliverySystem.Menu_Item TO 'UserRole';
GRANT EXECUTE ON PROCEDURE FoodDeliverySystem.RegisterUser TO 'UserRole';
GRANT EXECUTE ON PROCEDURE FoodDeliverySystem.PlaceOrder TO 'UserRole';
GRANT EXECUTE ON PROCEDURE FoodDeliverySystem.ProcessPayment TO 'UserRole';
GRANT EXECUTE ON PROCEDURE FoodDeliverySystem.GetOrdersByUser TO 'UserRole';


-- Grant Admin privileges on restaurants and menu items
GRANT SELECT, INSERT, UPDATE, DELETE ON FoodDeliverySystem.Restaurants TO 'AdminRole';
GRANT SELECT, INSERT, UPDATE, DELETE ON FoodDeliverySystem.Menu_Item TO 'AdminRole';

-- Grant privileges for managing orders and tracking deliveries
GRANT SELECT, UPDATE ON FoodDeliverySystem.Orders TO 'AdminRole';
GRANT SELECT, INSERT, UPDATE ON FoodDeliverySystem.Delivery TO 'AdminRole';

-- Grant EXECUTE privileges for procedures used by admins
GRANT EXECUTE ON PROCEDURE FoodDeliverySystem.RegisterAdmin TO 'AdminRole';
GRANT EXECUTE ON PROCEDURE FoodDeliverySystem.AddRestaurant TO 'AdminRole';
GRANT EXECUTE ON PROCEDURE FoodDeliverySystem.AddMenuItem TO 'AdminRole';
GRANT EXECUTE ON PROCEDURE FoodDeliverySystem.UpdateMenuItem TO 'AdminRole';
GRANT EXECUTE ON PROCEDURE FoodDeliverySystem.RemoveMenuItem TO 'AdminRole';
GRANT EXECUTE ON PROCEDURE FoodDeliverySystem.UpdateOrderStatus TO 'AdminRole';
GRANT EXECUTE ON PROCEDURE FoodDeliverySystem.TrackDelivery TO 'AdminRole';
GRANT EXECUTE ON PROCEDURE FoodDeliverySystem.GetRevenueByRestaurant TO 'AdminRole';
GRANT EXECUTE ON PROCEDURE FoodDeliverySystem.GetPopularMenuItems TO 'AdminRole';

-- Create a regular user account
CREATE USER 'username'@'hostname' IDENTIFIED BY 'password';

-- Create an admin user account
CREATE USER 'adminusername'@'hostname' IDENTIFIED BY 'password';


-- Assign UserRole to a regular user
GRANT 'UserRole' TO 'username'@'hostname';

-- Assign AdminRole to an admin user
GRANT 'AdminRole' TO 'adminusername'@'hostname';


