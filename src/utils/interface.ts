export type ViewConfig = {
  title: string;
  backgroundColor: string;
  color: string;
};

export type View = "DIRECTORY" | "FILE";

export type Targets = "dir" | "file";

export type Actions = "create" | "delete" | "rename" | "change";
