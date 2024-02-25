import { ref } from "vue";
import {
  CommandHistory,
  DirectoryEntity,
  DirectoryStore,
  FileStore,
  ViewStore,
} from "./utils/interface";

export const view = ref<ViewStore>({
  currentView: "HELP",
  setCurrentView(view) {
    this.currentView = view;
  },
});

export const directoryStore = ref<DirectoryStore>({
  path: "",
  content: [],
  async set(path: string, content: DirectoryEntity[]) {
    this.path = path;
    this.content = content;
  },
});

export const fileStore = ref<FileStore>({
  path: "",
  content: [],
  set(path: string, content: string[][]) {
    this.path = path;
    this.content = content;
  },
});

export const commandHistory = ref<CommandHistory>({
  history: ["Welcome"],
  addHistory(command) {
    this.history = [...this.history, command];
  },
  clearHistory() {
    this.history = [];
  },
});
