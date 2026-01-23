import { getMyOrders, getOrderByIdForUser } from "../services/orders.service.js";

export const getMyOrdersController = async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await getMyOrders(userId);
        return res.status(200).json({ orders });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

export const getOrderByIdController = async (req, res) => {
    try {
        const userId = req.user.id;
        const orderId = Number(req.params.id);

        if (!Number.isInteger(orderId)) {
            return res.status(400).json({ message: "Order id must be a number" });
        }

        const result = await getOrderByIdForUser(userId, orderId);

        if (!result) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};
