# Baseline Compat - Build System Integration

This guide describes how to integrate Baseline Compat with various build systems and CI/CD platforms.

## Supported Platforms
- **GitHub Actions**: See `github-action/action.yml` for setup.
- **GitLab CI**: Use `.gitlab-ci.yml` in your repo root.
- **Jenkins**: Add `Jenkinsfile` for pipeline integration.
- **CircleCI**: Use `.circleci/config.yml` for artifact storage and reporting.

## Build System Compatibility
Baseline Compat can be run as a pre-build or post-build step in most environments. Example commands:

### npm/yarn
```bash
npm run build && npx ts-node cli/scan.ts src/
```

### Webpack
Add to your `package.json` scripts:
```json
"scripts": {
  "build": "webpack",
  "compat-check": "npx ts-node cli/scan.ts dist/"
}
```

### Custom Build Systems
- Ensure Node.js and npm are available.
- Run the CLI scan after your build step.
- Artifacts (`baseline-report.json`, `baseline-report.sarif`) can be uploaded or archived as needed.

## Environment Variables
- `BASELINE_THRESHOLD`: Set minimum compatibility percentage.
- `BASELINE_FRAMEWORK`: Specify framework (`react`, `vue`, `angular`).
- `BASELINE_TARGETS`: Comma-separated list of browsers.

---
For more details, see [docs/installation.md](./installation.md) and [docs/usage.md](./usage.md).
