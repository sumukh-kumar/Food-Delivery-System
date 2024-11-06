create database FoodDeliverySystem;
USE FoodDeliverySystem;

-- TABLE CREATION --

-- Table: User (Consumers)
CREATE TABLE User (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    User_Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone VARCHAR(15),
    Address VARCHAR(250), -- User address used for delivery
    Password VARCHAR(100) NOT NULL -- For user authentication
);

-- Table: Admin
CREATE TABLE Restaurants (
    RestaurantID INT PRIMARY KEY AUTO_INCREMENT,
    Restaurant_Name VARCHAR(100) NOT NULL,
    Location VARCHAR(200),
    Cuisine VARCHAR(100),
    Rating DECIMAL(3, 2) DEFAULT 0.0
);

-- Table: Admin
CREATE TABLE Admin (
    AdminID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT UNIQUE, -- Linking Admin to User
    RestaurantID INT, -- Restaurant managed by Admin
    FOREIGN KEY (UserID) REFERENCES User(UserID), -- Ensure that Admin exists in User table
    FOREIGN KEY (RestaurantID) REFERENCES Restaurants(RestaurantID) -- Reference to Restaurant
);

-- Table: Menu_Item
CREATE TABLE Menu_Item (
    Menu_Item_ID INT PRIMARY KEY AUTO_INCREMENT,
    RestaurantID INT,
    Name VARCHAR(100) NOT NULL,
    Description TEXT,
    Price DECIMAL(10, 2),
    Category VARCHAR(50),
    Veg_NonVeg ENUM('Veg', 'Non-Veg'),
    In_Stock BOOLEAN DEFAULT TRUE,
    Image_URL VARCHAR(255),
    FOREIGN KEY (RestaurantID) REFERENCES Restaurants(RestaurantID)
);

-- Table: Orders
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    RestaurantID INT,
    Status ENUM('Pending', 'Processing', 'Completed', 'Cancelled') DEFAULT 'Pending',
    Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    Total_Amount DECIMAL(10, 2),
    Delivery_Pickup ENUM('Delivery', 'Pickup'),
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (RestaurantID) REFERENCES Restaurants(RestaurantID)
);

-- Table: Order_Item
CREATE TABLE Order_Item (
    OrderID INT,
    Menu_Item_ID INT,
    Quantity INT NOT NULL,
    PRIMARY KEY (OrderID, Menu_Item_ID),
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (Menu_Item_ID) REFERENCES Menu_Item(Menu_Item_ID)
);

-- Table: Delivery
CREATE TABLE Delivery (
    Delivery_ID INT PRIMARY KEY AUTO_INCREMENT,
    OrderID INT,
    Delivery_Status ENUM('Pending', 'Out for Delivery', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    Estimated_Time TIME,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
);

-- Table: Payment
CREATE TABLE Payment (
    Payment_ID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    OrderID INT,
    Amount DECIMAL(10, 2) NOT NULL,
    Method ENUM('Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Wallet', 'COD'), -- COD: Cash on Delivery
    Payment_Status ENUM('Pending', 'Completed', 'Failed') DEFAULT 'Pending',
    Payment_Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
);


