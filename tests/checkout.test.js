import app from "../src/app.js"
import { pool } from "../src/db/pool.js";
import supertest from "supertest";
import { createProduct, createUser, tokenFor } from "./helpers.js";

// Create a supertest instance so we can send requests to our app
const request = supertest(app);

describe("Checkout", () => {

    // This test checks that checkout:
    // - creates an order
    // - creates order_items
    // - reduces product stock
    // - and marks the cart as checked out
    test("checkout creates order, order_items, deducts stock, and closes cart", async () => {

        // Create a customer who will place an order
        const user = await createUser({ email: "cust@test.com", role: "customer" });

        // Create a login token for the user
        const token = tokenFor(user);

        // Create a product that can be purchased
        const product = await createProduct({
            price: 1999,
            stock_quantity: 5,
            is_active: true
        });

        // Add 2 of the product to the user's cart
        await request
            .post("/cart/items")
            .set("Authorization", `Bearer ${token}`)
            .send({ productId: product.id, quantity: 2 })
            .expect(201);

        // Perform checkout to create an order
        const res = await request
            .post("/checkout")
            .set("Authorization", `Bearer ${token}`)
            .expect(201);

        // Get the newly created order ID from the response
        const orderId = res.body?.order?.id;

        // Make sure an order was actually created
        expect(orderId).toBeTruthy();

        // Total should be price (1999) * quantity (2)
        expect(Number(res.body.order.total_amount)).toBe(1999 * 2);

        // Check that order_items were created in the database
        const items = await pool.query(
            `SELECT * FROM order_items WHERE order_id = $1`,
            [orderId]
        );

        // There should be exactly one order item
        expect(items.rows).toHaveLength(1);

        // It should reference the correct product
        expect(Number(items.rows[0].product_id)).toBe(product.id);

        // The price should be saved correctly
        expect(Number(items.rows[0].price)).toBe(1999);

        // The quantity should match what was in the cart
        expect(items.rows[0].quantity).toBe(2);

        // Check that the product stock was reduced (5 - 2 = 3)
        const updatedProduct = await pool.query(
            `SELECT stock_quantity FROM products WHERE id = $1`,
            [product.id]
        );

        expect(updatedProduct.rows[0].stock_quantity).toBe(3);

        // Check that the user's cart is now marked as checked_out
        const carts = await pool.query(
            `SELECT status FROM carts WHERE user_id = $1 ORDER BY id DESC LIMIT 1`,
            [user.id]
        );

        expect(carts.rows[0].status).toBe("checked_out");
    });
});
