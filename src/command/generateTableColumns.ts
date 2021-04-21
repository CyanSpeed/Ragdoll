import axios from "axios";
import * as vscode from "vscode";
import { instance } from "../service";
import { CodeType, generateJsCode } from "../utils/dataTransform";

export async function generateTableColumns(
  context: vscode.ExtensionContext
): Promise<void> {
  try {
    const apiGroups: any[] | undefined = await context.globalState.get(
      "apiGroups"
    );
    console.log("apiGroups", apiGroups);

    //select API
    const folderSelectList = getFolderSelectList(apiGroups);

    if (folderSelectList) {
      const selectfolder = await vscode.window.showQuickPick(folderSelectList, {
        placeHolder: `Choose API folder`,
        ignoreFocusOut: true,
      });

      if (!selectfolder) {
        return;
      }

      const apiSelectList = getApiSelectList(selectfolder);
      const selectApi: any = await vscode.window.showQuickPick(apiSelectList, {
        placeHolder: `Choose API you want to use`,
        ignoreFocusOut: true,
      });

      if (!selectApi) {
        return;
      }

      const columnsCode = await generateJsCode(
        selectApi.api,
        CodeType.TableColumn
      );
      console.log("columnsCode", columnsCode);
      const editor = vscode.window.activeTextEditor;
      editor?.edit((editBuilder) => {
        const pos = editor.selection.active;
        editBuilder.insert(pos, columnsCode + "\n\n");
      });
    }
  } catch (e) {
    console.log(e);
  }

  return;
}

const getFolderSelectList = (apiGroups: any[] | undefined) => {
  if (apiGroups) {
    const folderList = apiGroups.map((item) => {
      return {
        label: item.name,
        description: item.name,
        list: item.list,
      };
    });
    return folderList;
  }
};

const getApiSelectList = (folder: any) => {
  const apiList = folder.list.map((item: any) => {
    return {
      label: item.title,
      description: `${item.method}:  ${item.path}`,
      api: item,
    };
  });

  return apiList;
};
