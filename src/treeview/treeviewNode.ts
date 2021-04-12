import {
  ProviderResult,
  Command,
  TreeItem,
  TreeDataProvider,
  Event,
  EventEmitter,
  window,
} from "vscode";
import * as dayjs from "dayjs";
import * as vscode from "vscode";
import { apiGroups } from "./extension";
import * as _path_ from "path";
import { API } from "../types/types";

export abstract class TreeNode extends vscode.TreeItem {
  constructor(
    public label: string,
    protected desc: string,
    public type: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
  }

  get tooltip() {
    return `${this.label}`;
  }

  get description(): string {
    return this.desc;
  }
}

export class GroupNode extends TreeNode {
  iconPath = {
    light: _path_.join(__filename, "..", "..", "resources", "folder.svg"),
    dark: _path_.join(__filename, "..", "..", "resources", "folder.svg"),
  };

  constructor(
    public label: string,
    desc: string,
    public list: API[],
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, desc, "group", collapsibleState);
  }

  get tooltip() {
    return `${this.label}`;
  }

  get description(): string {
    return this.desc;
  }
}

export class APINode extends TreeNode {
  iconPath = {
    light: _path_.join(__filename, "..", "..", "resources", "api.svg"),
    dark: _path_.join(__filename, "..", "..", "resources", "api.svg"),
  };

  constructor(
    public label: string,
    desc: string,
    public props: API,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, desc, "api", collapsibleState);
    this.label = `${props.method} ${props.path}`;
    this.contextValue = "APINode";
  }

  get tooltip() {
    return `${this.label}`;
  }

  get description(): string {
    return this.props.title;
  }
}

export class ApiPropsNode extends TreeNode {
  constructor(
    public label: string,
    desc: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, desc, "apiProps", collapsibleState);
  }

  get tooltip() {
    return `${this.label}`;
  }

  get description(): string {
    return this.desc;
  }
}
