import { useStore } from "../store/useStore";

/** Open the file chooser and add what the person picks to the open project (a project is created if none is open). */
export function pickFiles() {
  const input = document.createElement("input");
  input.type = "file";
  input.multiple = true;
  input.accept = "video/*,image/*,audio/*";
  input.onchange = () => void useStore.getState().addFiles([...(input.files ?? [])]);
  input.click();
}
