// cssAnalyzer.ts
// Uses PostCSS to analyze CSS for risky features

export function analyzeCss(source: string) {
  // Use PostCSS to parse and analyze CSS
  const riskyProps = ['backdrop-filter', 'scroll-snap-type', 'clip-path'];
  const findings: { featureName: string, nodeRange: [number, number] }[] = [];
  try {
    const postcss = require('postcss');
    const root = postcss.parse(source);
    root.walkDecls((decl: any) => {
      if (riskyProps.includes(decl.prop)) {
        findings.push({
          featureName: decl.prop,
          nodeRange: [decl.source.start.offset, decl.source.end.offset]
        });
      }
    });
  } catch (e) {
    // Fallback: return empty findings
  }
  return findings;
}
