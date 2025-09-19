
import * as vscode from 'vscode';
import { activateDiagnosticsProvider } from './diagnosticsProvider';
import { activateHoverProvider } from './hoverProvider';
import { activateQuickFixProvider } from './quickFixProvider';
import { BaselineCompatSidebarProvider } from './sidebarProvider';

export function activate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage('Baseline Compat extension activated!');
  activateDiagnosticsProvider(context);
  activateHoverProvider(context);
  activateQuickFixProvider(context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      BaselineCompatSidebarProvider.viewType,
      new BaselineCompatSidebarProvider(context)
    )
  );
}

export function deactivate() {}
