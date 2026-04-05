const DEFAULT_BACKEND_URL = "http://localhost:4000/api";

const rawBackendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL;
export const API_BASE_URL = rawBackendUrl
  ? String(rawBackendUrl).replace(/\/+$/, "")
  : DEFAULT_BACKEND_URL;

console.log("API BASE URL:", API_BASE_URL);

export const formatApiUrl = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
