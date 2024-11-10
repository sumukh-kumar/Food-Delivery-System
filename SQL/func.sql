USE FoodDeliverySystem;
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
    
    -- Return the UserID of the newly inserted user
    SET p_UserID = LAST_INSERT_ID();
END //
DELIMITER ;

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
    
    -- Return the RestaurantID of the newly inserted restaurant
    SET p_RestaurantID = LAST_INSERT_ID();
END //
DELIMITER ;



-- Add Menu Item
DELIMITER //
CREATE PROCEDURE AddMenuItem(
    IN p_RestaurantID INT,
    IN p_Name VARCHAR(100),
    IN p_Description TEXT,
    IN p_Price DECIMAL(10, 2),
    IN p_Category VARCHAR(50),
    IN p_Veg_NonVeg ENUM('Veg', 'Non-Veg'),
    IN p_Image_URL VARCHAR(255)
)
BEGIN
    INSERT INTO Menu_Item (RestaurantID, Name, Description, Price, Category, Veg_NonVeg, Image_URL)
    VALUES (p_RestaurantID, p_Name, p_Description, p_Price, p_Category, p_Veg_NonVeg, p_Image_URL);
END //
DELIMITER ;

-- Update Menu Item
DELIMITER //
CREATE PROCEDURE UpdateMenuItem(
    IN p_Menu_Item_ID INT,
    IN p_Name VARCHAR(100),
    IN p_Description TEXT,
    IN p_Price DECIMAL(10, 2),
    IN p_Category VARCHAR(50),
    IN p_Veg_NonVeg ENUM('Veg', 'Non-Veg'),
    IN p_In_Stock BOOLEAN,
    IN p_Image_URL VARCHAR(255)
)
BEGIN
    UPDATE Menu_Item
    SET Name = p_Name,
        Description = p_Description,
        Price = p_Price,
        Category = p_Category,
        Veg_NonVeg = p_Veg_NonVeg,
        In_Stock = p_In_Stock,
        Image_URL = p_Image_URL
    WHERE Menu_Item_ID = p_Menu_Item_ID;
END //
DELIMITER ;

-- Remove Menu Item
DELIMITER //
CREATE PROCEDURE RemoveMenuItem(
    IN p_Menu_Item_ID INT
)
BEGIN
    DELETE FROM Menu_Item
    WHERE Menu_Item_ID = p_Menu_Item_ID;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE PlaceOrder(
    IN p_UserID INT,
    IN p_RestaurantID INT,
    IN p_Delivery_Pickup ENUM('Delivery', 'Pickup'),
    IN p_Order_Items TEXT -- Format: "Menu_Item_ID1:Quantity1,Menu_Item_ID2:Quantity2"
)
BEGIN
    DECLARE v_Total_Amount DECIMAL(10, 2) DEFAULT 0.00;
    DECLARE v_OrderID INT;
    DECLARE v_Item VARCHAR(100);
    DECLARE v_Menu_Item_ID INT;
    DECLARE v_Quantity INT;
    DECLARE v_Price DECIMAL(10, 2);

    -- Insert into Orders table
    INSERT INTO Orders (UserID, RestaurantID, Delivery_Pickup)
    VALUES (p_UserID, p_RestaurantID, p_Delivery_Pickup);

    SET v_OrderID = LAST_INSERT_ID();

    -- Loop through order items
    WHILE LENGTH(p_Order_Items) > 0 DO
        -- Get the first item
        SET v_Item = SUBSTRING_INDEX(p_Order_Items, ',', 1);
        
        -- Update p_Order_Items to remove the processed item
        SET p_Order_Items = SUBSTRING(p_Order_Items, LENGTH(v_Item) + 2);

        -- Parse Menu_Item_ID and Quantity
        SET v_Menu_Item_ID = CAST(SUBSTRING_INDEX(v_Item, ':', 1) AS UNSIGNED);
        SET v_Quantity = CAST(SUBSTRING_INDEX(v_Item, ':', -1) AS UNSIGNED);

        -- Insert into Order_Item table
        INSERT INTO Order_Item (OrderID, Menu_Item_ID, Quantity)
        VALUES (v_OrderID, v_Menu_Item_ID, v_Quantity);

        -- Retrieve the price for the menu item
        SELECT Price INTO v_Price
        FROM Menu_Item
        WHERE Menu_Item_ID = v_Menu_Item_ID;

        -- Accumulate total amount for the order
        SET v_Total_Amount = v_Total_Amount + (v_Price * v_Quantity);
    END WHILE;

    -- Update total amount in Orders table
    UPDATE Orders
    SET Total_Amount = v_Total_Amount
    WHERE OrderID = v_OrderID;
END //
DELIMITER ;




-- Update Order Status
DELIMITER //
CREATE PROCEDURE UpdateOrderStatus(
    IN p_OrderID INT,
    IN p_NewStatus ENUM('Pending', 'Processing', 'Completed', 'Cancelled')
)
BEGIN
    UPDATE Orders
    SET Status = p_NewStatus
    WHERE OrderID = p_OrderID;
END //
DELIMITER ;

-- Track Delivery
DELIMITER //
CREATE PROCEDURE TrackDelivery(
    IN p_OrderID INT,
    IN p_Delivery_Status ENUM('Pending', 'Out for Delivery', 'Delivered', 'Cancelled'),
    IN p_Estimated_Time TIME
)
BEGIN
    INSERT INTO Delivery (OrderID, Delivery_Status, Estimated_Time)
    VALUES (p_OrderID, p_Delivery_Status, p_Estimated_Time);
END //
DELIMITER ;

-- Process Payment
DELIMITER //
CREATE PROCEDURE ProcessPayment(
    IN p_UserID INT,
    IN p_OrderID INT,
    IN p_Amount DECIMAL(10, 2),
    IN p_Method ENUM('Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Wallet', 'COD')
)
BEGIN
    INSERT INTO Payment (UserID, OrderID, Amount, Method)
    VALUES (p_UserID, p_OrderID, p_Amount, p_Method);
END //
DELIMITER ;

-- Get Orders by User
DELIMITER //
CREATE PROCEDURE GetOrdersByUser(
    IN p_UserID INT
)
BEGIN
    SELECT o.OrderID, o.RestaurantID, o.Status, o.Date, o.Total_Amount, o.Delivery_Pickup
    FROM Orders o
    WHERE o.UserID = p_UserID;
END //
DELIMITER ;


-- Get Popular Menu Items
DELIMITER //
CREATE PROCEDURE GetPopularMenuItems(
    IN p_RestaurantID INT
)
BEGIN
    SELECT mi.Name, SUM(oi.Quantity) AS TotalSold
    FROM Menu_Item mi
    JOIN Order_Item oi ON mi.Menu_Item_ID = oi.Menu_Item_ID
    JOIN Orders o ON oi.OrderID = o.OrderID
    WHERE o.RestaurantID = p_RestaurantID
    GROUP BY mi.Name
    ORDER BY TotalSold DESC;
END //
DELIMITER ;


-- Get Revenue by Restaurant
DELIMITER //
CREATE PROCEDURE GetRevenueByRestaurant(
    IN p_RestaurantID INT
)
BEGIN
    DECLARE v_TotalRevenue DECIMAL(10, 2);

    SELECT SUM(Total_Amount) INTO v_TotalRevenue
    FROM Orders
    WHERE RestaurantID = p_RestaurantID;

    -- Return 0 if no revenue is found
    SELECT IFNULL(v_TotalRevenue, 0) AS TotalRevenue;
END //
DELIMITER ;


-- IMPORTANT DONT DELETE
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
