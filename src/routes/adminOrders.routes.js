import express from "express";
import {requireAdmin, requireAuth } from "../middleware/auth.middleware.js";

import {
    getAllOrdersAdminController,
    getOrderByIdAdminController,
    updateOrderStatusAdminController,
} from "../controllers/adminOrders.controller.js";

import {
    validateOrderIdParam,
    validateUpdateOrderStatus,
} from "../validators/adminOrders.validator.js";

const router = express.Router();

/**
 * @openapi
 * /admin/orders:
 *   get:
 *     summary: Get all orders (admin only)
 *     tags:
 *       - Admin Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Admin only
 */
router.get("/", requireAuth, requireAdmin, getAllOrdersAdminController);

/**
 * @openapi
 * /admin/orders/{id}:
 *   get:
 *     summary: Get any order by ID (admin only)
 *     tags:
 *       - Admin Orders
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
 *       403:
 *         description: Admin only
 *       404:
 *         description: Order not found
 */
router.get("/:id", requireAuth, requireAdmin, validateOrderIdParam, getOrderByIdAdminController);

/**
 * @openapi
 * /admin/orders/{id}/status:
 *   patch:
 *     summary: Update the status of an order (admin only)
 *     tags:
 *       - Admin Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: shipped
 *     responses:
 *       200:
 *         description: Order updated
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Admin only
 *       404:
 *         description: Order not found
 */
router.patch(
    "/:id/status",
    requireAuth,
    requireAdmin,
    validateOrderIdParam,
    validateUpdateOrderStatus,
    updateOrderStatusAdminController
);

export default router;
