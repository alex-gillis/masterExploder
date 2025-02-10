module.exports = {
    testMatch: ["**/test/*.test.js", "!**/src/**"],
    transform: {
       "^.+\\.js$": "babel-jest",
    },
    setupFiles: ["<rootDir>/.jest/env.js"],
 };