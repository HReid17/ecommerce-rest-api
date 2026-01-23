import { pool } from "../src/db/pool.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Creates a new user in the database for tests
export const createUser = async ({ email, password = "test123", role = "customer" }) => {

    // Hash the plain-text password so we never store real passwords
    const password_hash = await bcrypt.hash(password, 10);

    // Insert the user into the database
    const result = await pool.query(
        `INSERT INTO users (email, password_hash, role)
         VALUES ($1, $2, $3)
         RETURNING id, email, role`,
        [email, password_hash, role]
    );

    // Return the newly created user
    return result.rows[0];
};

// Creates a JWT token for a given user
// This simulates what happens when a user logs in
export const tokenFor = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role }, // Data stored inside the token
        process.env.JWT_SECRET          // Secret used to sign the token
    );
};

// Creates a product in the database for tests
export const createProduct = async ({
    name = "Test Product",
    description = "Desc",
    price = 1000,
    stock_quantity = 10,
    is_active = true,
} = {}) => {

    // Insert a new product into the products table
    const result = await pool.query(
        `INSERT INTO products (name, description, price, stock_quantity, is_active)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, price, stock_quantity, is_active`,
        [name, description, price, stock_quantity, is_active]
    );

    // Return the newly created product
    return result.rows[0];
};
