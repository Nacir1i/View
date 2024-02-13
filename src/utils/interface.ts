export type ViewConfig = {
  title: string;
  backgroundColor: string;
  color: string;
};

export interface ViewStore {
  currentView: View;
  setCurrentView(view: View): void;
}

export type View = "DIRECTORY" | "FILE";

export type Targets = "dir" | "file";

export type Actions = "change" | "open" | "quit" | "switch";

export interface DirectoryEntity {
  name: string;
  path: string;
  created_at: string;
  // size: number;
  is_dir: boolean;
}

export interface DirectoryStore {
  path: string;
  setPath(path: string): Promise<void>;
}

export interface FileEntity {
  content: string;
  path: string;
  extension?: string;
}

export interface FileStore {
  path: string;
  setPath(path: string): Promise<void>;
}
