import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { startAutosave } from "./storage/autosave";
import { useStore } from "./store/useStore";
import { applyTheme, savedTheme } from "./ui/theme";
import "./theme.css";
import "./styles.css";

// Apply the saved light/dark choice before the first paint so the page doesn't flash the wrong theme.
applyTheme(savedTheme());

// Load the saved project first; autosave only starts writing once loading has finished, so it can't overwrite it with an empty one.
void useStore.getState().init();
startAutosave();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
