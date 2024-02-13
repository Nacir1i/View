import { ref } from "vue";
import { DirectoryStore, FileStore, ViewStore } from "./utils/interface";

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

export const file = ref<FileStore>({
  path: "",
  async setPath(path) {
    this.path = path;
  },
});
