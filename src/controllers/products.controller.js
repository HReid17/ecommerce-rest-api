import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deactivateProduct,
} from "../services/products.service.js";

export const getAllProductsController = async (req, res) => {
    try {
        const products = await getAllProducts();
        return res.status(200).json({ products });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

export const getProductByIdController = async (req, res) => {
    try {
        const id = Number(req.params.id)

        if (!Number.isInteger(id)) {
            return res.status(400).json({ message: "Product id must be a number" });
        }

        const product = await getProductById(id)

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ product });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

export const createProductController = async (req, res) => {
    try {
        const product = await createProduct(req.body);
        return res.status(201).json({ product });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

export const updateProductController = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({ message: "Product id must be a number" });
        }

        const product = await updateProduct(id, req.body);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ product });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

export const deleteProductController = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({ message: "Product id must be a number" });
        }

        const product = await deactivateProduct(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ product });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};