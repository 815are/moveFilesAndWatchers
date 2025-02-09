"use strict";

import * as vscode from "vscode";
import { copyOrMoveFile, selectFolder } from "./files";
import { join } from "path";

/**
 * Get watch pattern string for 'vscode.createFileSystemWatcher'.
 * Method returns pattern, which works on desktop VSCode and SBAS environment.
 * If you changing code of that method, then please check do your changes work on SBAS environment.
 * @param root - root path.
 * @param {...string} pathParts - Paths parts which should be concated/joined together and with root.
 * @return A path string.
 */
const createWatchPatternString = (
  rootPath: string,
  ...pathParts: string[]
): string => {
  let path: string;
  if (rootPath) {
    path = join(rootPath, ...pathParts);
  } else {
    path = join(...pathParts);
  }
  const watchPrefix = ["darwin", "win32"].includes(process.platform)
    ? "**"
    : "";
  path = watchPrefix + vscode.Uri.file(path).path;
  return path;
};

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
        const watch = vscode.workspace.createFileSystemWatcher(
          createWatchPatternString(pattern)
        );
        watch.onDidChange((uri: vscode.Uri) => {
          vscode.window.showInformationMessage("Change watcher is triggered");
        });
        watch.onDidCreate((uri: vscode.Uri) => {
          vscode.window.showInformationMessage("Create watcher is triggered");
        });

        const pattern2 = join(selectedFolder, "**");
        // Watcher directly to file
        const watch2 = vscode.workspace.createFileSystemWatcher(
          createWatchPatternString(pattern2)
        );
        watch2.onDidChange((uri: vscode.Uri) => {
          vscode.window.showInformationMessage("Change watcher 2 is triggered");
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
