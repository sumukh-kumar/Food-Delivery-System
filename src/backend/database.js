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
    const query = "INSERT INTO User (User_Name, Email, Phone, Address, Password) VALUES (?, ?, ?, ?, ?)";
    const values = [user.name, user.email, user.phone, user.location, user.password];

    const [result] = await pool.query(query, values);
    console.log('User inserted:', result);
    return result; // This should return the result of the query, including insertId
}

async function addRestaurant(restaurantName, location, cuisine) {
    const query = "INSERT INTO Restaurants (Restaurant_Name, Location, Cuisine) VALUES (?, ?, ?)";
    const values = [restaurantName, location, cuisine];

    const [result] = await pool.query(query, values);
    console.log('Restaurant added:', result);
    return result; 
}

async function registerAdmin(adminData) {
    const { userID, restaurantID } = adminData;
    const query = "CALL RegisterAdmin(?, ?)";
    const values = [userID, restaurantID];

    const [result] = await pool.query(query, values);
    console.log('Admin registered:', result);
    return result; // Assuming you want to return the result
}


export { registeruser, addRestaurant, registerAdmin, pool };
