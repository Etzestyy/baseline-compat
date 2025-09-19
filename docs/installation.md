# Installation & Setup

## VS Code Extension
1. Open VS Code and go to Extensions (Ctrl+Shift+X).
2. Search for "Baseline Compat" and click Install.
3. Reload VS Code if prompted.

## CLI Tool
1. Clone the repository:
   ```bash
   git clone https://github.com/Etzestyy/baseline-compat.git
   cd baseline-compat
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run a scan:
   ```bash
   npx ts-node cli/scan.ts demo/
   ```

## CI/CD Integration
- See the provided config files for GitHub Actions, GitLab CI, Jenkins, and CircleCI in the repo root.
- Add the relevant file to your project and adjust paths as needed.

## Dashboard
1. Start a local server:
   ```bash
   python3 -m http.server 8080 --directory dashboard
   ```
2. Open [http://localhost:8080](http://localhost:8080) in your browser.

---
For troubleshooting, see [docs/troubleshooting.md](./troubleshooting.md).
