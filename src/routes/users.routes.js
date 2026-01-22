import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { updateValidateMe } from '../validators/users.validator.js';
import { deactivateMeController, getMeController, updateMeController } from '../controllers/users.controller.js';

const router = express.Router();

router.get("/me", requireAuth, getMeController)
router.patch("/me", requireAuth, updateValidateMe, updateMeController)
router.delete("/me", requireAuth, deactivateMeController)

export default router;