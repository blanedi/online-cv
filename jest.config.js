module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/node_modules/@testing-library/jest-dom/jest-globals.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": ["@swc/jest"],
  },
  transformIgnorePatterns: ["/node_modules/(?!@?react|@?testing-library)", "^.+\\.module\\.(css|sass|scss)$"],
  testMatch: ["**/__tests__/**/*.test.(ts|tsx)"]
};
