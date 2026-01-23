import {
    getCartWithItems,
    addCartItem,
    updateCartItemQuantity,
    deleteCartItem,
    clearCart,
} from "../services/carts.service.js";

/* --- GET /cart --- */
export const getCartController = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await getCartWithItems(userId);
        return res.status(200).json(cart);
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

/* --- POST /cart/items --- */
export const addCartItemController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        const result = await addCartItem(userId, productId, quantity);

        if (result === null) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (result === "INACTIVE_PRODUCT") {
            return res.status(400).json({ message: "Product is not available" });
        }

        if (result === "INSUFFICIENT_STOCK") {
            return res.status(400).json({ message: "Not enough stock for that quantity" });
        }

        return res.status(201).json(result);
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

/* --- PATCH /cart/items/:itemId --- */
export const updateCartItemController = async (req, res) => {
    try {
        const userId = req.user.id;
        const itemId = req.params.itemId;
        const { quantity } = req.body;

        const result = await updateCartItemQuantity(userId, itemId, quantity);

        if (result === null) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

/* --- DELETE /cart/items/:itemId --- */
export const deleteCartItemController = async (req, res) => {
    try {
        const userId = req.user.id;
        const itemId = req.params.itemId;

        const result = await deleteCartItem(userId, itemId);

        if (result === null) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

/* --- DELETE /cart --- */
export const clearCartController = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await clearCart(userId);
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};
