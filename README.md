
# Baseline Compat

VS Code extension, CLI, and GitHub Action for Baseline web compatibility diagnostics and remediation.

## Features
- Inline diagnostics and hover info for risky web features (JS/TS/HTML/CSS)
- Actionable quick-fixes: polyfills, guards, alternative API snippets
- Configurable threshold, browser targets, and severity
- CLI for repo-wide scanning and SARIF export
- GitHub Action for CI enforcement and PR comments

## Settings
Configure in VS Code settings:
- `baselineCompat.threshold`: Minimum compatibility percentage (default: 95)
- `baselineCompat.targets`: Browsers to check (default: Chrome, Firefox, Safari, Edge)
- `baselineCompat.level`: Severity (`warn` or `error`)

## Getting Started
1. Install the extension from the Marketplace
2. Open a file (JS, TS, CSS, HTML) with risky features
3. See inline diagnostics and hover info
4. Apply quick-fix actions for remediation
5. Run CLI: `node cli/scan.js demo`
6. View `baseline-report.json`, `baseline-report.sarif`, and PR comment summary

## CI Integration
Use the included GitHub Action to:
- Run baseline scan on PRs
- Upload SARIF for code scanning
- Post PR comment with top risky features and remediation

## Demo
See `DEMO.md` for step-by-step demo instructions and example files.

## Architecture
- `src/baselineClient.ts`: wraps web-features, caching, feature lookup
- `src/diagnosticsProvider.ts`: VS Code diagnostics/hover
- `src/quickFixProvider.ts`: CodeActions for remediation
- `analyzers/`: JS/TS/CSS/HTML analyzers
- `cli/scan.ts`: repo scanner
- `github-action/`: CI integration

## Roadmap
- [x] Extension, analyzers, diagnostics, quick-fixes
- [x] CLI and SARIF output
- [x] GitHub Action and PR comments
- [x] Demo repo and docs
