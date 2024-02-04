import { Actions, Targets } from "./interface";

export class Interpreter {
  private ACTIONS: string[] = ["create", "delete", "rename", "change"] as const;
  private TARGET: string[] = ["dir", "file"] as const;

  constructor(private readonly input: string) {}

  parse(): [Actions, Targets, string] | null {
    try {
      const split = this.input.split(" ");

      if (split.length !== 3) {
        throw new ParseError("Wrong number of arguments");
      }
      if (!this.ACTIONS.includes(split[0])) {
        throw new ParseError(`Unknown action: ${split[0]}`);
      }
      if (!this.TARGET.includes(split[1])) {
        throw new ParseError(`Unknown target: ${split[1]}`);
      }

      return split as [Actions, Targets, string];
    } catch (error) {
      if (error instanceof ParseError) {
        console.log(error.getError());
      }
      return null;
    }
  }

  execute() {
    const args = this.parse();
    if (!args) return;

    const [action, target, arg] = args;

    console.log(`Executing command: ${action} ${target} ${arg}`);

    switch (action) {
      case "create":
        break;
      case "delete":
        break;
      case "rename":
        break;
      case "change":
        break;
      default:
        break;
    }
  }
}

class ParseError {
  constructor(private readonly error: string) {}

  public getError(): string {
    return this.error;
  }
}
