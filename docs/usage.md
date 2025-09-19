# Usage Examples

## VS Code Extension
- Open a JS/TS/HTML/CSS file with risky features.
- Hover over highlighted code to see compatibility info and quick-fix options.
- Use the sidebar panel to filter and resolve issues by severity or browser.

## CLI Tool
- Scan a directory:
  ```bash
  npx ts-node cli/scan.ts demo/
  ```
- Submit community compatibility data:
  ```bash
  npx ts-node cli/submit-community-data.ts fetch chrome true yourname "Supported since Chrome 42"
  ```
- View results in `baseline-report.json` and `baseline-report.sarif`.

## CI/CD Integration
- Add the relevant config file to your repo (see root directory).
- On PRs or merges, the scan runs automatically and posts results to the PR.

## Dashboard
- View compatibility status, risky features, and community submissions.
- Submit new compatibility data via the web form or CLI.

---
See [docs/installation.md](./installation.md) for setup instructions.
