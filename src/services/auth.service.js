import bcrypt from "bcrypt";
import { pool } from "../db/pool.js";

const SALT_ROUNDS = 10;

export const registerUser = async ({ email, password }) => {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    try {
        const result = await pool.query(
            `INSERT INTO users (email, password_hash)
            VALUES ($1, $2)
            RETURNING id, email, role, created_at`,
            [email, hashedPassword]
        );

        return result.rows[0];
    } catch (err) {
        if (err.code === '23505') {
            const e = new Error("EMAIL_ALREADY_EXISTS");
            e.status = 409;
            throw e;
        }

        throw err;
    }
};

export const loginUser = async ({ email, password }) => {

    // 1. Find user by email
    const result = await pool.query(
        `SELECT id, email, password_hash, role
        FROM users
        WHERE email = $1`,
        [email]
    );

    const user = result.rows[0]

    // 2. Fail if user not found
    if (!user) {
        const err = new Error("INVALID_CREDENTIALS");
        err.status = 401;
        throw err;
    }

    // 3. Compare the passwords
    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
        const err = new Error("INVALID_CREDENTIALS");
        err.status = 401;
        throw err;
    }

    // 4. Return safe user object
    return {
        id: user.id,
        email: user.email,
        role: user.role,
    };
};