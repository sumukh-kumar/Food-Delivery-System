import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

async function registeruser(user) {
    const query = "CALL RegisterUser(?, ?, ?, ?, ?, @p_UserID)";
    const values = [user.name, user.email, user.phone, user.address, user.password];
   
    const [result] = await pool.query(query, values);
    const [userIDResult] = await pool.query("SELECT @p_UserID AS UserID");

    return userIDResult[0].UserID; 
}

async function loginUser(email, password) {
    const [rows] = await pool.query(
        "SELECT UserID, User_Name, Email FROM User WHERE Email = ? AND Password = ?",
        [email, password]
    );
    return rows[0];
}

async function addRestaurant(restaurantName, location, cuisine) {
    const query = "CALL AddRestaurant(?, ?, ?, @p_RestaurantID)";
    const values = [restaurantName, location, cuisine];

    const [result] = await pool.query(query, values);
    const [restaurantIDResult] = await pool.query("SELECT @p_RestaurantID AS RestaurantID");

    return restaurantIDResult[0].RestaurantID; 
}

async function registerAdmin(adminData) {
    const { userID, restaurantID } = adminData;
    const query = "CALL RegisterAdmin(?, ?)";
    const values = [userID, restaurantID];

    const [result] = await pool.query(query, values);
    return result; 
}


async function getOrdersByRestaurant(restaurantId) {
    try {
        const [orders] = await pool.query(`
            SELECT o.*, u.User_Name, u.Phone as User_Phone, u.Address as User_Address
            FROM Orders o
            JOIN User u ON o.UserID = u.UserID
            WHERE o.RestaurantID = ?
            ORDER BY o.Date DESC
        `, [restaurantId]);
        return orders;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
}


async function getOrderItemsByOrderId(restaurantId, orderId) {
    try {
        const [items] = await pool.query(`
            SELECT oi.*, mi.Name, mi.Price
            FROM Order_Item oi
            JOIN (
                SELECT Menu_Item_ID, Name, Price
                FROM Menu_Item
                WHERE RestaurantID = ?
            ) AS mi ON oi.Menu_Item_ID = mi.Menu_Item_ID
            WHERE oi.OrderID = ?
        `, [restaurantId, orderId]);
        return items;
    } catch (error) {
        console.error('Error fetching order items:', error);
        throw error;
    }
}

export { registeruser, loginUser, addRestaurant, registerAdmin, pool, getOrderItemsByOrderId, getOrdersByRestaurant };