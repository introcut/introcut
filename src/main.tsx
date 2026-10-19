import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { startAutosave } from "./storage/autosave";
import { useStore } from "./store/useStore";
import "./styles.css";

// Load the saved project first; autosave only starts writing once loading has finished, so it can't overwrite it with an empty one.
void useStore.getState().init();
startAutosave();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
