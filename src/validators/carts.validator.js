import { z } from "zod";

const productIdSchema = z.coerce.number().int().positive("productId must be a positive number");
const itemIdSchema = z.coerce.number().int().positive("itemId must be a positive number");
const quantitySchema = z.coerce
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1");

export const addCartItemSchema = z.object({
    productId: productIdSchema,
    quantity: quantitySchema,
});

export const updateCartItemSchema = z.object({
    quantity: quantitySchema,
});

export const validateAddCartItem = (req, res, next) => {
    try {
        req.body = addCartItemSchema.parse(req.body);
        next();
    } catch (err) {
        return res.status(400).json({
            message: "Invalid cart item data",
            errors: err.errors,
        });
    }
};

export const validateUpdateCartItem = (req, res, next) => {
    try {
        req.body = updateCartItemSchema.parse(req.body);
        
        req.params.itemId = itemIdSchema.parse(req.params.itemId);

        next();
    } catch (err) {
        return res.status(400).json({
            message: "Invalid cart item data",
            errors: err.errors,
        });
    }
};

export const validateItemIdParam = (req, res, next) => {
    try {
        req.params.itemId = itemIdSchema.parse(req.params.itemId);
        next();
    } catch (err) {
        return res.status(400).json({
            message: "Invalid item id",
            errors: err.errors,
        });
    }
};