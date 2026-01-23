import { pool } from "../db/pool.js";

export const getMyOrders = async (userId) => {
    try {
        // Get orders (latest first)
        const ordersResult = await pool.query(
            `SELECT id, status, total_amount, created_at
            FROM orders
            WHERE user_id = $1
            ORDER BY created_at DESC`,
            [userId]
        );

        return ordersResult.rows;
    } catch (err) {
        throw err;
    }
};

export const getOrderByIdForUser = async (userId, orderId) => {
    try {
        // 1) Get the order (must belong to user)
        const orderResult = await pool.query(
            `SELECT id, user_id, status, total_amount, created_at
            FROM orders
            WHERE id = $1 AND user_id = $2`,
            [orderId, userId]
        );

        if (orderResult.rows.length === 0) {
            return null;
        }

        // 2) Get items for the order
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

