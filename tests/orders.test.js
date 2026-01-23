import supertest from "supertest";
import app from "../src/app.js";
import { createUser, tokenFor, createProduct } from "./helpers.js";

// Create a supertest instance so we can send requests to our app
const request = supertest(app);

describe("Orders (customer)", () => {

    // This test makes sure users can ONLY see their own orders
    test("GET /orders/me returns only my orders", async () => {

        // Create two different users
        const user1 = await createUser({ email: "u1@test.com" });
        const user2 = await createUser({ email: "u2@test.com" });

        // Create login tokens for both users
        const t1 = tokenFor(user1);
        const t2 = tokenFor(user2);

        // Create a product that can be purchased
        const p = await createProduct({ stock_quantity: 10 });

        // User 1 adds the product to their cart
        await request
            .post("/cart/items")
            .set("Authorization", `Bearer ${t1}`)
            .send({ productId: p.id, quantity: 1 })
            .expect(201);

        // User 1 checks out, which creates an order
        await request
            .post("/checkout")
            .set("Authorization", `Bearer ${t1}`)
            .expect(201);

        // User 2 tries to get their orders
        // They should have NONE, because they never checked out
        const res2 = await request
            .get("/orders/me")
            .set("Authorization", `Bearer ${t2}`)
            .expect(200);

        // Make sure the response is an array
        expect(Array.isArray(res2.body.orders)).toBe(true);

        // User 2 should have zero orders
        expect(res2.body.orders.length).toBe(0);

        // Now User 1 checks their own orders
        const res1 = await request
            .get("/orders/me")
            .set("Authorization", `Bearer ${t1}`)
            .expect(200);

        // User 1 should have at least one order
        // This proves our setup (checkout) actually worked
        expect(res1.body.orders.length).toBeGreaterThan(0);
    });

    // This test checks that users cannot view other people's orders
    test("GET /orders/:id is 404 if not owned", async () => {

        // Create two different users
        const user1 = await createUser({ email: "u3@test.com" });
        const user2 = await createUser({ email: "u4@test.com" });

        // Create login tokens
        const t1 = tokenFor(user1);
        const t2 = tokenFor(user2);

        // Create a product
        const p = await createProduct({ stock_quantity: 10 });

        // User 1 adds a product to their cart
        await request
            .post("/cart/items")
            .set("Authorization", `Bearer ${t1}`)
            .send({ productId: p.id, quantity: 1 })
            .expect(201);

        // User 1 checks out and creates an order
        const checkoutRes = await request
            .post("/checkout")
            .set("Authorization", `Bearer ${t1}`)
            .expect(201);

        // Grab the ID of the newly created order
        const orderId = checkoutRes.body.order.id;

        // Make sure we actually got an order ID back
        expect(orderId).toBeTruthy();

        // User 2 tries to access User 1's order
        // They should get 404 (Not Found) so we don't leak data
        await request
            .get(`/orders/${orderId}`)
            .set("Authorization", `Bearer ${t2}`)
            .expect(404);
    });
});
