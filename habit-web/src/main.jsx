import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";
import "./index.css";

const qc = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={qc}>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/app" element={<App />} />
            <Route path="/login" element={<Navigate to="/app" replace />}/>
            <Route path="/signup" element={<Navigate to="/app" replace />}/>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
