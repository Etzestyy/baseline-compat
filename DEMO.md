# Baseline Compat Demo Repo

This repo demonstrates the Baseline Compat VS Code extension, CLI, and GitHub Action.

## Demo Steps

1. **Install the VS Code Extension**
   - Search for "Baseline Compat" in the Marketplace and install.

2. **Open a risky file**
   - Example: `demo/risky.js` (uses `fetch`, `attachShadow`)
   - Example: `demo/risky.css` (uses `backdrop-filter`)
   - Example: `demo/risky.html` (uses `<template>`)

3. **See diagnostics and hover info**
   - Inline warnings for risky features
   - Hover for compatibility and remediation links

4. **Apply quick-fix actions**
   - Use CodeActions to insert guards, polyfill links, or alternative snippets

5. **Run CLI scan**
   - `node cli/scan.js demo`
   - View `baseline-report.json` and `baseline-report.sarif`

6. **Push a PR and see CI in action**
   - GitHub Action runs scan, uploads SARIF, and posts PR comment summary

## Example Files

- `demo/risky.js`:
  ```js
  fetch('/api');
  element.attachShadow({mode: 'open'});
  ```
- `demo/risky.css`:
  ```css
  .fancy {
    backdrop-filter: blur(5px);
  }
  ```
- `demo/risky.html`:
  ```html
  <template id="tmpl"></template>
  <custom-element></custom-element>
  ```

## Impact Metrics
- See reduction in warnings after applying quick-fixes
- CI blocks PRs below threshold
- PR comment lists top risky features and remediation

---
For more, see the README and extension documentation.
