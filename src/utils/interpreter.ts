import {
  Actions,
  DirectoryEntity,
  FileEntity,
  Targets,
  View,
} from "./interface";
import { commandHistory, directoryStore, fileStore, view } from "../store";
import { invoke } from "@tauri-apps/api/tauri";
import { join, resolve } from "@tauri-apps/api/path";

export class Interpreter {
  private ACTIONS: Readonly<string[]> = [
    "change",
    "open",
    "quit",
    "switch",
    "clear",
    "create",
    "save",
    "help",
  ];
  private TARGET: Readonly<string[]> = ["dir", "file"];

  constructor(private readonly input: string) {}

  parse(): [Actions, Targets, string] | null {
    commandHistory.value.addHistory(this.input);

    try {
      const split = this.input.split(" ");

      if (split.length > 3) {
        throw new ParseError("Too many arguments (max: 3)");
      }
      if (!this.ACTIONS.includes(split[0])) {
        throw new ParseError(`Unknown action: ${split[0]}`);
      }
      if (!this.TARGET.includes(split[1]) && split.length > 1) {
        throw new ParseError(`Unknown target: ${split[1]}`);
      }

      return split as [Actions, Targets, string];
    } catch (error) {
      if (error instanceof ParseError) {
        const parseError = error.getError();
        commandHistory.value.addHistory(parseError);
      }
      return null;
    }
  }

  execute() {
    const args = this.parse();
    if (!args) return;

    const [action, target, arg] = args;

    switch (action) {
      case "quit":
        this.quitApp();
        break;
      case "save":
        this.updateFile();
        break;
      case "change":
        if (target === "dir") {
          this.changeDirectory(arg);
        }
        break;
      case "open":
        if (target === "file") {
          this.openFile(arg);
        }
        break;
      case "switch":
        if (!target) {
          this.changeView();
        } else if (target === "file") {
          this.changeView("FILE");
        } else if (target === "dir") {
          this.changeView("DIRECTORY");
        }
        break;
      case "clear":
        this.clearCommandHistory();
        break;
      case "create":
        if (target === "file") {
          this.createFile(`${directoryStore.value.path}/${arg}`);
        } else if (target === "dir") {
          this.createDir(`${directoryStore.value.path}/${arg}`);
        }
        break;
      case "help":
        this.changeView("HELP");
        break;
      default:
        break;
    }
  }

  changeView(newView?: View) {
    if (newView) {
      view.value.setCurrentView(newView);
      return;
    }

    const desiredView =
      view.value.currentView === "DIRECTORY" ? "FILE" : "DIRECTORY";

    view.value.setCurrentView(desiredView);
  }

  async changeDirectory(path: string) {
    try {
      const jumpsArray = path.split("/");
      const newPath = await resolve(directoryStore.value.path, ...jumpsArray);

      const data = await invoke<{
        data: DirectoryEntity[];
        absolute_path: string;
      }>("open_dir", {
        pathString: newPath,
      });

      directoryStore.value.set(newPath, data.data);

      view.value.setCurrentView("DIRECTORY");
    } catch (error) {
      commandHistory.value.addHistory(error as string);
    }
  }

  async openFile(path: string) {
    try {
      const newPath = await join(directoryStore.value.path, path);

      const data = await invoke<FileEntity>("open_file", {
        pathString: newPath,
      });

      fileStore.value.set(newPath, data.content);

      view.value.setCurrentView("FILE");
    } catch (error) {
      commandHistory.value.addHistory(error as string);
    }
  }

  async quitApp() {
    await invoke<void>("quit_app");
  }

  clearCommandHistory() {
    commandHistory.value.clearHistory();
  }

  async createFile(path: string) {
    try {
      await invoke<void>("create_file_command", { pathString: path });
    } catch (error) {
      commandHistory.value.addHistory(error as string);
    }
  }

  async createDir(path: string) {
    try {
      await invoke<void>("create_dir_command", { pathString: path });
    } catch (error) {
      commandHistory.value.addHistory(error as string);
    }
  }

  async updateFile() {
    try {
      await invoke<void>("update_file_command", {
        pathString: fileStore.value.path,
        content: fileStore.value.content,
      });
    } catch (error) {
      commandHistory.value.addHistory(error as string);
    }
  }
}

class ParseError {
  constructor(private readonly error: string) {}

  public getError(): string {
    return this.error;
  }
}
