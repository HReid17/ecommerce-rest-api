import { pool } from "../db/pool.js";

export const getOrCreateActiveCartId = async (userId) => {
    try {
        // 1) Look for an active cart for this user
        const existing = await pool.query(
            `SELECT id
       FROM carts
       WHERE user_id = $1
       AND status = 'active'
       LIMIT 1`,
            [userId]
        );

        // if found, return cart id
        if (existing.rows.length > 0) {
            return existing.rows[0].id;
        }

        // 2) If not found, create a cart
        const created = await pool.query(
            `INSERT INTO carts (user_id)
       VALUES ($1)
       RETURNING id`,
            [userId]
        );

        // return new cart id
        return created.rows[0].id;
    } catch (err) {
        throw err;
    }
};

export const getCartWithItems = async (userId) => {
    try {
        // 1) Get or create active cart id
        const cartId = await getOrCreateActiveCartId(userId);

        // 2) Load cart row
        const cartRow = await pool.query(
            `SELECT id, status, created_at, updated_at
        FROM carts
        WHERE id = $1`,
            [cartId]
        );

        // 3) Load items for this cart (JOIN products)
        const cartItems = await pool.query(
            `SELECT 
            ci.id,
            ci.product_id,
            ci.quantity,
            p.name,
            p.price
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.cart_id = $1
            ORDER BY ci.created_at ASC`,
            [cartId]
        )

        return {
            cart: {
                ...cartRow.rows[0],
                items: cartItems.rows,
            },
        };
    } catch (err) {
        throw err;
    }
};

export const addCartItem = async (userId, productId, quantity) => {
    try {
        // 1) Check product exists
        const productResult = await pool.query(
            `SELECT id, stock_quantity, is_active
       FROM products
       WHERE id = $1`,
            [productId]
        );

        if (productResult.rows.length === 0) {
            return null;
        }

        const product = productResult.rows[0];

        if (product.is_active !== true) {
            return "INACTIVE_PRODUCT";
        }

        // stock check
        if (product.stock_quantity !== null && quantity > product.stock_quantity) {
            return "INSUFFICIENT_STOCK";
        }

        // 2) Get or create cart id
        const cartId = await getOrCreateActiveCartId(userId);

        // 3) Insert or update quantity
        await pool.query(
            `INSERT INTO cart_items (cart_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (cart_id, product_id)
       DO UPDATE SET
         quantity = cart_items.quantity + EXCLUDED.quantity,
         updated_at = NOW()`,
            [cartId, productId, quantity]
        );

        // 4) Return updated cart
        return await getCartWithItems(userId);
    } catch (err) {
        throw err;
    }
};


export const updateCartItemQuantity = async (userId, itemId, quantity) => {
    try {
        const updated = await pool.query(
            `UPDATE cart_items ci
       SET quantity = $1,
           updated_at = NOW()
       FROM carts c
       WHERE ci.id = $2
         AND ci.cart_id = c.id
         AND c.user_id = $3
         AND c.status = 'active'
       RETURNING ci.id`,
            [quantity, itemId, userId]
        );

        // If no rows updated, item not found or not owned by user
        if (updated.rows.length === 0) {
            return null;
        }

        return await getCartWithItems(userId);
    } catch (err) {
        throw err;
    }
};

export const deleteCartItem = async (userId, itemId) => {
    try {
        const deleted = await pool.query(
            `DELETE FROM cart_items ci
       USING carts c
       WHERE ci.id = $1
         AND ci.cart_id = c.id
         AND c.user_id = $2
         AND c.status = 'active'
       RETURNING ci.id`,
            [itemId, userId]
        );

        if (deleted.rows.length === 0) {
            return null;
        }

        return await getCartWithItems(userId);
    } catch (err) {
        throw err;
    }
};

export const clearCart = async (userId) => {
    try {
        // 1) Find active cart id
        const cartResult = await pool.query(
            `SELECT id
       FROM carts
       WHERE user_id = $1
         AND status = 'active'
       LIMIT 1`,
            [userId]
        );

        // 2) If no active cart, return empty/new cart
        if (cartResult.rows.length === 0) {
            return await getCartWithItems(userId);
        }

        const cartId = cartResult.rows[0].id;

        // 3) Delete all items for this cart
        await pool.query(
            `DELETE FROM cart_items
       WHERE cart_id = $1`,
            [cartId]
        );

        // 4) Return updated cart
        return await getCartWithItems(userId);
    } catch (err) {
        throw err;
    }
};

