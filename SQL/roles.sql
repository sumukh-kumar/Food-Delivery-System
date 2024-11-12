CREATE ROLE 'UserRole';
CREATE ROLE 'AdminRole';


GRANT SELECT, INSERT, UPDATE ON FoodDeliverySystem.User TO 'UserRole';
GRANT SELECT, INSERT ON FoodDeliverySystem.Orders TO 'UserRole';
GRANT SELECT, INSERT ON FoodDeliverySystem.Payment TO 'UserRole';
GRANT SELECT ON FoodDeliverySystem.Menu_Item TO 'UserRole';
GRANT EXECUTE ON PROCEDURE FoodDeliverySystem.RegisterUser TO 'UserRole';

GRANT SELECT, INSERT, UPDATE, DELETE ON FoodDeliverySystem.Restaurants TO 'AdminRole';
GRANT SELECT, INSERT, UPDATE, DELETE ON FoodDeliverySystem.Menu_Item TO 'AdminRole';
GRANT SELECT, UPDATE ON FoodDeliverySystem.Orders TO 'AdminRole';
GRANT EXECUTE ON PROCEDURE FoodDeliverySystem.RegisterAdmin TO 'AdminRole';
GRANT EXECUTE ON PROCEDURE FoodDeliverySystem.AddRestaurant TO 'AdminRole';

CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';
CREATE USER 'adminusername'@'localhost' IDENTIFIED BY 'password';


GRANT 'UserRole' TO 'username'@'localhost';
GRANT 'AdminRole' TO 'adminusername'@'localhost';


