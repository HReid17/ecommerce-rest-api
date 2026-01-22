import { z } from 'zod';

export const updateValidateMeSchema = z.object({
    email: z
        .email({ message: "Email must be a valid email address" })
        .transform((val) => val.trim().toLowerCase())
})

export const updateValidateMe = (req, res, next) => {
    try {
        req.body = updateValidateMeSchema.parse(req.body);
        next();
    } catch (err) {
        return res.status(400).json({
            message: "Invalid request data",
            errors: err.errors
        })
    }
};