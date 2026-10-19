import type { Project } from "./types";

/**
 * Files from outside can refer to media that isn't in the project. Drop scenes (and references) that point at nothing,
 * and say what was dropped, so the editor never has to deal with dangling references.
 */
export function repairProject(project: Project): { project: Project; notes: string[] } {
  const mediaIds = new Set(project.media.map((m) => m.id));
  const notes: string[] = [];
  const scenes = project.scenes.filter((s) => {
    const bad = s.source && !mediaIds.has(s.source.mediaId);
    if (bad) notes.push(`Removed a scene that used media missing from the project file.`);
    return !bad;
  });
  const sceneIds = new Set(scenes.map((s) => s.id));
  const lines = project.script.lines.filter((l) => sceneIds.has(l.sceneId));
  if (lines.length !== project.script.lines.length) notes.push("Removed script lines that belonged to removed scenes.");
  if (notes.length === 0) return { project, notes };
  return { project: { ...project, scenes, script: { ...project.script, lines } }, notes };
}
