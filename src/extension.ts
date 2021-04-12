// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { commands, window } from "vscode";
import { YapiView } from "./treeview/yapiViewTreeView";
import { generateSearchItems } from "./command/generateSearchItems";
import { generateTableColumns } from "./command/generateTableColumns";
import { login } from "./command/login";
import { sync } from "glob";
import { syncFromYapi } from "./command/sync";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(
  context: vscode.ExtensionContext
): Promise<void> {
  try {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "ragdoll" is now active!');

    // -------- YapiView 相关 -------------
    const yapiViewProvider = new YapiView(context, []);
    window.createTreeView("yapiView", {
      treeDataProvider: yapiViewProvider,
    });
    commands.registerCommand("yapiView.refresh", () => {
      // yapiViewProvider.refresh();
      syncFromYapi(context);
      vscode.window.showInformationMessage("刷新");
    });
    commands.registerCommand("yapiView.login", () => {
      login(context);
    });
    commands.registerCommand("ragdoll.generateSearchItems", () => {
      generateSearchItems(context);
    });
    commands.registerCommand("ragdoll.generateTableColumns", () => {
      generateTableColumns(context);
    });
    // -------- YapiView 相关 -------------

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand(
      "ragdoll.helloWorld",
      () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage("Hello World from Ragdoll!");
      }
    );

    context.subscriptions.push(disposable);
  } catch (error) {
    window.showInformationMessage(error);
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
