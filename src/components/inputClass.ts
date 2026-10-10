/** Shared form input styling. Non-component module (see controls.tsx for components). */

export function inputClass(extra = ''): string {
  return `pms-input w-full px-3 py-2.5 ${extra}`;
}
