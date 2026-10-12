import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./styles/index.scss";
import App from "./App.jsx";

import AOS from "aos";
import "aos/dist/aos.css";

AOS.init({
    duration: 800,
    once: true,
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);