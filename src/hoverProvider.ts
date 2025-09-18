// hoverProvider.ts
// Provides hover info for risky web features in JS/TS files

import * as vscode from 'vscode';
import { getFeatureByName, featureCompatibilityScore } from './baselineClient';

export class BaselineHoverProvider implements vscode.HoverProvider {
  provideHover(document: vscode.TextDocument, position: vscode.Position): vscode.ProviderResult<vscode.Hover> {
    const range = document.getWordRangeAtPosition(position);
    if (!range) return;
    const word = document.getText(range);
    const feature = getFeatureByName(word);
    if (feature) {
      const score = featureCompatibilityScore(feature);
      let message = `**${feature.name}**\n\n`;
      message += `Compatibility: **${score}%** across Baseline targets.\n`;
      if (feature.description) {
        message += `\n${feature.description}\n`;
      }
      if (feature.spec) {
        message += `\n[Spec](${Array.isArray(feature.spec) ? feature.spec[0] : feature.spec})`;
      }
      // Example remediation link
      message += `\n[Remediation guide](https://web-features.explore.dev/features/${feature.id || word})`;
      return new vscode.Hover(new vscode.MarkdownString(message), range);
    }
    return;
  }
}

export function activateHoverProvider(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(['javascript', 'typescript'], new BaselineHoverProvider())
  );
}
