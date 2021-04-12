import axios from "axios";
import * as vscode from "vscode";
import { instance } from "../service";
import { generateJsCode } from "../utils/dataTransform";

export async function generateSearchItems(
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

      const searchItemsCode = await generateJsCode(selectApi.api);
      console.log("searchItemsCode", searchItemsCode.searchItems);
      const editor = vscode.window.activeTextEditor;
      editor?.edit((editBuilder) => {
        const pos = editor.selection.active;
        editBuilder.insert(
          pos,
          searchItemsCode.searchItems + "\n\n" + searchItemsCode.columns
        );
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
