# Troubleshooting

## Common Issues

### Extension Not Activating
- Ensure VS Code is updated to the latest version.
- Check that the extension is enabled in the Extensions panel.

### CLI Scan Fails
- Make sure dependencies are installed (`npm install`).
- Use `npx ts-node cli/scan.ts <directory>` for TypeScript files.
- Check for missing or invalid input files.

### CI/CD Integration Problems
- Verify the config file paths and environment variables.
- Check CI logs for error messages and missing dependencies.

### Dashboard Not Loading
- Ensure the local server is running (`python3 -m http.server 8080 --directory dashboard`).
- Confirm the browser is pointed to the correct URL.

## Getting Help
- See [docs/contributing.md](./contributing.md) for how to ask questions or report issues.
- Open a GitHub Discussion or issue for further assistance.
