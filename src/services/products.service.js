import { pool } from "../db/pool.js";

export const getAllProducts = async () => {
    try {
        const result = await pool.query(
            `SELECT id, name, description, price, stock_quantity, is_active
            FROM products WHERE is_active = TRUE
            ORDER BY name ASC`,
        );

        return result.rows
    } catch (err) {
        throw err
    }

};

export const getProductById = async (id) => {
    try {
        const result = await pool.query(
            `SELECT id, name, description, price, stock_quantity, is_active
            FROM products 
            WHERE is_active = TRUE AND id = $1`,
            [id]
        );

        return result.rows[0]
    } catch (err) {
        throw err
    }
};

export const createProduct = async (data) => {
    try {
        const { name, description, price, stock_quantity, is_active } = data;

        const result = await pool.query(
            `INSERT INTO products (name, description, price, stock_quantity, is_active)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, name, description, price, stock_quantity, is_active, created_at`,
            [name, description, price, stock_quantity, is_active]
        );

        return result.rows[0]
    } catch (err) {
        throw err
    }
};

export const updateProduct = async (id, data) => {
    try {
        const fields = [];
        const values = [];
        let index = 1;

        for (const [key, value] of Object.entries(data)) { /* Turns object (data) into key value pairs. Key = column name | Value = store in db */
            fields.push(`${key} = $${index}`);
            values.push(value);
            index++;
        }

        // Always update updated_at
        fields.push(`updated_at = NOW()`);

        const query = `
      UPDATE products
      SET ${fields.join(", ")}
      WHERE id = $${index}
      RETURNING id, name, description, price, stock_quantity, is_active, updated_at
    `;

        values.push(id);

        const result = await pool.query(query, values);

        return result.rows[0];
    } catch (err) {
        throw err;
    }
};

export const deactivateProduct = async (id) => {
    try {
        const result = await pool.query(
            `UPDATE products
       SET is_active = FALSE,
           updated_at = NOW()
       WHERE id = $1
       RETURNING id, name, description, price, stock_quantity, is_active, updated_at`,
            [id]
        );

        return result.rows[0];
    } catch (err) {
        throw err;
    }
};