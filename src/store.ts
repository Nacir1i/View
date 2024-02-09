import { ref } from "vue";
import { View } from "./utils/interface";

interface ViewStore {
  currentView: View;
  setCurrentView(view: View): void;
}

interface DirectoryStore {
  path: string;
  setPath(path: string): Promise<void>;
}

export const view = ref<ViewStore>({
  currentView: "DIRECTORY",
  setCurrentView(view) {
    this.currentView = view;
  },
});

export const directory = ref<DirectoryStore>({
  path: "~",
  async setPath(path) {
    this.path = path;
  },
});

export const directoryAbsolutePath = ref<DirectoryStore>({
  path: "~",
  async setPath(path) {
    this.path = path;
  },
});
