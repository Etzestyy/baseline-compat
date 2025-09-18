// quickFixProvider.ts
// Provides CodeActions for risky web features in JS/TS files

import * as vscode from 'vscode';
import { getFeatureByName } from './baselineClient';

const GUARD_SNIPPETS: Record<string, string> = {
  'fetch': "if ('fetch' in window) { /* safe usage */ } else { /* fallback */ }",
  'attachShadow': "if ('attachShadow' in Element.prototype) { /* safe usage */ } else { /* fallback */ }"
};

export class BaselineQuickFixProvider implements vscode.CodeActionProvider {
  provideCodeActions(document: vscode.TextDocument, range: vscode.Range, context: vscode.CodeActionContext): vscode.ProviderResult<vscode.CodeAction[]> {
    const word = document.getText(range);
    const feature = getFeatureByName(word);
    if (!feature) return;
    const actions: vscode.CodeAction[] = [];
    // Guard insertion quick-fix
    if (GUARD_SNIPPETS[word]) {
      const fix = new vscode.CodeAction(`Insert feature-detection guard for '${word}'`, vscode.CodeActionKind.QuickFix);
      fix.edit = new vscode.WorkspaceEdit();
      fix.edit.insert(document.uri, range.start, GUARD_SNIPPETS[word] + '\n');
      actions.push(fix);
    }
    // Polyfill stub quick-fix (example)
    const polyfillFix = new vscode.CodeAction(`Show polyfill for '${word}'`, vscode.CodeActionKind.QuickFix);
    polyfillFix.command = {
      title: 'Open polyfill docs',
      command: 'vscode.open',
      arguments: [`https://polyfill.io/v3/polyfill.min.js?features=${word}`]
    };
    actions.push(polyfillFix);
    // Alternative API snippet (example)
    if (word === 'fetch') {
      const altFix = new vscode.CodeAction('Show XMLHttpRequest fallback', vscode.CodeActionKind.QuickFix);
      altFix.command = {
        title: 'Show XMLHttpRequest example',
        command: 'vscode.open',
        arguments: ['https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest']
      };
      actions.push(altFix);
    }
    return actions;
  }
}

export function activateQuickFixProvider(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(['javascript', 'typescript'], new BaselineQuickFixProvider())
  );
}
