// scan.ts
// CLI tool for repo-wide Baseline compatibility scanning

import * as fs from 'fs';
import * as path from 'path';
import { getFeatureByName, featureCompatibilityScore } from '../src/baselineClient';
import { defaultFrameworkConfig, FrameworkConfig } from '../src/frameworkConfig';
import { frameworkRules } from '../src/frameworkRules';
import { analyzeJs } from '../analyzers/jsAnalyzer';
import { analyzeCss } from '../analyzers/cssAnalyzer';
import { analyzeHtml } from '../analyzers/htmlAnalyzer';
import { getPolyfillUrl } from '../src/polyfillProvider';
import { analyzeAccessibilityIntl } from '../analyzers/accessibilityIntlAnalyzer';
import { autoFixFile } from '../src/autofix';

const threshold = Number(process.env.BASELINE_THRESHOLD || 95);
const framework: FrameworkConfig['framework'] = (process.env.BASELINE_FRAMEWORK as any) || defaultFrameworkConfig.framework;
const targets = (process.env.BASELINE_TARGETS || 'chrome,firefox,safari,edge').split(',');

function scanFile(filePath: string) {
  const ext = path.extname(filePath);
  const source = fs.readFileSync(filePath, 'utf-8');
  let findings: any[] = [];
  if (ext === '.js' || ext === '.ts') findings = analyzeJs(source);
  if (ext === '.css') findings = analyzeCss(source);
  if (ext === '.html') findings = analyzeHtml(source);
  const results = findings.map(finding => {
    const feature = getFeatureByName(finding.featureName);
    let score = featureCompatibilityScore(feature, targets);
    // Adjust compatibility for selected framework
    if (framework !== 'none') {
      const rules = frameworkRules[framework];
      for (const rule of rules) {
        if (rule.adjust(finding.featureName)) {
          // Example: boost score for polyfilled features
          score = Math.max(score, 95);
        }
      }
    }
    // Add polyfill recommendation if feature is risky
    let polyfillUrl = null;
    if (score < threshold) {
      polyfillUrl = getPolyfillUrl(finding.featureName, targets);
    }
    return {
      file: filePath,
      feature: finding.featureName,
      score,
      safe: score >= threshold,
      framework,
      polyfillUrl
    };
  });
  // Accessibility and internationalization checks
  const a11yIntlIssues = analyzeAccessibilityIntl(source, filePath);
  return results.concat(a11yIntlIssues.map(issue => ({
    file: issue.file,
    feature: '',
    score: 0,
    safe: false,
    framework,
    polyfillUrl: null,
    type: issue.type,
    message: issue.message,
    line: issue.line
  })));
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

async function scanFiles(files: string[], options: any) {
  let results: any[] = [];
  for (const file of files) {
    const fileResults = scanFile(file);
    results = results.concat(fileResults);
    if (options.autoFix) {
      const fixed = autoFixFile(file, fileResults);
      if (fixed) {
        console.log(`Auto-fixed: ${file}`);
      }
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
          message: {
            text: `Feature '${r.feature}' is below baseline threshold (${r.score}%)` +
              (r.polyfillUrl ? `\nPolyfill recommendation: ${r.polyfillUrl}` : '') +
              `\nSuggested resolution: Wrap with feature-detection or use a polyfill.` +
              (r.message ? `\n${r.message}` : '')
          },
          locations: [
            {
              physicalLocation: {
                artifactLocation: { uri: r.file },
                region: { startLine: r.line || 1 }
              }
            }
          ],
          level: 'warning',
          properties: {
            impact: 'Potential breakage or degraded experience in non-baseline browsers.',
            polyfill: r.polyfillUrl || '',
            resolution: r.message || 'Wrap with feature-detection or use a polyfill.'
          }
        }))
      }
    ]
  };
  fs.writeFileSync('baseline-report.sarif', JSON.stringify(sarif, null, 2));

  // Output CSV for further analysis
  const csvHeader = 'file,feature,score,safe,framework,polyfillUrl,type,message,line\n';
  const csvRows = results.map(r => [
    r.file,
    r.feature,
    r.score,
    r.safe,
    r.framework,
    r.polyfillUrl,
    r.type || '',
    r.message || '',
    r.line || ''
  ].map(x => `"${x}"`).join(',')).join('\n');
  fs.writeFileSync('baseline-report.csv', csvHeader + csvRows);

  // Output PR comment summary
  const risky = results.filter(r => !r.safe).sort((a, b) => a.score - b.score).slice(0, 5);
  let comment = `## Baseline Compat Scan\n`;
  comment += `**Top 5 risky features:**\n`;
  risky.forEach(r => {
    comment += `- ${r.feature} in ${r.file} (${r.score}%)`;
    if (r.polyfillUrl) {
      comment += `\n  Polyfill: ${r.polyfillUrl}`;
    }
    comment += `\n`;
  });
  if (risky.length) {
    comment += `\n**Sample remediation:**\n`;
    comment += `Wrap with feature-detection or use a polyfill.\n`;
    comment += `See [Baseline Compat Extension](https://marketplace.visualstudio.com/items?itemName=Etzestyy.baseline-compat) for in-editor fixes.\n`;
  } else {
    comment += `All scanned features meet the baseline threshold.\n`;
  }
  fs.writeFileSync('baseline-pr-comment.md', comment);

  if (percentSafe < threshold) {
    console.error(`ERROR: Compatibility below threshold (${threshold}%)`);
    process.exit(1);
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const autoFix = args.includes('--auto-fix');
  const root = args.find(arg => !arg.startsWith('--')) || process.cwd();
  scanFiles([root], { autoFix });
} else {
  main();
}
