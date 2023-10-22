import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ApiStateProvider } from "./Context/ApiStateContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ApiStateProvider>
      <App />
    </ApiStateProvider>
  </React.StrictMode>
);
