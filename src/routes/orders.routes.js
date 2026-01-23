import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { getMyOrdersController, getOrderByIdController } from "../controllers/orders.controller.js";

const router = express.Router();

router.get("/me", requireAuth, getMyOrdersController);
router.get("/:id", requireAuth, getOrderByIdController);

export default router;
