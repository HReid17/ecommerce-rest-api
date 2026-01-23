import { config } from "dotenv";
config({ path: ".env.test" });

import { pool } from "../src/db/pool.js";

beforeAll(async () => {
    const res = await pool.query("SELECT current_database()");
    console.log("Connected to database:", res.rows[0].current_database);

    if (!res.rows[0].current_database.includes("test")) {
        throw new Error("Tests are NOT running on a test database!");
    }
});

// Before each test the DB is wiped
beforeEach(async () => {
    await pool.query("TRUNCATE TABLE order_items RESTART IDENTITY CASCADE");
    await pool.query("TRUNCATE TABLE orders RESTART IDENTITY CASCADE");
    await pool.query("TRUNCATE TABLE cart_items RESTART IDENTITY CASCADE");
    await pool.query("TRUNCATE TABLE carts RESTART IDENTITY CASCADE");
    await pool.query("TRUNCATE TABLE products RESTART IDENTITY CASCADE");
    await pool.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE");
});

// Once tests are finished, close DB
afterAll(async () => {
    await pool.end();
});
