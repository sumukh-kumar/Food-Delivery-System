import mysql from "mysql2"
import dotenv from "dotenv"

dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

async function selectall() { 
    const [temp] = await pool.query("Select * from restaurants;")
    return temp;
}

export { selectall, pool }


// const result = await selectall()
// console.log(result)