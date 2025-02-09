import * as vscode from "vscode";
import { basename, join } from "path";
import * as fsExtra from "fs-extra";
import { existsSync, promises } from "fs";

export const selectFolder = async (): Promise<string | undefined> => {
  const options: vscode.OpenDialogOptions = {
    canSelectMany: false,
    canSelectFolders: true, // Allow selecting folders
    canSelectFiles: false, // Disable file selection
    openLabel: "Select Folder",
  };

  const fileUri = await vscode.window.showOpenDialog(options);
  return fileUri?.[0]?.fsPath;
};

export const copyOrMoveFile = async (
  useMove = false
): Promise<string | undefined> => {
  const sourceDir = (await selectFolder()) as string;
  if (!sourceDir) {
    vscode.window.showInformationMessage("File was not selected!");
  }
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0].uri
    .fsPath as string;
  if (!workspaceFolder) {
    vscode.window.showInformationMessage("No active workspace folder!");
  }
  try {
    const newFolderPath = join(workspaceFolder, "ai-created-cap");
    await promises.mkdir(newFolderPath, { recursive: true });
    if (useMove) {
      await fsExtra.move(sourceDir, newFolderPath, {
        overwrite: true,
      });
    } else {
      await fsExtra.copy(sourceDir, newFolderPath, {
        overwrite: true,
      });
    }
    await fsExtra.remove(sourceDir);
    return newFolderPath;
  } catch (e) {
    vscode.window.showErrorMessage("Error during move/copy of file");
  }
  return;
};
