import { deactivateMe, getMe, updateMe } from "../services/users.service.js";


export const getMeController = async (req, res) => {
    try {
        const me = await getMe(req.user.id);

        if (!me) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user: me });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const updateMeController = async (req, res) => {
    try {
        const updatedMe = await updateMe(req.user.id, req.body);

        if (!updatedMe) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user: updatedMe });
    } catch (err) {
        if (err.code === "23505") {
            return res.status(409).json({ message: "Email already exists" });
        }

        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const deactivateMeController = async (req, res) => {
    try {
        const deactivatedMe = await deactivateMe(req.user.id);

        if (!deactivatedMe) {
            return res.status(404).json({ message: "User not found or already inactive" });
        }

        return res.status(200).json({ user: deactivatedMe });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};