import swaggerJSDoc from "swagger-jsdoc";

/* swagger.js is the description builder

. Looks through route files
. Reads the @openapi comment blocks
. Builds one big JSON description of my API */

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "eCommerce REST API",
    version: "1.0.0",
    description: "Backend API for products, carts, orders, checkout, and admin.",
  },
  servers: [
    { url: "http://localhost:3000", description: "Local dev" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    { bearerAuth: [] }, // makes JWT apply globally
  ],
};

export const swaggerSpec = swaggerJSDoc({
  swaggerDefinition,
  // point this at where your route files live
  apis: ["./src/routes/*.js"],
});
