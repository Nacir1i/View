export type ViewConfig = {
  title: string;
  backgroundColor: string;
  color: string;
};

export type View = "DIRECTORY" | "FILE";

export type Targets = "dir" | "file";

export type Actions = "create" | "delete" | "rename" | "change";

export interface DirectoryEntity {
  name: string;
  path: string;
  created_at: string;
  size: number;
  is_dir: boolean;
}
