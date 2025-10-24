// Centralized config for base API URL with defensive checks
const raw = import.meta.env.VITE_API_URL;

// Treat empty strings and literal 'undefined'/'null' as not set
export const BASE_URL = (typeof raw === "string" && raw && raw !== "undefined" && raw !== "null")
  ? raw
  : "http://localhost:5143";

export default BASE_URL;
 