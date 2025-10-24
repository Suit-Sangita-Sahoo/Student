import { createRoot } from "react-dom/client";
// import App from "./App";
// createRoot (document.querySelector("#root")).render(<App/>)

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import GlobalContext from "./CreateContext/GlobalContext"; // your context

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalContext>
      <App />
    </GlobalContext>
  </React.StrictMode>
);
