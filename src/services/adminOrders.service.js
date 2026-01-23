import { pool } from "../db/pool.js";

export const getAllOrdersAdmin = async () => {
    try {
        const result = await pool.query(
            `SELECT o.id, o.user_id, u.email, o.status, o.total_amount, o.created_at
            FROM orders o
            JOIN users u ON u.id = o.user_id
            ORDER BY o.created_at DESC`
        );

        return result.rows;
    } catch (err) {
        throw err;
    }
};

export const getOrderByIdAdmin = async (orderId) => {
    try {
        const orderResult = await pool.query(
            `SELECT o.id, o.user_id, u.email, o.status, o.total_amount, o.created_at
            FROM orders o
            JOIN users u ON u.id = o.user_id
            WHERE o.id = $1`,
            [orderId]
        );

        if (orderResult.rows.length === 0) return null;

        const itemsResult = await pool.query(
            `SELECT id, product_id, product_name, price, quantity, created_at
            FROM order_items
            WHERE order_id = $1
            ORDER BY id ASC`,
            [orderId]
        );

        return {
            order: {
                ...orderResult.rows[0],
                items: itemsResult.rows,
            },
        };
    } catch (err) {
        throw err;
    }
};

export const updateOrderStatusAdmin = async (orderId, status) => {
    try {
        const updated = await pool.query(
            `UPDATE orders
            SET status = $1,
            updated_at = NOW()
            WHERE id = $2
            RETURNING id, user_id, status, total_amount, created_at, updated_at`,
            [status, orderId]
        );

        if (updated.rows.length === 0) return null;

        return updated.rows[0];
    } catch (err) {
        throw err;
    }
};
