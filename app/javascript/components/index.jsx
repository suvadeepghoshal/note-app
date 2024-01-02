import React from "react";
import App from "./App";
import {createRoot} from "react-dom/client";
import {BrowserRouter} from "react-router-dom";

document.addEventListener("turbo:load", () => {
    const div = createRoot(document.body.appendChild(document.createElement("div")));
    div.render(<App/>)
});