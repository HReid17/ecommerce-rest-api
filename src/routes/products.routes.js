import express from 'express';

import {
    getAllProductsController,
    getProductByIdController,
    createProductController,
    updateProductController,
    deleteProductController
} from "../controllers/products.controller.js";

import {
    validateCreateProduct,
    validateUpdateProduct
} from "../validators/products.validator.js";

import { requireAdmin, requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Get all active products
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: List of all available products
 */
router.get("/", getAllProductsController);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The product
 *       404:
 *         description: Product not found
 */
router.get("/:id", getProductByIdController);

/**
 * @openapi
 * /products:
 *   post:
 *     summary: Create a new product (admin only)
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stock_quantity
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: integer
 *               stock_quantity:
 *                 type: integer
 *               is_active:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Product created
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Admin only
 */
router.post("/", requireAuth, requireAdmin, validateCreateProduct, createProductController);

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     summary: Update a product (admin only)
 *     tags:
 *       - Products
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: integer
 *               stock_quantity:
 *                 type: integer
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Product updated
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Admin only
 *       404:
 *         description: Product not found
 */
router.put("/:id", requireAuth, requireAdmin, validateUpdateProduct, updateProductController);

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     summary: Deactivate a product (admin only)
 *     tags:
 *       - Products
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
 *         description: Product deactivated
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Admin only
 *       404:
 *         description: Product not found
 */
router.delete("/:id", requireAuth, requireAdmin, deleteProductController);

export default router;