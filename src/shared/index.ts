import { QuickPickItem, workspace, WorkspaceConfiguration } from "vscode";

export interface IQuickItemEx<T> extends QuickPickItem {
  value: T;
}

export function getConfiguration<T>(section: string, key: string) {
  return workspace.getConfiguration(section).get<T>(key);
}
export function getWorkspaceConfiguration(): WorkspaceConfiguration {
  return workspace.getConfiguration("ragdoll-yapi.yapi");
}

export function getWorkspaceFolder(): string {
  return getWorkspaceConfiguration().get<string>("workspaceFolder", "");
}

export enum DescriptionConfiguration {
  InWebView = "In Webview",
  InFileComment = "In File Comment",
  Both = "Both",
  None = "None",
}

export function filterInvalidPath(path: string) {
  const reg = new RegExp('[\\\\/:*?"<>|]', "g");
  return path.replace(reg, "").replace("\n", "");
}
