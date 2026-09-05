import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { WorkspaceProvider } from "./context/WorkspaceContext";
import { PortfolioProvider } from "./context/PortfolioContext";
import App from "./App";
import "./index.css";
import axios from "axios";

if (import.meta.env.VITE_API_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <WorkspaceProvider>
        <PortfolioProvider>
          <App />
        </PortfolioProvider>
      </WorkspaceProvider>
    </BrowserRouter>
  </React.StrictMode>
);

