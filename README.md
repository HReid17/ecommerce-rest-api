🛒 eCommerce REST API

A full-featured eCommerce backend API built with Node.js, Express, PostgreSQL, JWT authentication, and Swagger documentation.
It supports user authentication, product management, shopping carts, checkout, order processing, and admin order management.


🚀 Features

JWT-based authentication (customers & admins)
Product catalogue with stock management
Shopping cart system
Secure checkout & order creation
Order history for users
Admin order management
PostgreSQL database
Fully documented with Swagger (OpenAPI)
Automated tests with Jest & Supertest


🧰 Tech Stack

Node.js
Express
PostgreSQL
JWT (jsonwebtoken)
bcrypt
Swagger (OpenAPI)
Jest & Supertest
Zod validation


📦 Installation

Clone the repository:
git clone https://github.com/HReid17/ecommerce-rest-api.git
cd ecommerce-rest-api

Install dependencies:
npm install


🔐 Environment Variables

Create a .env file in the project root:

PORT=3000
DATABASE_URL=postgresql://postgres:<your_password>@localhost:5432/ecommerce
JWT_SECRET=mysecret
JWT_EXPIRES_IN=1h

Create a test database and .env.test:
DATABASE_URL=postgresql://postgres:<your_password>@localhost:5432/ecommerce_test
JWT_SECRET=dev_test_secret
NODE_ENV=test


🗄 Database Setup

Create databases:
CREATE DATABASE ecommerce;
CREATE DATABASE ecommerce_test;

Run migrations against both databases.


▶️ Run the API

Development mode:
npm run dev

Production:
npm start

Server will run at:
http://localhost:3000


📘 API Documentation (Swagger)

Open interactive API docs:
http://localhost:3000/api-docs

From there you can:

Register & login
Get JWT token
Authorize
Call protected routes
Test checkout, cart, admin routes, etc


🧪 Run Tests

npm test

This runs:
Integration tests
Real PostgreSQL test database
Cart, checkout, auth, orders, admin flows


🔑 Authentication

Login returns a JWT token:

{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}

Send it on protected routes:
Authorization: Bearer <token>


👤 User Roles:

Customer:	Browse products, cart, checkout, view orders
Admin:      Create/update products, view all orders, update order status


📂 Main API Routes:

Auth	    /auth/register, /auth/login, /auth/me
Products	/products
Cart	    /cart, /cart/items
Checkout	/checkout
Orders	    /orders/me, /orders/:id
Admin	    /admin/orders

Full details available in Swagger UI.


📌 Project Status

This API is fully functional and production-ready:

Auth
Cart
Orders
Stock control
Admin
Documentation
Automated tests


👨‍💻 Author

Harrison Reid
Backend Developer
GitHub: https://github.com/HReid17