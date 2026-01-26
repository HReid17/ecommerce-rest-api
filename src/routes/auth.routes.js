import express from 'express';
import { registerController, loginController } from '../controllers/auth.controller.js';
import { validateRegister, validateLogin } from '../validators/auth.validator.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Email already exists
 */
router.post("/register", validateRegister, registerController);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login an existing user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", validateLogin, loginController);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Get the currently authenticated user
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The authenticated user
 *       401:
 *         description: Missing or invalid token
 */
router.get("/me", requireAuth, (req, res) => {
    res.json({ user: req.user })
})

export default router;