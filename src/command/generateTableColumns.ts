import axios from "axios";
import * as vscode from "vscode";
import { instance } from "../service";

export async function generateTableColumns(
  context: vscode.ExtensionContext
): Promise<void> {
  try {
    vscode.window.showInformationMessage(`恭喜你登录成功`);
  } catch (e) {
    console.log(e);
  }

  await context.globalState.update("login", true);

  return;
}
