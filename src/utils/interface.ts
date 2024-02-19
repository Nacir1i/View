export type ViewConfig = {
  title: string;
  backgroundColor: string;
  color: string;
};

export interface ViewStore {
  currentView: View;
  setCurrentView(view: View): void;
}

export type View = "DIRECTORY" | "FILE" | "HELP";

export type Targets = "dir" | "file";

export type Actions =
  | "change"
  | "open"
  | "quit"
  | "switch"
  | "clear"
  | "create"
  | "save"
  | "help";

export interface DirectoryEntity {
  name: string;
  path: string;
  created_at: string;
  // size: number;
  is_dir: boolean;
}

export interface DirectoryStore {
  path: string;
  content: DirectoryEntity[];
  set(path: string, content: DirectoryEntity[]): void;
}

export interface FileEntity {
  content: string;
  path: string;
  extension?: string;
}

export interface FileStore {
  path: string;
  content: string;
  set(path: string, content: string): void;
}

export interface CommandHistory {
  history: string[];
  addHistory(command: string): void;
  clearHistory(): void;
}
