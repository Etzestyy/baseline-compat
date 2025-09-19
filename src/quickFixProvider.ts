// quickFixProvider.ts
// Provides CodeActions for risky web features in JS/TS files

import * as vscode from 'vscode';
import { getFeatureByName } from './baselineClient';
import { POLYFILL_SNIPPETS } from './autofix';

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
    // Polyfill auto-fix quick-fix
    if (POLYFILL_SNIPPETS[word]) {
      const polyfillFix = new vscode.CodeAction(`Insert polyfill for '${word}'`, vscode.CodeActionKind.QuickFix);
      polyfillFix.edit = new vscode.WorkspaceEdit();
      polyfillFix.edit.insert(document.uri, new vscode.Position(0, 0), POLYFILL_SNIPPETS[word]);
      actions.push(polyfillFix);
    }
    // Polyfill docs quick-fix (example)
    const polyfillDocsFix = new vscode.CodeAction(`Show polyfill for '${word}'`, vscode.CodeActionKind.QuickFix);
    polyfillDocsFix.command = {
      title: 'Open polyfill docs',
      command: 'vscode.open',
      arguments: [`https://polyfill.io/v3/polyfill.min.js?features=${word}`]
    };
    actions.push(polyfillDocsFix);
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
