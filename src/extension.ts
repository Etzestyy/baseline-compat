
import * as vscode from 'vscode';
import { activateDiagnosticsProvider } from './diagnosticsProvider';
import { activateHoverProvider } from './hoverProvider';
import { activateQuickFixProvider } from './quickFixProvider';

export function activate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage('Baseline Compat extension activated!');
  activateDiagnosticsProvider(context);
  activateHoverProvider(context);
  activateQuickFixProvider(context);
}

export function deactivate() {}
