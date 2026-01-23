import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { checkoutController } from '../controllers/checkout.controller.js';

const router = express.Router();

router.post("/", requireAuth, checkoutController);

export default router;
