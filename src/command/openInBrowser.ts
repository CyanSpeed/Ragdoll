import * as vscode from "vscode";
// import * as _ from "lodash";
import { getConfiguration } from "../shared";
import { APIGroup } from "../types/types";
import { instance } from "../service";
import { transformYapi } from "../utils/dataTransform";
import { RagdollTreeView } from "../treeview/ragdollTreeView";
import { APINode } from "../treeview/treeviewNode";

export async function openInBrowser(
  context: vscode.ExtensionContext,
  node: any
): Promise<any> {
  let url = getConfiguration<string>("ragdoll-yapi.yapi", "url")?.trim();
  url = url?.match(/\/$/) ? url : url + "/";
  const pid = getConfiguration<string>("ragdoll-yapi.yapi", "pid")?.trim();

  if (node.type === "api") {
    const props = node.props as APINode["props"];
    vscode.env.openExternal(
      vscode.Uri.parse(`${url}project/${pid}/interface/api/${props.yapi!.id}`)
    );
  }
}
