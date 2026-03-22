import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div
      id="app-wrapper"
      className="bg-gray-900 bg-medieval-pattern min-h-screen overflow-x-hidden"
    >
      <App />
    </div>
  </StrictMode>
);
