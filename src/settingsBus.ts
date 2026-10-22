// A tiny "something in the saved settings changed" signal, so screens that depend on them (such as the voice buttons)
// update right away instead of after a reload. Settings live in localStorage, which React can't watch by itself.
const listeners = new Set<() => void>();

export const subscribeSettings = (l: () => void) => {
  listeners.add(l);
  return () => void listeners.delete(l);
};

export const notifySettings = () => listeners.forEach((l) => l());
