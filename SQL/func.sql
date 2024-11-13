USE FoodDeliverySystem;

-- Trigger!!
DELIMITER //
CREATE TRIGGER update_order_status_after_payment
AFTER INSERT ON Payment
FOR EACH ROW
BEGIN
    UPDATE Orders
    SET Status = 'Processing'
    WHERE OrderID = NEW.OrderID AND Status = 'Pending';
END //
DELIMITER ;

DELIMITER $$
CREATE TRIGGER delete_restaurant_if_no_admin
AFTER DELETE ON User
FOR EACH ROW
BEGIN
    -- Delete restaurants that have no corresponding Admin
    DELETE FROM Restaurants
    WHERE RestaurantID NOT IN (
        SELECT DISTINCT RestaurantID
        FROM Admin
    );
END $$
DELIMITER ;


-- User Registration
DELIMITER //
CREATE PROCEDURE RegisterUser(
    IN p_User_Name VARCHAR(100),
    IN p_Email VARCHAR(100),
    IN p_Phone VARCHAR(15),
    IN p_Address VARCHAR(250),
    IN p_Password VARCHAR(100),
    OUT p_UserID INT
)
BEGIN
    INSERT INTO User (User_Name, Email, Phone, Address, Password)
    VALUES (p_User_Name, p_Email, p_Phone, p_Address, p_Password);
    SET p_UserID = LAST_INSERT_ID();
END //
DELIMITER ;


-- Admin Registration
DELIMITER //
CREATE PROCEDURE RegisterAdmin(
    IN p_UserID INT,
    IN p_RestaurantID INT
)
BEGIN
    INSERT INTO Admin (UserID, RestaurantID)
    VALUES (p_UserID, p_RestaurantID);
END //
DELIMITER ;


-- Restaurant Registration
DELIMITER //
CREATE PROCEDURE AddRestaurant(
    IN p_Restaurant_Name VARCHAR(100),
    IN p_Location VARCHAR(200),
    IN p_Cuisine VARCHAR(100),
    OUT p_RestaurantID INT
)
BEGIN
    INSERT INTO Restaurants (Restaurant_Name, Location, Cuisine)
    VALUES (p_Restaurant_Name, p_Location, p_Cuisine);
    SET p_RestaurantID = LAST_INSERT_ID();
END //
DELIMITER ;

