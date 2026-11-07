import mockApi from "./mock";

// Frontend-first: all features driven by local JSON mock data.
// Set VITE_USE_REAL_API=1 to switch to a real backend later.
const USE_REAL = import.meta.env.VITE_USE_REAL_API === "1";

export const api = USE_REAL ? (() => {
  // Real backend client would go here
  return mockApi;
})() : mockApi;

export default mockApi;
