import supertest from "supertest";
import app from "../src/app.js";
import { pool } from "../src/db/pool.js";
import { createUser, tokenFor, createProduct } from "./helpers.js";

// Create a supertest instance so we can send requests to our app
const request = supertest(app);

describe("Cart", () => {

    // This test checks that a logged-in user always has an active cart
    test("GET /cart returns active cart", async () => {
        const user = await createUser({ email: "c1@test.com" });
        const token = tokenFor(user);

        // Request the user's cart
        const res = await request
            .get("/cart")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);

        // The response should include a cart with an id
        expect(res.body).toHaveProperty("cart.id");

        // The cart should always have an items array (even if empty)
        expect(Array.isArray(res.body.cart.items)).toBe(true);
    });

    // This test makes sure adding the same product twice increases quantity instead of creating duplicates
    test("POST /cart/items increments quantity when adding same product twice", async () => {
        const user = await createUser({ email: "c2@test.com" });
        const token = tokenFor(user);

        // Create a product with enough stock
        const product = await createProduct({ stock_quantity: 10, price: 500 });

        // Add 2 of the product to the cart
        await request
            .post("/cart/items")
            .set("Authorization", `Bearer ${token}`)
            .send({ productId: product.id, quantity: 2 })
            .expect(201);

        // Add 1 more of the same product
        const res = await request
            .post("/cart/items")
            .set("Authorization", `Bearer ${token}`)
            .send({ productId: product.id, quantity: 1 })
            .expect(201);

        // Find the cart item for this product
        const item = res.body.cart.items.find(
            (i) => Number(i.product_id ?? i.productId) === product.id
        );

        // Make sure the item exists
        expect(item).toBeTruthy();

        // Quantity should now be 3 (2 + 1)
        expect(item.quantity).toBe(3);
    });

    // This test checks that a cart item’s quantity can be changed
    test("PATCH /cart/items/:itemId updates quantity", async () => {
        const user = await createUser({ email: "c3@test.com" });
        const token = tokenFor(user);
        const product = await createProduct({ stock_quantity: 10 });

        // Add 1 product to the cart
        const addRes = await request
            .post("/cart/items")
            .set("Authorization", `Bearer ${token}`)
            .send({ productId: product.id, quantity: 1 })
            .expect(201);

        // Get the ID of the cart item we just added
        const itemId = addRes.body.cart.items[0].id;

        // Update the quantity from 1 to 5
        const patchRes = await request
            .patch(`/cart/items/${itemId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ quantity: 5 })
            .expect(200);

        // Find the updated item in the response
        const updatedItem = patchRes.body.cart.items.find(
            (i) => Number(i.id) === Number(itemId)
        );

        // The item should exist and have the new quantity
        expect(updatedItem).toBeTruthy();
        expect(updatedItem.quantity).toBe(5);
    });

    // This test checks that an item can be removed from the cart
    test("DELETE /cart/items/:itemId removes the item", async () => {
        const user = await createUser({ email: "c4@test.com" });
        const token = tokenFor(user);
        const product = await createProduct({ stock_quantity: 10 });

        // Add a product to the cart
        const addRes = await request
            .post("/cart/items")
            .set("Authorization", `Bearer ${token}`)
            .send({ productId: product.id, quantity: 1 })
            .expect(201);

        // Get the ID of the cart item
        const itemId = addRes.body.cart.items[0].id;

        // Delete that cart item
        const delRes = await request
            .delete(`/cart/items/${itemId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);

        // The cart should now be empty
        expect(delRes.body.cart.items.length).toBe(0);
    });

    // This test checks that deleting /cart removes ALL items
    test("DELETE /cart clears all items", async () => {
        const user = await createUser({ email: "c5@test.com" });
        const token = tokenFor(user);

        // Create two different products
        const p1 = await createProduct({});
        const p2 = await createProduct({ name: "Another product" });

        // Add both products to the cart
        await request
            .post("/cart/items")
            .set("Authorization", `Bearer ${token}`)
            .send({ productId: p1.id, quantity: 1 })
            .expect(201);

        await request
            .post("/cart/items")
            .set("Authorization", `Bearer ${token}`)
            .send({ productId: p2.id, quantity: 1 })
            .expect(201);

        // Clear the entire cart
        const res = await request
            .delete("/cart")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);

        // The cart should now have no items
        expect(res.body.cart.items.length).toBe(0);
    });

    // This test checks that users cannot edit other people's cart items
    test("cannot update another user's cart item", async () => {
        const userA = await createUser({ email: "a@test.com" });
        const userB = await createUser({ email: "b@test.com" });
        const tokenA = tokenFor(userA);
        const tokenB = tokenFor(userB);
        const product = await createProduct({ stock_quantity: 10 });

        // User A adds an item to their cart
        const addRes = await request
            .post("/cart/items")
            .set("Authorization", `Bearer ${tokenA}`)
            .send({ productId: product.id, quantity: 1 })
            .expect(201);

        // Get the cart item ID
        const itemId = addRes.body.cart.items[0].id;

        // User B tries to update User A's cart item
        // This should fail because they do not own it
        await request
            .patch(`/cart/items/${itemId}`)
            .set("Authorization", `Bearer ${tokenB}`)
            .send({ quantity: 2 })
            .expect(404);
    });

    // This test checks that you cannot checkout with an empty cart
    test("checkout returns 400 if cart is empty", async () => {
        const user = await createUser({ email: "empty@test.com" });
        const token = tokenFor(user);

        // Try to checkout without adding anything to the cart
        await request
            .post("/checkout")
            .set("Authorization", `Bearer ${token}`)
            .expect(400);
    });

    // This test checks that checkout fails if there is not enough stock
    test("checkout returns 400 if stock is insufficient", async () => {
        const user = await createUser({ email: "stockfail@test.com" });
        const token = tokenFor(user);

        // Create a product that only has 1 item in stock
        const product = await createProduct({ stock_quantity: 1 });

        // Add 1 item to the cart (this is allowed)
        await request
            .post("/cart/items")
            .set("Authorization", `Bearer ${token}`)
            .send({ productId: product.id, quantity: 1 })
            .expect(201);

        // Manually reduce stock to 0 to simulate someone else buying it
        await pool.query(
            `UPDATE products SET stock_quantity = 0 WHERE id = $1`,
            [product.id]
        );

        // Now checkout should fail because stock is gone
        await request
            .post("/checkout")
            .set("Authorization", `Bearer ${token}`)
            .expect(400);
    });
});
