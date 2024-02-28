import { ref } from "vue";
import {
  CommandHistory,
  DirectoryEntity,
  DirectoryStore,
  FileStore,
  ViewStore,
} from "./utils/interface";

const HELLO = [
  ["h", "o", "l", "l", "o", "!"],
  [],
  ["z", "e", "l", "l", "o", "!", " ", "g", "e", "l", "l", "o", "!"],
  [],
  ["f", "r", "o", "m", " ", "{", "ref", "}", ":"],
];

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
  content: HELLO,
  extension: "",
  set(path: string, content: string[][], extension: string) {
    this.path = path;
    this.content = content;
    this.extension = extension;
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
