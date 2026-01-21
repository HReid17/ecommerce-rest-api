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

import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all active products
router.get("/", getAllProductsController);

// Get single product by ID
router.get("/:id", getProductByIdController);

// Create a new product
router.post("/", requireAuth, validateCreateProduct, createProductController);

// Update a product
router.put("/:id", requireAuth, validateUpdateProduct, updateProductController);

// Deactivate a product
router.delete("/:id", requireAuth, deleteProductController);

export default router;