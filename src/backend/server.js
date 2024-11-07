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

        // Check if user is admin
        const [adminRows] = await pool.query(
            "SELECT a.*, r.* FROM Admin a JOIN Restaurants r ON a.RestaurantID = r.RestaurantID WHERE a.UserID = ?",
            [user.UserID]
        );

        const isAdmin = adminRows.length > 0;
        const adminData = isAdmin ? adminRows[0] : null;

        res.json({ 
            message: 'Login successful',
            user: {
                id: user.UserID,
                name: user.User_Name,
                email: user.Email,
                isAdmin,
                restaurant: isAdmin ? {
                    id: adminData.RestaurantID,
                    name: adminData.Restaurant_Name,
                    location: adminData.Location,
                    cuisine: adminData.Cuisine,
                    rating: adminData.Rating
                } : null
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Failed to login', details: error.message });
    }
});

app.post("/api/register", async (req, res) => { 
    try {
        const { name, email, phone, password, confirmPassword, isAdmin, restaurantName , address } = req.body;

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
            address,
            password
        };

        const newUserID = await registeruser(user);

        if (isAdmin) {
            const newRestaurantID = await addRestaurant(restaurantName, address, "Cuisine Type");

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

app.get("/api/admin/analytics/:restaurantId", async (req, res) => {
    try {
        const { restaurantId } = req.params;

        // Get total orders
        const [orderCount] = await pool.query(
            "SELECT COUNT(*) as total FROM Orders WHERE RestaurantID = ?",
            [restaurantId]
        );

        // Get total revenue
        const [revenue] = await pool.query(
            "SELECT COALESCE(SUM(Total_Amount), 0) as total FROM Orders WHERE RestaurantID = ?",
            [restaurantId]
        );

        // Get popular items
        const [popularItems] = await pool.query(`
            SELECT mi.Name, COUNT(*) as orderCount
            FROM Order_Item oi
            JOIN Menu_Item mi ON oi.Menu_Item_ID = mi.Menu_Item_ID
            JOIN Orders o ON oi.OrderID = o.OrderID
            WHERE o.RestaurantID = ?
            GROUP BY mi.Menu_Item_ID
            ORDER BY orderCount DESC
            LIMIT 5
        `, [restaurantId]);

        res.json({
            totalOrders: Number(orderCount[0].total),
            totalRevenue: Number(revenue[0].total),
            popularItems
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

app.get("/api/restaurants", async (req, res) => {
    try {
        const [restaurants] = await pool.query("select * from restaurants");    
        res.json(restaurants);
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        res.status(500).json({ error: 'Failed to fetch restaurants', details: error.message });
    }
});

app.get("/api/restaurants/:id", async (req, res) => {
    try {
        const [restaurants] = await pool.query(
            "SELECT * FROM Restaurants WHERE RestaurantID = ?",
            [req.params.id]
        );
        
        if (restaurants.length === 0) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        
        res.json(restaurants[0]);
    } catch (error) {
        console.error('Error fetching restaurant:', error);
        res.status(500).json({ error: 'Failed to fetch restaurant' });
    }
});

app.get("/api/restaurants/:id/menu", async (req, res) => {
    try {
        const [menuItems] = await pool.query(
            "SELECT * FROM Menu_Item WHERE RestaurantID = ?",
            [req.params.id]
        );
        res.json(menuItems);
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ error: 'Failed to fetch menu items' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});