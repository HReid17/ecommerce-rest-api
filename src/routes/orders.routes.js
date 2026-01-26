import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { getMyOrdersController, getOrderByIdController } from "../controllers/orders.controller.js";

const router = express.Router();

/**
 * @openapi
 * /orders/me:
 *   get:
 *     summary: Get all orders belonging to the current user
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of the user's orders
 *       401:
 *         description: Missing or invalid token
 */
router.get("/me", requireAuth, getMyOrdersController);

/**
 * @openapi
 * /orders/{id}:
 *   get:
 *     summary: Get a specific order by ID (must belong to user)
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The order
 *       401:
 *         description: Missing or invalid token
 *       404:
 *         description: Order not found
 */
router.get("/:id", requireAuth, getOrderByIdController);

export default router;
