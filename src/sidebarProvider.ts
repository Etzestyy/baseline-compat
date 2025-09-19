import * as vscode from 'vscode';

export class BaselineCompatSidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'baselineCompatIssuesView';
  private _view?: vscode.WebviewView;

  constructor(private readonly _context: vscode.ExtensionContext) {}

  resolveWebviewView(
    view: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = view;
    view.webview.options = {
      enableScripts: true
    };
    view.webview.html = this.getHtml();
  }

  getHtml(): string {
    // Basic sidebar layout with collapsible sections and color coding
    return `
      <style>
        body { font-family: var(--vscode-font-family); color: var(--vscode-foreground); background: var(--vscode-sideBar-background); }
        .section { margin-bottom: 1em; }
        .collapsible { cursor: pointer; padding: 0.5em; border-radius: 4px; background: var(--vscode-sideBarSectionHeader-background); }
        .content { display: none; padding: 0.5em; }
        .red { color: var(--vscode-errorForeground); }
        .orange { color: orange; }
        .green { color: var(--vscode-sideBarTitle-foreground); }
        .icon { margin-right: 0.5em; }
        .quickfix { margin-left: 1em; color: var(--vscode-button-background); cursor: pointer; }
      </style>
      <h2>Compatibility Issues</h2>
      <div class="section">
        <div class="collapsible" onclick="toggleSection('js')">🟦 JS/TS Issues</div>
        <div class="content" id="js">
          <div class="red"><span class="icon">❌</span>fetch - High-risk (unsupported in IE) <span class="quickfix" title="Add Polyfill">⚡</span></div>
          <div class="orange"><span class="icon">⚠️</span>Promise.finally - Partial support <span class="quickfix" title="Add Polyfill">⚡</span></div>
          <div class="green"><span class="icon">✅</span>Array.includes - Safe</div>
        </div>
      </div>
      <div class="section">
        <div class="collapsible" onclick="toggleSection('html')">🟧 HTML Issues</div>
        <div class="content" id="html">
          <div class="red"><span class="icon">❌</span>&lt;template&gt; - High-risk <span class="quickfix" title="Add Polyfill">⚡</span></div>
        </div>
      </div>
      <div class="section">
        <div class="collapsible" onclick="toggleSection('css')">🟩 CSS Issues</div>
        <div class="content" id="css">
          <div class="orange"><span class="icon">⚠️</span>backdrop-filter - Partial support <span class="quickfix" title="Add Polyfill">⚡</span></div>
        </div>
      </div>
      <script>
        function toggleSection(id) {
          var el = document.getElementById(id);
          el.style.display = el.style.display === 'block' ? 'none' : 'block';
        }
      </script>
    `;
  }
}
