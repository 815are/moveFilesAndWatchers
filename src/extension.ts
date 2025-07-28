"use strict";

import { join } from "path";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "fileWatcher.selectAndWatchFile",
    async () => {
      const uri = await vscode.window.showOpenDialog({
        canSelectMany: false,
        openLabel: "Select a file to watch",
        filters: {
          "All files": ["*"],
        },
      });

      if (!uri || uri.length === 0) {
        vscode.window.showInformationMessage("No file selected.");
        return;
      }

      const selectedFile = uri[0];
      vscode.window.showInformationMessage(
        `Watching file: ${selectedFile.fsPath}` 
      );
      const pattern = join(selectedFile.fsPath);
      const watcher = vscode.workspace.createFileSystemWatcher(pattern);

      watcher.onDidChange(() => {
        vscode.window.showInformationMessage(
          `File changed: ${selectedFile.fsPath}`
        );
      });

      watcher.onDidDelete(() => {
        vscode.window.showWarningMessage(
          `File deleted: ${selectedFile.fsPath}`
        );
        watcher.dispose(); // stop watching if file is deleted
      });

      context.subscriptions.push(watcher);
    }
  );

  context.subscriptions.push(disposable);
}
