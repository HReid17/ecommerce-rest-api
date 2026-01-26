import express from 'express';

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js"; 

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/products.routes.js';
import usersRoutes from './routes/users.routes.js';
import cartRoutes from './routes/carts.routes.js';
import orderRoutes from './routes/orders.routes.js';
import checkoutRoutes from "./routes/checkout.routes.js";
import adminOrdersRoutes from "./routes/adminOrders.routes.js";

import { pool } from './db/pool.js';

const app = express();

app.use(express.json());

// When someone visits /api-docs, show them a website that reads the instruction manual (swaggerSpec) and displays it.
// Express Runs swaggerUi.serve - loads the Swagger UI webpage
// Runs swaggerUi.setup(swaggerSpec) - gives that page my API’s JSON description
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// API Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// DB health check
app.get("/db-health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() as now;");
    res.json({ db: "ok", now: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ db: "error" });
  }
});

// Routes
app.use("/auth", authRoutes)
app.use("/products", productRoutes)
app.use("/users", usersRoutes)
app.use("/cart", cartRoutes)
app.use("/orders", orderRoutes)
app.use("/checkout", checkoutRoutes);
app.use("/admin/orders", adminOrdersRoutes);

export default app;