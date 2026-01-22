import { pool } from "../db/pool.js";

export const getMe = async (userId) => {
    try {
        const result = await pool.query(
            `SELECT id, email, role, created_at, updated_at
       FROM users
       WHERE id = $1 AND is_active = TRUE`,
            [userId]
        );

        return result.rows[0];
    } catch (err) {
        throw err;
    }
};

export const updateMe = async (userId, data) => {
    try {
        const { email } = data;

        const result = await pool.query(
            `UPDATE users
       SET email = $1,
           updated_at = NOW()
       WHERE id = $2 AND is_active = TRUE
       RETURNING id, email, role, created_at, updated_at`,
            [email, userId]
        );

        return result.rows[0];
    } catch (err) {
        throw err;
    }
};

export const deactivateMe = async (userId) => {
    try {
        const result = await pool.query(
            `UPDATE users
       SET is_active = FALSE,
           updated_at = NOW()
       WHERE id = $1 AND is_active = TRUE
       RETURNING id, email, role, created_at, updated_at`,
            [userId]
        );

        return result.rows[0];
    } catch (err) {
        throw err;
    }
};