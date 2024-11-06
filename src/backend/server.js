import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { registeruser, pool } from './database.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());


console.log("bruh")

app.post("/api/register", async (req, res) => { 
    try {
        const { name, email, phone, password, confirmPassword, isAdmin, restaurantName } = req.body;

        if (!name || !email || !phone || !password || !confirmPassword) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }


        const [existingUser] = await pool.query("SELECT * FROM user WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }


        const user = {
            name,
            email,
            phone,
            location: "btm",
            password
        };

        const menu_items = await registeruser(user);
        res.json(menu_items); 
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Failed to register user', details: error.message });
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});