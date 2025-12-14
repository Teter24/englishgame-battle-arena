import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";
import Admin from "./pages/Admin.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";

import "./styles.css"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>

      <Routes>
        {/* Page d’accueil avec toute la structure du site */}
        <Route path="/" element={<App />}>

          {/* Page admin protégée */}

          <Route path="admin-login" element={<AdminLogin />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>

    </BrowserRouter>
  </React.StrictMode>
);
