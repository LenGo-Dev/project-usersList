import inquirer from "inquirer";
import consola from "consola";

type InquirerAnswers = {
  action: Action;
}

interface User {
  name: string;
  age: number;
}

enum Action {
  List = "list",
  Add = "add",
  Remove = "remove",
  Quit = "quit"
}

enum MessageVariant {
  SUCCESS = "success",
  ERROR = "error",
  INFO = "info",
}

const startApp = async () => {
  const answer: InquirerAnswers = await inquirer.prompt([{
    name: 'action',
    type: 'input',
    message: 'How can I help you?',
  }]);

  switch (answer.action) {
    case Action.List:
      usersData.showAll();
      break;
    case Action.Add:
      const user = await inquirer.prompt([{
        name: 'name',
        type: 'input',
        message: 'Enter name',
      }, {
        name: 'age',
        type: 'number',
        message: 'Enter age',
      }]);
      usersData.add(user);
      break;
    case Action.Remove:
      const name = await inquirer.prompt([{
        name: 'name',
        type: 'input',
        message: 'Enter name',
      }]);
      usersData.remove(name.name);
      break;
    case Action.Quit:
      Message.showColorized(MessageVariant.INFO, "Bye bye!");
      return;
  }

  startApp();
}

startApp();

class Message {
  constructor(private content: string) {}

  public show(): void {
    console.log(this.content);
  }

  public capitalize(): void {
    this.content =
      this.content.charAt(0).toUpperCase() +
      this.content.slice(1).toLowerCase();
  }

  public toUpperCase(): void {
    this.content = this.content.toUpperCase();
  }

  public toLowerCase(): void {
    this.content = this.content.toLowerCase();
  }

  public static showColorized(
    variant: MessageVariant,
    message: string
  ): void {
    switch (variant) {
      case MessageVariant.SUCCESS:
        consola.success(message);
        break;
      case MessageVariant.ERROR:
        consola.error(message);
        break;
      case MessageVariant.INFO:
        consola.info(message);
        break;
    }
  }
}

class UsersData {
  private data: User[] = [];

  public showAll(): void {
    Message.showColorized(MessageVariant.INFO, "Users data");

    if (this.data.length === 0) {
      console.log("No data...");
      return;
    }

    console.table(this.data);
  }

  public add(user: User): void {
    if (
      typeof user.name === "string" &&
      user.name.length > 0 &&
      typeof user.age === "number" &&
      user.age > 0
    ) {
      this.data.push(user);

      Message.showColorized(
        MessageVariant.SUCCESS,
        "User has been successfully added!"
      );
    } else {
      Message.showColorized(
        MessageVariant.ERROR,
        "Wrong data!"
      );
    }
  }

  public remove(name: string): void {
    const index = this.data.findIndex(
      user => user.name === name
    );

    if (index === -1) {
      Message.showColorized(
        MessageVariant.ERROR,
        "User not found..."
      );

      return;
    }

    this.data.splice(index, 1);

    Message.showColorized(
      MessageVariant.SUCCESS,
      "User deleted!"
    );
  }
}

const usersData = new UsersData();

console.log("\n");
console.info("???? Welcome to the UsersApp!");
console.log("====================================");
Message.showColorized(MessageVariant.INFO, "Available actions");
console.log("\n");
console.log("list – show all users");
console.log("add – add new user to the list");
console.log("remove – remove user from the list");
console.log("quit – quit the app");
console.log("\n");
