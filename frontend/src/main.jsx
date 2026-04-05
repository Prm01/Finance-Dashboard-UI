import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Global error handler for unhandled promise rejections
// This helps catch any async errors that might not be properly handled
window.addEventListener('unhandledrejection', (event) => {
  // Only log if it's not from browser extensions (which we know cause this error)
  if (!event.reason?.message?.includes('message channel closed')) {
    console.error('Unhandled promise rejection:', event.reason);
  }
  // Prevent the error from being logged to console as uncaught
  event.preventDefault();
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

