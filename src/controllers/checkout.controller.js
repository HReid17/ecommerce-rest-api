import { checkout } from "../services/checkout.service.js";

export const checkoutController = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await checkout(userId);

    if (result === "EMPTY_CART") {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (result === "INSUFFICIENT_STOCK") {
      return res.status(400).json({ message: "Not enough stock to complete checkout" });
    }

    return res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
