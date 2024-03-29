import { ViewConfig, View } from "./interface";

export const VIEW_CONFIG: Record<View, ViewConfig> = {
  DIRECTORY: {
    title: "DIRECTORY",
    backgroundColor: "#32424a",
    color: "#ffebbb",
  },
  FILE: {
    title: "FILE",
    backgroundColor: "#333333",
    color: "#fafafa",
  },
  HELP: {
    title: "HELP",
    backgroundColor: "#393e46",
    color: "#d3d6db",
  },
} as const;

export function viewConfig(view: View) {
  return VIEW_CONFIG[view] ?? null;
}

export function convertDirSize(size: number): string {
  let label = "";
  let div = 0;

  switch (true) {
    case size > 999_999_999:
      label = "gb";
      div = 1_000_000_000;
      break;
    case size > 999_999:
      label = "mb";
      div = 1_000_000;
      break;
    case size > 999:
      label = "kb";
      div = 1_000;
      break;
    default:
      label = "b";
      div = 1;
      break;
  }

  return `${(size / div).toFixed(2)}-${label}`;
}
