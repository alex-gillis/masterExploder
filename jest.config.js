const path = require('path');

module.exports = {
    testMatch: ["**/tests/**/*.test.js"], // Ensures Jest scans the test folder
    transform: {
       "^.+\\.js$": "babel-jest", // Ensures ES module support
    },
    setupFilesAfterEnv: [path.resolve(__dirname, ".jest/env.js")], // Ensures dotenv loads
};
