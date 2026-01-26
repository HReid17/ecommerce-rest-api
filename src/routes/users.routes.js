import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { updateValidateMe } from '../validators/users.validator.js';
import { deactivateMeController, getMeController, updateMeController } from '../controllers/users.controller.js';

const router = express.Router();

/**
 * @openapi
 * /users/me:
 *   get:
 *     summary: Get the currently authenticated users profile
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user's profile
 *       401:
 *         description: Missing or invalid token
 */
router.get("/me", requireAuth, getMeController)

/***
 * @openAPI
 * /users/me:
 *  patch:
 *      summary: Update the current user's profile
 *      tags:
 *          - Users
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              example: new@email.com
 *                          password:
 *                              type: string            
 *                              example: NewPassword123
 *      responses:
 *          200:
 *            description: Updated user
 *          400:
 *            description: invalid input
 *          401:
 *            description: Missing or invalid input 
 */
router.patch("/me", requireAuth, updateValidateMe, updateMeController)

/**
 * @openapi
 * /users/me:
 *   delete:
 *     summary: Deactivate the current user's account
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deactivated
 *       401:
 *         description: Missing or invalid token
 */
router.delete("/me", requireAuth, deactivateMeController)

export default router;