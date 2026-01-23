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

// View all orders
router.get("/", requireAuth, requireAdmin, getAllOrdersAdminController);

// View order by ID
router.get("/:id", requireAuth, requireAdmin, validateOrderIdParam, getOrderByIdAdminController);

// Update order status
router.patch(
    "/:id/status",
    requireAuth,
    requireAdmin,
    validateOrderIdParam,
    validateUpdateOrderStatus,
    updateOrderStatusAdminController
);

export default router;
