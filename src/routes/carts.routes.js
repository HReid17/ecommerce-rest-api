import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validateAddCartItem, validateItemIdParam, validateUpdateCartItem } from '../validators/carts.validator.js';
import { addCartItemController, clearCartController, deleteCartItemController, getCartController, updateCartItemController } from '../controllers/carts.controller.js';

const router = express.Router();

/**
 * @openapi
 * /cart:
 *   get:
 *     summary: Get the current user's active cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The active cart (with items)
 *       401:
 *         description: Missing or invalid token
 */
router.get("/", requireAuth, getCartController);

/**
 * @openapi
 * /cart/items:
 *   post:
 *     summary: Add an item to the current user's cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       201:
 *         description: Cart updated
 *       400:
 *         description: Invalid input, inactive product, or insufficient stock
 *       401:
 *         description: Missing or invalid token
 *       404:
 *         description: Product not found
 */
router.post("/items", requireAuth, validateAddCartItem, addCartItemController);

/**
 * @openapi
 * /cart/items/{itemId}:
 *   patch:
 *     summary: Update quantity of a cart item
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Cart updated
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Missing or invalid token
 *       404:
 *         description: Cart item not found
 */
router.patch("/items/:itemId", requireAuth, validateUpdateCartItem, updateCartItemController);

/**
 * @openapi
 * /cart/items/{itemId}:
 *   delete:
 *     summary: Remove an item from the cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cart updated
 *       401:
 *         description: Missing or invalid token
 *       404:
 *         description: Cart item not found
 */
router.delete("/items/:itemId", requireAuth, validateItemIdParam, deleteCartItemController);

/**
 * @openapi
 * /cart:
 *   delete:
 *     summary: Clear the current user's cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 *       401:
 *         description: Missing or invalid token
 */
router.delete("/", requireAuth, clearCartController);

export default router;