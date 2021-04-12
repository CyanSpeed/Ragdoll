import axios from "axios";
import * as vscode from "vscode";
import { instance } from "../service";
import { getConfiguration } from "../shared";

export async function login(context: vscode.ExtensionContext): Promise<void> {
  // 读取配置文件
  const isLdapLogin = getConfiguration<boolean>(
    "ragdoll-yapi.yapi",
    "ldapLogin"
  );
  const email = getConfiguration<string>("ragdoll-yapi.yapi", "email");
  const password = getConfiguration<string>("ragdoll-yapi.yapi", "password");
  let url = getConfiguration<string>("ragdoll-yapi.yapi", "url")?.trim();
  url = url?.match(/\/$/) ? url : url + "/";
  const pid = getConfiguration<string>("ragdoll-yapi.yapi", "pid")?.trim();

  const { data } = await axios({
    method: "get",
    url: url,
    headers: {
      accept: "application/json",
      // Authorization: `token ${accessToken}`,
    },
  });

  if (!data) return;
  try {
    const res = await instance.get(
      `/api/plugin/export?type=json&pid=43284&status=all&isWiki=false`
    );

    vscode.window.showInformationMessage(`恭喜你登录成功${res}`);
  } catch (e) {
    console.log(e);
  }

  await context.globalState.update("login", true);

  return;
}
