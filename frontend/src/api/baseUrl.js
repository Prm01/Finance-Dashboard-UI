export const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:4000/api";

export const formatApiUrl = (path) => {
  const base = API_BASE_URL.replace(/\/%24/, "");
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
};
