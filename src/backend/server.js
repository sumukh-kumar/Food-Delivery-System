import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { registeruser, loginUser, addRestaurant, registerAdmin, pool } from './database.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await loginUser(email, password);
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({ 
            message: 'Login successful',
            user: {
                id: user.UserID,
                name: user.User_Name,
                email: user.Email
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Failed to login', details: error.message });
    }
});

app.post("/api/register", async (req, res) => { 
    try {
        const { name, email, phone, password, confirmPassword, isAdmin, restaurantName } = req.body;

        if (!name || !email || !phone || !password || !confirmPassword) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

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

        const newUserID = await registeruser(user);

        if (isAdmin) {
            const newRestaurantID = await addRestaurant(restaurantName, "Default Location", "Cuisine Type");

            const adminData = {
                userID: newUserID,  
                restaurantID: newRestaurantID,  
            };

            await registerAdmin(adminData);
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