import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { checkoutController } from '../controllers/checkout.controller.js';

const router = express.Router();

/**
 * @openapi
 * /checkout:
 *   post:
 *     summary: Create an order from the current user's cart
 *     tags:
 *       - Checkout
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order successfully created
 *       400:
 *         description: Cart is empty or insufficient stock
 *       401:
 *         description: Missing or invalid token
 */
router.post("/", requireAuth, checkoutController);

export default router;
