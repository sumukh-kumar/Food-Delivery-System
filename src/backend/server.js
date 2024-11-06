import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { registeruser, addRestaurant, registerAdmin, pool } from './database.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

console.log("Server is running");

app.post("/api/register", async (req, res) => { 
    try {
        const { name, email, phone, password, confirmPassword, isAdmin, restaurantName } = req.body;

        if (!name || !email || !phone || !password || !confirmPassword) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Adjust this to access the results properly
        const [rows] = await pool.query("SELECT * FROM user WHERE email = ?", [email]);
        if (rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = {
            name,
            email,
            phone,
            location: "btm",
            password
        };

        // Register the user
        const newUser = await registeruser(user);
        
        if (isAdmin) {
            const newRestaurant = await addRestaurant(restaurantName, "Default Location", "Cuisine Type");
            const adminData = {
                userID: newUser.insertId,  // Assuming insertId is returned after inserting the user
                restaurantID: newRestaurant.insertId,  // Assuming insertId is returned after adding the restaurant
            };
            await registerAdmin(adminData);  // Register the user as an admin
        }

        res.json({ message: 'User registered successfully' }); 
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Failed to register user', details: error.message });
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
