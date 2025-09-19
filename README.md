# Baseline Compat
> Accelerate modern web feature adoption with automated compatibility diagnostics, actionable remediation, and CI enforcement.

## Overview
Baseline Compat is a comprehensive toolkit for ensuring your web projects meet Baseline browser compatibility standards. It includes:
- **VS Code Extension**: Inline diagnostics, hover info, and quick-fix actions for risky features in JS, TS, HTML, and CSS.
- **CLI Tool**: Scan entire repos, generate SARIF reports, and get actionable insights.
- **CI/CD Integrations**: GitHub Action, GitLab CI, Jenkins, and CircleCI support for automated compatibility checks.
- **Dashboard**: Real-time visualization of compatibility status and community-driven data.

## Key Features
- **Framework-Specific Profiles**: Tailor compatibility checks for React, Vue, and Angular with configurable presets.
- **Polyfill Recommendations**: Get direct links to Polyfill.io and fallback strategies for unsupported features.
- **Real-Time Dashboard**: Visualize compatibility status, risky features, and community submissions in a web UI.
- **Advanced Reporting**: SARIF-compliant reports with impact, remediation, and polyfill suggestions.
- **Community Data**: Submit and view compatibility info for lesser-known browsers and emerging features.
- **Accessibility & Internationalization Checks**: Automated detection of a11y and i18n issues in your codebase.

## Getting Started
1. **Install the Extension**: Find "Baseline Compat" in the VS Code Marketplace.
2. **Scan Your Project**: Run `npx ts-node cli/scan.ts <directory>` to analyze compatibility.
3. **Review Reports**: Check `baseline-report.json`, `baseline-report.sarif`, and PR comment summaries.
4. **Use the Dashboard**: Start a local server in the `dashboard/` folder to view results and community data.
5. **Integrate with CI/CD**: Add the provided config files for GitHub Actions, GitLab CI, Jenkins, or CircleCI.

## Configuration
- **VS Code Settings**:
	- `baselineCompat.threshold`: Minimum compatibility percentage (default: 95)
	- `baselineCompat.targets`: Browsers to check (default: Chrome, Firefox, Safari, Edge)
	- `baselineCompat.level`: Severity (`warn` or `error`)
- **Framework Selection**:
	- Set `BASELINE_FRAMEWORK` env variable to `react`, `vue`, or `angular` for tailored checks.

## CLI Usage
- Scan a directory: `npx ts-node cli/scan.ts demo/`
- Submit community data: `npx ts-node cli/submit-community-data.ts <feature> <browser> <support:true|false> <contributor> [notes]`

## Dashboard
- Open `dashboard/index.html` in a browser or run `python3 -m http.server 8080 --directory dashboard`.
- View compatibility status, risky features, and community submissions.
- Submit new compatibility data via the web form (requires backend support) or CLI.

## CI/CD Integration
- **GitHub Action**: See `github-action/action.yml` for automated scans, SARIF uploads, and PR comments.
- **GitLab CI**: Use `.gitlab-ci.yml` for merge request enforcement.
- **Jenkins**: Add `Jenkinsfile` for pipeline integration.
- **CircleCI**: Use `.circleci/config.yml` for artifact storage and reporting.

## Architecture
- `src/baselineClient.ts`: Feature lookup and scoring
- `src/frameworkConfig.ts` / `src/frameworkRules.ts`: Framework-specific logic
- `src/polyfillProvider.ts`: Polyfill recommendations
- `src/communityDataProvider.ts`: Community data submission and retrieval
- `analyzers/`: Language-specific analyzers and accessibility/i18n checks
- `cli/scan.ts`: Main CLI scanner
- `dashboard/`: Web dashboard for visualization and data entry
- `github-action/`, `.gitlab-ci.yml`, `Jenkinsfile`, `.circleci/config.yml`: CI/CD integration

## Advanced Reporting
- SARIF reports include impact, polyfill links, and suggested resolutions for each risky feature.
- Accessibility and internationalization issues are flagged in scan results and reports.

## Community Contributions
- Submit compatibility data for new browsers/features via CLI or dashboard form.
- All submissions are visible in the dashboard for transparency and collaboration.

## Accessibility & Internationalization
- Automated checks for missing alt attributes, hardcoded English text, and more.
- Results included in scan output and dashboard.

## Demo
See `DEMO.md` for step-by-step instructions and example files.

## License
MIT

## Links
- [Marketplace Extension](https://marketplace.visualstudio.com/items?itemName=Etzestyy.baseline-compat)
- [Web Features Data](https://web-features.explore.dev/)
- [Polyfill.io](https://polyfill.io/)
- [GitHub Repository](https://github.com/Etzestyy/baseline-compat)

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
