/** Three generated 9:16 "cards" so the editor can be tested without any files of your own. */
const CARDS = [
  { title: "HOOK", sub: "Scene 1", from: "#7c3aed", to: "#db2777" },
  { title: "MIDDLE", sub: "Scene 2", from: "#0ea5e9", to: "#10b981" },
  { title: "CALL TO ACTION", sub: "Scene 3", from: "#f59e0b", to: "#ef4444" },
];

function canvasToFile(c: HTMLCanvasElement, name: string): Promise<File> {
  return new Promise((resolve, reject) =>
    c.toBlob(
      (b) => (b ? resolve(new File([b], name, { type: "image/png" })) : reject(new Error("demo card failed"))),
      "image/png",
    ),
  );
}

export async function makeDemoFiles(): Promise<File[]> {
  const files: File[] = [];
  for (const [i, card] of CARDS.entries()) {
    const c = document.createElement("canvas");
    c.width = 1080;
    c.height = 1920;
    const g = c.getContext("2d")!;
    const grad = g.createLinearGradient(0, 0, 1080, 1920);
    grad.addColorStop(0, card.from);
    grad.addColorStop(1, card.to);
    g.fillStyle = grad;
    g.fillRect(0, 0, 1080, 1920);
    g.fillStyle = "white";
    g.textAlign = "center";
    g.font = "bold 150px system-ui, sans-serif";
    g.fillText(card.title, 540, 940, 980);
    g.font = "60px system-ui, sans-serif";
    g.fillText(card.sub, 540, 1040);
    files.push(await canvasToFile(c, `demo-${i + 1}-${card.title.toLowerCase().replace(/ /g, "-")}.png`));
  }
  return files;
}
