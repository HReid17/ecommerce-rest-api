import {
    getAllOrdersAdmin,
    getOrderByIdAdmin,
    updateOrderStatusAdmin,
} from "../services/adminOrders.service.js";

export const getAllOrdersAdminController = async (req, res) => {
    try {
        const orders = await getAllOrdersAdmin();
        return res.status(200).json({ orders });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

export const getOrderByIdAdminController = async (req, res) => {
    try {
        const orderId = req.params.id; 
        const result = await getOrderByIdAdmin(orderId);

        if (!result) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

export const updateOrderStatusAdminController = async (req, res) => {
    try {
        const orderId = req.params.id; 
        const { status } = req.body;

        const updated = await updateOrderStatusAdmin(orderId, status);

        if (!updated) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json({ order: updated });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};
