import { pool } from "../db/pool.js";
import { getOrCreateActiveCartId } from "./carts.service.js";

export const checkout = async (userId) => {
    try {
        // 1) Get active cart id
        const cartId = await getOrCreateActiveCartId(userId);

        // 2) Load cart items (JOIN products for price & stock)
        const cartItems = await pool.query(
            `SELECT
         ci.product_id,
         ci.quantity,
         p.name,
         p.price,
         p.stock_quantity
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = $1
       ORDER BY ci.created_at ASC`,
            [cartId]
        );

        // 3) If no items, return "EMPTY_CART"
        if (cartItems.rows.length === 0) {
            return "EMPTY_CART";
        }

        // 4) Check stock for every item
        for (const item of cartItems.rows) {
            if (item.stock_quantity !== null && item.quantity > item.stock_quantity) {
                return "INSUFFICIENT_STOCK";
            }
        }

        // 5) Calculate total amount (in pennies)
        let totalAmount = 0;

        for (const item of cartItems.rows) {
            totalAmount += item.price * item.quantity;
        }

        // 6) Create order
        const orderResult = await pool.query(
            `INSERT INTO orders (user_id, total_amount)
            VALUES ($1, $2)
            RETURNING id`,
            [userId, totalAmount]
        );

        const orderId = orderResult.rows[0].id;

        // 7) Copy cart items into order_items
        for (const item of cartItems.rows) {
            await pool.query(
                `INSERT INTO order_items 
                (order_id,
                product_id,
                product_name,
                price,
                quantity)
                VALUES 
                ($1, $2, $3, $4, $5)`,
                [
                    orderId,
                    item.product_id,
                    item.name,
                    item.price,
                    item.quantity,
                ]
            );
        }

        // 8) Deduct stock
        for (const item of cartItems.rows) {
            await pool.query(
                `UPDATE products
                SET stock_quantity = stock_quantity - $1
                WHERE id = $2`,
                [item.quantity, item.product_id]
            );
        }

        // 9) Close the cart
        await pool.query(
            `UPDATE carts
            SET status = 'checked_out',
            updated_at = NOW()
            WHERE id = $1`,
            [cartId]
        );

        return {
            message: "Checkout successful",
            order: {
                id: orderId,
                total_amount: totalAmount,
                items: cartItems.rows,
            },
        };

    } catch (err) {
        throw err;
    }
};
