import { z } from "zod";

const orderIdSchema = z.coerce.number().int().positive("Order id must be a positive number");

export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "paid", "cancelled", "refunded"], {
    errorMap: () => ({ message: "Invalid order status" }),
  }),
});

export const validateOrderIdParam = (req, res, next) => {
  try {
    req.params.id = orderIdSchema.parse(req.params.id);
    next();
  } catch (err) {
    return res.status(400).json({
      message: "Invalid order id",
      errors: err.errors,
    });
  }
};

export const validateUpdateOrderStatus = (req, res, next) => {
  try {
    req.body = updateOrderStatusSchema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({
      message: "Invalid status data",
      errors: err.errors,
    });
  }
};
