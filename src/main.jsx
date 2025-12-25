import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import "./styles/base.css";
import "./styles/app.css";
import "./styles/pc.css";
import "./styles/media.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
