import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { registeruser, loginUser, addRestaurant, registerAdmin, pool, getOrderItemsByOrderId, getOrdersByRestaurant } from './database.js';

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
        const { name, email, phone, password, confirmPassword, isAdmin, restaurantName, address } = req.body;

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
            await registerAdmin({ userID: newUserID, restaurantID: newRestaurantID });
        }

        res.json({ message: 'User registered successfully' }); 
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Failed to register user', details: error.message });
    }
});

app.get("/api/restaurants", async (req, res) => {
    try {
        const [restaurants] = await pool.query("SELECT * FROM Restaurants");    
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

app.post("/api/orders", async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        const { userId, restaurantId, items, deliveryType, totalAmount } = req.body;

        if (!userId || !restaurantId || !items || !items.length || !totalAmount) {
            throw new Error('Missing required fields');
        }

        const [orderResult] = await connection.query(
            `INSERT INTO Orders (UserID, RestaurantID, Status, Total_Amount, Delivery_Pickup) 
             VALUES (?, ?, 'Pending', ?, ?)`,
            [userId, restaurantId, totalAmount, deliveryType]
        );

        const orderId = orderResult.insertId;

        for (const item of items) {
            await connection.query(
                `INSERT INTO Order_Item (OrderID, Menu_Item_ID, Quantity) 
                 VALUES (?, ?, ?)`,
                [orderId, item.menuItemId, item.quantity]
            );
        }

        await connection.commit();
        res.json({ 
            success: true,
            message: 'Order placed successfully', 
            orderId 
        });

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Error placing order:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to place order', 
            details: error.message 
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

app.post("/api/payments", async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const { userId, orderId, amount, method } = req.body;

        if (!userId || !orderId || !amount || !method) {
            throw new Error('Missing required fields');
        }

        await connection.query(
            `INSERT INTO Payment (UserID, OrderID, Amount, Method, Payment_Status) 
             VALUES (?, ?, ?, ?, 'Completed')`,
            [userId, orderId, amount, method]
        );

        // TRIGGER HERE

        await connection.commit();
        res.json({ 
            success: true,
            message: 'Payment processed successfully' 
        });

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Error processing payment:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to process payment', 
            details: error.message 
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

app.get("/api/admin/analytics/:restaurantId", async (req, res) => {
    try {
        const { restaurantId } = req.params;

        const [orderCount] = await pool.query(
            "SELECT COUNT(*) as total FROM Orders WHERE RestaurantID = ?",
            [restaurantId]
        );

        const [revenue] = await pool.query(
            "SELECT COALESCE(SUM(Total_Amount), 0) as total FROM Orders WHERE RestaurantID = ?",
            [restaurantId]
        );
       
        res.json({
            totalOrders: Number(orderCount[0].total),
            totalRevenue: Number(revenue[0].total)
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

app.get("/api/admin/orders/:restaurantId", async (req, res) => {
    try {
        const { restaurantId } = req.params;

        const orders = await getOrdersByRestaurant(restaurantId);

        for (let order of orders) {
            order.items = await getOrderItemsByOrderId(restaurantId, order.OrderID);
        }

        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});


app.put("/api/admin/orders/:orderId/status", async (req, res) => {
    try {
        const { status } = req.body;
        await pool.query(
            "UPDATE Orders SET Status = ? WHERE OrderID = ?",
            [status, req.params.orderId]
        );
        res.json({ message: 'Order status updated successfully' });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

app.put("/api/admin/restaurant/:id", async (req, res) => {
    try {
        const { name, location, cuisine, image_url } = req.body;
        const restaurantId = req.params.id;

        await pool.query(
            "UPDATE Restaurants SET Restaurant_Name = ?, Location = ?, Cuisine = ?, Image_URL = ? WHERE RestaurantID = ?",
            [name, location, cuisine, image_url, restaurantId]
        );

        res.json({ message: 'Restaurant updated successfully' });
    } catch (error) {
        console.error('Error updating restaurant:', error);
        res.status(500).json({ error: 'Failed to update restaurant' });
    }
});

app.post("/api/admin/restaurant/:id/menu", async (req, res) => {
    try {
        const { name, description, price, category, veg_nonveg, image_url, in_stock } = req.body;
        const restaurantId = req.params.id;

        const [result] = await pool.query(
            "INSERT INTO Menu_Item (RestaurantID, Name, Description, Price, Category, Veg_NonVeg, Image_URL, In_Stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [restaurantId, name, description, price, category, veg_nonveg, image_url, in_stock ?? true]
        );

        if (result.affectedRows === 1) {
            res.json({ 
                message: 'Menu item added successfully',
                menuItemId: result.insertId 
            });
        } else {
            throw new Error('Failed to insert menu item');
        }
    } catch (error) {
        console.error('Error adding menu item:', error);
        res.status(500).json({ 
            error: 'Failed to add menu item',
            details: error.message 
        });
    }
});

app.put("/api/admin/menu-item/:id", async (req, res) => {
    try {
        const { name, description, price, category, veg_nonveg, image_url, in_stock } = req.body;
        const menuItemId = req.params.id;

        const [result] = await pool.query(
            "UPDATE Menu_Item SET Name = ?, Description = ?, Price = ?, Category = ?, Veg_NonVeg = ?, Image_URL = ?, In_Stock = ? WHERE Menu_Item_ID = ?",
            [name, description, price, category, veg_nonveg, image_url, in_stock, menuItemId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Menu item not found' });
        }

        res.json({ message: 'Menu item updated successfully' });
    } catch (error) {
        console.error('Error updating menu item:', error);
        res.status(500).json({ error: 'Failed to update menu item' });
    }
});

app.delete("/api/admin/menu-item/:id", async (req, res) => {
    try {
        const menuItemId = req.params.id;
        await pool.query("DELETE FROM Menu_Item WHERE Menu_Item_ID = ?", [menuItemId]);
        res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        console.error('Error deleting menu item:', error);
        res.status(500).json({ error: 'Failed to delete menu item' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});