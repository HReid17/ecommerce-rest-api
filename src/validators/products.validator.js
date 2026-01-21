import { z } from 'zod';

/* priceSchema & stockSchema:

. Input is converted to a number
. It must be a whole number
. It cannot be negative */

const priceSchema = z.coerce
    .number()
    .int("Price must be a whole number")
    .min(0, "Price cannot be negative");

const stockSchema = z.coerce
    .number()
    .int("Stock quantity must be a whole number")
    .min(0, "Stock quantity cannot be negative");


/* --- CREATE PRODUCT --- */

export const createProductSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Name is required")
        .max(255, "Name must be 255 characters or less"),

    description: z
        .string()
        .trim()
        .max(5000, "Description must be 5000 characters or less")
        .optional(),

    price: priceSchema,

    stock_quantity: stockSchema.optional().default(0),

    is_active: z.coerce.boolean().optional().default(true),
});

/* --- UPDATE PRODUCT --- */

export const updateProductSchema = z
    .object({
        name: z.string().trim().min(1).max(255).optional(),
        description: z.string().trim().max(5000).optional(),
        price: priceSchema.optional(),
        stock_quantity: stockSchema.optional(),
        is_active: z.coerce.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided to update",
    });


export const validateCreateProduct = (req, res, next) => {
    try {
        req.body = createProductSchema.parse(req.body);
        next();
    } catch (err) {
        return res.status(400).json({
            message: "Invalid product data",
            errors: err.errors,
        });
    }
};

export const validateUpdateProduct = (req, res, next) => {
    try {
        req.body = updateProductSchema.parse(req.body);
        next();
    } catch (err) {
        return res.status(400).json({
            message: "Invalid product data",
            errors: err.errors,
        });
    }
};