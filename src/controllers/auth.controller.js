import jwt from 'jsonwebtoken';
import { registerUser, loginUser } from "../services/auth.service.js";

export const registerController = async (req, res) => {
    try {
        const user = await registerUser(req.body);
        return res.status(201).json({ user });
    } catch (err) {
        if (err.message === "EMAIL_ALREADY_EXISTS") {
            return res.status(409).json({ message: "Email already in use" });
        }

        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const loginController = async (req, res) => {
    try {
        const user = await loginUser(req.body);

        const token = jwt.sign(
            {id: user.id, role: user.role},
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ user, token });

        return res.status(200).json({ user });
    } catch (err) {
        if (err.message === "INVALID_CREDENTIALS") {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};