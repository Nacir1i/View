import { ViewConfig, View } from "./interface";

export const VIEW_CONFIG: Record<View, ViewConfig> = {
  DIRECTORY: {
    title: "DIRECTORY",
    backgroundColor: "#222831",
    color: "#fafafa",
  },
  FILE: {
    title: "FILE",
    backgroundColor: "#222831",
    color: "#fafafa",
  },
} as const;

export function viewConfig(view: View) {
  return VIEW_CONFIG[view] ?? null;
}
