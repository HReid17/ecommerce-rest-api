import { z } from 'zod';

// Register Validation
const registerSchema = z.object({
    email: z
        .email({ message: "Email must be a valid email address" })
        .transform((val) => val.trim().toLowerCase()),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters long"),
});

export const validateRegister = (req, res, next) => {
    try {
        req.body = registerSchema.parse(req.body); // validates the request body against the schema and returns a clean, trusted version of the data if it passes.
        next();
    } catch (err) {
        return res.status(400).json({
            message: "Invalid request data",
            errors: err.errors,
        });
    }
};

// Login Validation
const loginSchema = z.object({
    email: z
        .email({ message: "Email must be a valid email address" })
        .transform((val) => val.trim().toLowerCase()),

    password: z
        .string()
        .min(1, "Password required"),
});

export const validateLogin = (req, res, next) => {
    try {
        req.body = loginSchema.parse(req.body);
        next();
    } catch (err) {
        return res.status(400).json({
            message: "Invalid request data",
            errors: err.errors,
        });
    }
};