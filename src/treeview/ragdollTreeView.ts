import {
  ProviderResult,
  Command,
  TreeItem,
  TreeDataProvider,
  Event,
  EventEmitter,
  window,
} from "vscode";
import * as vscode from "vscode";
import * as path from "path";
import { getProblemList } from "../service";
import { login } from "../command/login";
import { filterInvalidPath } from "../shared";
import { APINode, ApiPropsNode, GroupNode, TreeNode } from "./treeviewNode";
import { API } from "../types/types";
import dayjs = require("dayjs");

export class RagdollTreeView implements TreeDataProvider<TreeNode> {
  apiGroups: any;
  constructor(private context: vscode.ExtensionContext, apiGroups: any[]) {
    this.apiGroups = apiGroups;
  }

  private _onDidChangeTreeData: EventEmitter<any> = new EventEmitter<any>();

  readonly onDidChangeTreeData: Event<any> = this._onDidChangeTreeData.event;
  getTreeItem(element: TreeNode): TreeItem {
    return element;
  }
  getChildren(element?: TreeNode): ProviderResult<TreeNode[]> {
    if (element) {
      if (element.type === "group") {
        return getApiList((<GroupNode>element).list);
      }
      if (element.type === "api") {
        return getApiProps((<APINode>element).props);
      }
    } else {
      return getGroups(this.apiGroups);
    }
    return [];
  }

  refresh() {
    this._onDidChangeTreeData.fire(undefined);
  }
}

function getGroups(apiGroups: any) {
  const treeNodes: GroupNode[] = [];
  if (apiGroups.length) {
    apiGroups.forEach((group: { name: string; desc: string; list: API[] }) => {
      treeNodes.push(
        new GroupNode(
          group.name,
          group.desc,
          group.list,
          vscode.TreeItemCollapsibleState.Collapsed
        )
      );
    });
  }
  return treeNodes;
}

function getApiList(list: API[]) {
  const treeNodes: APINode[] = [];
  if (list.length) {
    list.forEach((api) => {
      treeNodes.push(
        new APINode(
          api.title,
          api.desc,
          api,
          vscode.TreeItemCollapsibleState.Collapsed
        )
      );
    });
  }
  return treeNodes;
}

function getApiProps(props: API) {
  const treeNodes: ApiPropsNode[] = [];
  const method = new ApiPropsNode(
    `Method: ${props.method}`,
    "",
    vscode.TreeItemCollapsibleState.None
  );
  const path = new ApiPropsNode(
    `Path: ${props.path}`,
    "",
    vscode.TreeItemCollapsibleState.None
  );
  const desc = new ApiPropsNode(
    `Desc: ${props.desc}`,
    "",
    vscode.TreeItemCollapsibleState.None
  );
  const time = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const updateTime = new ApiPropsNode(
    `UpdateAt: ${time}`,
    "",
    vscode.TreeItemCollapsibleState.None
  );

  treeNodes.push(method, path, desc, updateTime);
  return treeNodes;
}
