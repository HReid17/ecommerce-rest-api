import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validateAddCartItem, validateItemIdParam, validateUpdateCartItem } from '../validators/carts.validator.js';
import { addCartItemController, clearCartController, deleteCartItemController, getCartController, updateCartItemController } from '../controllers/carts.controller.js';

const router = express.Router();

router.get("/", requireAuth, getCartController);
router.post("/items", requireAuth, validateAddCartItem, addCartItemController);
router.patch("/items/:itemId", requireAuth, validateUpdateCartItem, updateCartItemController);
router.delete("/items/:itemId", requireAuth, validateItemIdParam, deleteCartItemController);
router.delete("/", requireAuth, clearCartController);

export default router;