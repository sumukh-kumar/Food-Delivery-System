import mysql from "mysql2"
import dotenv from "dotenv"

dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

async function registeruser(user) { 
    const query = "CALL registeruser(?, ?, ?, ?, ?)";
    const values = [user.name, user.email, user.phone, user.location, user.password];
    const [temp] = await pool.query(query, values);
    return temp;
}

export { registeruser, pool }

