export default {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  setupFiles: ["<rootDir>/tests/env.setup.js"],         // runs BEFORE imports
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],     // runs AFTER Jest is ready
};


