import supertest from "supertest";
import app from "../src/app.js";
import { createUser } from "./helpers.js";

// Create a supertest instance so we can send requests to our app
const request = supertest(app);

describe("Auth middleware", () => {

    // This test checks that protected routes reject requests
    // when NO authentication token is provided
    test("protected route returns 401 without token", async () => {
        await request
            .get("/cart")
            .expect(401); // 401 = Not authenticated
    });

    // This test checks that fake or broken tokens are also rejected
    test("protected route returns 401 with invalid token", async () => {
        await request
            .get("/cart")
            .set("Authorization", "Bearer not-a-real-token")
            .expect(401); // Still not authenticated
    });

    // This test checks that a real, valid token allows access
    test("protected route allows access with valid token", async () => {

        // Create a real user in the database
        const user = await createUser({ email: "auth@test.com", role: "customer" });

        // Log in using the API (this is more realistic than manually generating a token)
        const loginRes = await request
            .post("/auth/login")
            .send({
                email: "auth@test.com",
                password: "test123"
            })
            .expect(200);

        // Extract the JWT token from the login response
        const token = loginRes.body.token;

        // Make sure we actually received a token
        expect(token).toBeTruthy();

        // Try accessing a protected route using the valid token
        // This should now succeed
        await request
            .get("/cart")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
    });
});
