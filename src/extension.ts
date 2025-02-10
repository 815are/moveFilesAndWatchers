"use strict";

import * as vscode from "vscode";
import { copyOrMoveFile, selectFolder } from "./files";
import { join } from "path";

export function activate(context: vscode.ExtensionContext) {
  console.log('Test says "Hello"');

  // Command to register global handler to listen all xml files
  context.subscriptions.push(
    vscode.commands.registerCommand("watcherTest.copy", async (context) => {
      await copyOrMoveFile();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("watcherTest.move", async (context) => {
      await copyOrMoveFile(true);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("watcherTest.register", async (context) => {
      const selectedFolder = await selectFolder();
      if (selectedFolder) {
        const pattern = join(selectedFolder, "**", "*.json");
        // Watcher directly to file
        const watch = vscode.workspace.createFileSystemWatcher(pattern);
        watch.onDidChange((uri: vscode.Uri) => {
          vscode.window.showInformationMessage(
            "Change watcher for '*.json' is triggered"
          );
        });
        watch.onDidCreate((uri: vscode.Uri) => {
          vscode.window.showInformationMessage("Create watcher is triggered");
        });

        const pattern2 = join(selectedFolder, "**");
        // Watcher directly to file
        const watch2 = vscode.workspace.createFileSystemWatcher(pattern2);
        watch2.onDidChange((uri: vscode.Uri) => {
          vscode.window.showInformationMessage(
            "Change watcher for '*' is triggered"
          );
        });
        watch2.onDidCreate((uri: vscode.Uri) => {
          vscode.window.showInformationMessage("Create watcher 2 is triggered");
        });
        vscode.window.showInformationMessage(
          `WatcherS ARE registered to "${pattern}"`
        );
      }
    })
  );
}
