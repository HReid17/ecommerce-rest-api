// Import dotenv so we can load environment variables from a file
import { config } from "dotenv";

// Load variables from the .env.test file into process.env
// This lets us use a separate database, JWT secret, etc. for tests
config({ path: ".env.test" });

