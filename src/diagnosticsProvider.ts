// diagnosticsProvider.ts
// Provides VS Code diagnostics and hover info for risky web features

import * as vscode from 'vscode';
import { getFeatureByName, featureCompatibilityScore } from './baselineClient';
import { analyzeJs } from '../analyzers/jsAnalyzer';
import { analyzeHtml } from '../analyzers/htmlAnalyzer';
import { analyzeCss } from '../analyzers/cssAnalyzer';


export class BaselineDiagnosticsProvider {
  private diagnosticCollection: vscode.DiagnosticCollection;

  constructor() {
    this.diagnosticCollection = vscode.languages.createDiagnosticCollection('baseline-compat');
  }

  public provideDiagnostics(document: vscode.TextDocument): void {
    const diagnostics: vscode.Diagnostic[] = [];
    // Read settings from VS Code configuration
    const config = vscode.workspace.getConfiguration('baselineCompat');
    const threshold = config.get<number>('threshold', 95);
    const targets = config.get<string[]>('targets', ['chrome', 'firefox', 'safari', 'edge']);
    const level = config.get<string>('level', 'warn');
    const severity = level === 'error' ? vscode.DiagnosticSeverity.Error : vscode.DiagnosticSeverity.Warning;

    // Use JS analyzer for JS/TS files
    if (['javascript', 'typescript'].includes(document.languageId)) {
      const text = document.getText();
      const findings = analyzeJs(text);
      for (const finding of findings) {
        const feature = getFeatureByName(finding.featureName);
        const score = featureCompatibilityScore(feature, targets);
        if (score < threshold) {
          const range = new vscode.Range(
            document.positionAt(finding.nodeRange[0]),
            document.positionAt(finding.nodeRange[1])
          );
          const message = `Warning: '${finding.featureName}' has limited interoperability (compat: ${score}% across Baseline targets).`;
          diagnostics.push(new vscode.Diagnostic(range, message, severity));
        }
      }
    }

    // Use CSS analyzer for CSS files
    if (document.languageId === 'css') {
      const text = document.getText();
      const findings = analyzeCss(text);
      for (const finding of findings) {
        const feature = getFeatureByName(finding.featureName);
        const score = featureCompatibilityScore(feature, targets);
        if (score < threshold) {
          const range = new vscode.Range(
            document.positionAt(finding.nodeRange[0]),
            document.positionAt(finding.nodeRange[1])
          );
          const message = `Warning: CSS property '${finding.featureName}' has limited interoperability (compat: ${score}% across Baseline targets).`;
          diagnostics.push(new vscode.Diagnostic(range, message, severity));
        }
      }
    }

    // Use HTML analyzer for HTML files
    if (document.languageId === 'html') {
      const text = document.getText();
      const findings = analyzeHtml(text);
      for (const finding of findings) {
        const feature = getFeatureByName(finding.featureName);
        const score = featureCompatibilityScore(feature, targets);
        if (score < threshold) {
          const range = new vscode.Range(
            document.positionAt(finding.nodeRange[0]),
            document.positionAt(finding.nodeRange[1])
          );
          const message = `Warning: HTML feature '<${finding.featureName}>' has limited interoperability (compat: ${score}% across Baseline targets).`;
          diagnostics.push(new vscode.Diagnostic(range, message, severity));
        }
      }
    }
    this.diagnosticCollection.set(document.uri, diagnostics);
  }

  public clearDiagnostics(document: vscode.TextDocument): void {
    this.diagnosticCollection.delete(document.uri);
  }
}

// Example activation hook
export function activateDiagnosticsProvider(context: vscode.ExtensionContext) {
  const provider = new BaselineDiagnosticsProvider();
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(doc => provider.provideDiagnostics(doc)),
    vscode.workspace.onDidChangeTextDocument(e => provider.provideDiagnostics(e.document)),
    vscode.workspace.onDidCloseTextDocument(doc => provider.clearDiagnostics(doc))
  );
}
