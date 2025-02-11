const path = require('path');

module.exports = {
    testMatch: ["**/src/tests/**/*.test.js"], // Now it looks inside src/tests/
    transform: {
       "^.+\\.js$": "babel-jest",
    },
    setupFilesAfterEnv: [path.resolve(__dirname, ".jest/env.js")], // Ensures dotenv loads
};
