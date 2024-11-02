import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { selectall } from './database.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => { 
    const menu_items = await selectall();
    res.send(menu_items)
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
