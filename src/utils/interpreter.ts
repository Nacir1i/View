import { Actions, Targets } from "./interface";
import {
  commandHistory,
  directory,
  directoryAbsolutePath,
  file,
  fileContent,
  view,
} from "../store";
import { invoke } from "@tauri-apps/api/tauri";

export class Interpreter {
  private ACTIONS: Readonly<string[]> = [
    "change",
    "open",
    "quit",
    "switch",
    "clear",
    "create",
    "save",
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
        this.changeView();
        break;
      case "clear":
        this.clearCommandHistory();
        break;
      case "create":
        if (target === "file") {
          this.createFile(`${directoryAbsolutePath.value.path}/${arg}`);
        } else if (target === "dir") {
          this.createDir(`${directoryAbsolutePath.value.path}/${arg}`);
        }
        break;
      default:
        break;
    }
  }

  changeView() {
    const desiredView =
      view.value.currentView === "DIRECTORY" ? "FILE" : "DIRECTORY";

    view.value.setCurrentView(desiredView);
  }

  async changeDirectory(path: string) {
    view.value.setCurrentView("DIRECTORY");

    const jumpsArray = path.split("/");
    const absolutPathArray = directoryAbsolutePath.value.path.split("/");

    for (let i = 0; i < jumpsArray.length; i++) {
      if (jumpsArray[i] === "..") {
        absolutPathArray.pop();
      } else {
        absolutPathArray.push(jumpsArray[i]);
      }
    }

    const newAbsolutPath = absolutPathArray.join("/");

    await directory.value.setPath(newAbsolutPath);
  }

  async openFile(path: string) {
    view.value.setCurrentView("FILE");

    const newPath = `${directoryAbsolutePath.value.path}/${path}`;
    console.log({ newPath });

    await file.value.setPath(newPath);
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
        pathString: file.value.path,
        content: fileContent.value.content,
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
