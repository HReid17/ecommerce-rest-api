import express from 'express';
import { registerController, loginController } from '../controllers/auth.controller.js';
import { validateRegister, validateLogin } from '../validators/auth.validator.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/register", validateRegister, registerController);
router.post("/login", validateLogin, loginController);
router.get("/me", requireAuth, (req, res) => {
    res.json({ user: req.user })
})

export default router;