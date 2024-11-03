import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { selectall, pool } from './database.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());


console.log("bruh")

app.get("/api/restaurants", async (req, res) => { 
    try {
        // const [menu_items] = await pool.query("select * from menu_items")
        const menu_items = await selectall()
        res.json(menu_items);
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ error: 'Failed to fetch menu items' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});