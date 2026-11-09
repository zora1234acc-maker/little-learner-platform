import "@testing-library/jest-dom";

// Suppress noisy React 18 act() warnings during tests unless we explicitly assert on them.
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes("Warning: An update to")
  ) {
    return;
  }
  originalError(...args);
};
