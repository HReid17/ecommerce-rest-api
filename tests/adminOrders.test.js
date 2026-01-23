import supertest from "supertest";
import app from "../src/app.js";
import { createUser, tokenFor, createProduct } from "./helpers.js";

// Create a supertest instance so we can send requests to our app
const request = supertest(app);

describe("Admin orders", () => {

    // This test checks that a normal customer CANNOT access admin-only routes
    test("non-admin cannot access admin orders", async () => {

        // Create a normal customer user
        const user = await createUser({ email: "cust2@test.com", role: "customer" });

        // Generate a JWT token for that user
        const token = tokenFor(user);

        // Try to access the admin orders endpoint using the customer's token
        // We expect a 403 (Forbidden) because they are not an admin
        await request
            .get("/admin/orders")
            .set("Authorization", `Bearer ${token}`)
            .expect(403);
    });

    // This test checks that an admin CAN see all orders
    test("admin can list orders", async () => {

        // Create an admin user
        const admin = await createUser({ email: "admin@test.com", role: "admin" });

        // Generate a token for the admin
        const adminToken = tokenFor(admin);

        // Create a normal customer who will place an order
        const user = await createUser({ email: "buyer@test.com", role: "customer" });

        // Generate a token for the customer
        const token = tokenFor(user);

        // Create a product that the customer can buy
        const product = await createProduct({ stock_quantity: 10 });

        // Add 1 of the product to the customer’s cart
        await request
            .post("/cart/items")
            .set("Authorization", `Bearer ${token}`)
            .send({ productId: product.id, quantity: 1 })
            .expect(201);

        // Checkout the cart to turn it into an order
        await request
            .post("/checkout")
            .set("Authorization", `Bearer ${token}`)
            .expect(201);

        // Now the admin tries to fetch all orders
        const res = await request
            .get("/admin/orders")
            .set("Authorization", `Bearer ${adminToken}`)
            .expect(200);

        // Check that the response contains an array of orders
        expect(Array.isArray(res.body.orders)).toBe(true);

        // Check that at least one order exists
        expect(res.body.orders.length).toBeGreaterThan(0);
    });
});