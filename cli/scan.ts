// scan.ts
// CLI tool for repo-wide Baseline compatibility scanning

import * as fs from 'fs';
import * as path from 'path';
import { getFeatureByName, featureCompatibilityScore } from '../src/baselineClient';
import { analyzeJs } from '../analyzers/jsAnalyzer';
import { analyzeCss } from '../analyzers/cssAnalyzer';
import { analyzeHtml } from '../analyzers/htmlAnalyzer';

const threshold = Number(process.env.BASELINE_THRESHOLD || 95);
const targets = (process.env.BASELINE_TARGETS || 'chrome,firefox,safari,edge').split(',');

function scanFile(filePath: string) {
  const ext = path.extname(filePath);
  const source = fs.readFileSync(filePath, 'utf-8');
  let findings: any[] = [];
  if (ext === '.js' || ext === '.ts') findings = analyzeJs(source);
  if (ext === '.css') findings = analyzeCss(source);
  if (ext === '.html') findings = analyzeHtml(source);
  return findings.map(finding => {
    const feature = getFeatureByName(finding.featureName);
    const score = featureCompatibilityScore(feature, targets);
    return {
      file: filePath,
      feature: finding.featureName,
      score,
      safe: score >= threshold
    };
  });
}

function scanDir(dir: string): any[] {
  let results: any[] = [];
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      results = results.concat(scanDir(fullPath));
    } else if (['.js', '.ts', '.css', '.html'].includes(path.extname(fullPath))) {
      results = results.concat(scanFile(fullPath));
    }
  }
  return results;
}

async function main() {
  const root = process.argv[2] || process.cwd();
  const results = scanDir(root);
  const safeCount = results.filter(r => r.safe).length;
  const total = results.length;
  const percentSafe = total ? Math.round((safeCount / total) * 100) : 100;
  console.log(`Baseline compatibility: ${percentSafe}% (${safeCount}/${total} features safe)`);
  if (percentSafe < threshold) {
    console.error(`ERROR: Compatibility below threshold (${threshold}%)`);
    process.exit(1);
  }
  // Output JSON summary
  fs.writeFileSync('baseline-report.json', JSON.stringify(results, null, 2));

  // Output SARIF report for GitHub code scanning
  const sarif = {
    version: '2.1.0',
    runs: [
      {
        tool: {
          driver: {
            name: 'Baseline Compat',
            informationUri: 'https://web-features.explore.dev/',
            rules: []
          }
        },
        results: results.filter(r => !r.safe).map(r => ({
          ruleId: r.feature,
          message: { text: `Feature '${r.feature}' is below baseline threshold (${r.score}%)` },
          locations: [
            {
              physicalLocation: {
                artifactLocation: { uri: r.file },
                region: { startLine: 1 }
              }
            }
          ],
          level: 'warning'
        }))
      }
    ]
  };
  fs.writeFileSync('baseline-report.sarif', JSON.stringify(sarif, null, 2));

  // Output PR comment summary
  const risky = results.filter(r => !r.safe).sort((a, b) => a.score - b.score).slice(0, 5);
  let comment = `## Baseline Compat Scan\n`;
  comment += `**Top 5 risky features:**\n`;
  risky.forEach(r => {
    comment += `- [31m${r.feature}[0m in [34m${r.file}[0m (${r.score}%)\n`;
  });
  if (risky.length) {
    comment += `\n**Sample remediation:**\n`;
    comment += `Wrap with feature-detection or use a polyfill.\n`;
    comment += `See [Baseline Compat Extension](https://marketplace.visualstudio.com/items?itemName=Etzestyy.baseline-compat) for in-editor fixes.\n`;
  } else {
    comment += `All scanned features meet the baseline threshold.\n`;
  }
  fs.writeFileSync('baseline-pr-comment.md', comment);
}

main();
