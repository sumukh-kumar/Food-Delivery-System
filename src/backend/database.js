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
    const values = [user.name, user.email, user.phone, user.location, user.password];
   
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

export { registeruser, loginUser, addRestaurant, registerAdmin, pool };