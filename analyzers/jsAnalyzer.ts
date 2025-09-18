// jsAnalyzer.ts
// Uses Babel to traverse JS AST and detect risky features

export function analyzeJs(source: string) {
  // Use Babel to parse and traverse AST
  const riskyApis = ['fetch', 'attachShadow', 'Intl', 'CSS.supports'];
  const findings: { featureName: string, nodeRange: [number, number] }[] = [];
  try {
    const parser = require('@babel/parser');
    const traverse = require('@babel/traverse').default;
    const ast = parser.parse(source, { sourceType: 'module', plugins: ['jsx', 'typescript'] });
    traverse(ast, {
      Identifier(path: any) {
        if (riskyApis.includes(path.node.name)) {
          findings.push({
            featureName: path.node.name,
            nodeRange: [path.node.start, path.node.end]
          });
        }
      }
    });
  } catch (e) {
    // Fallback: return empty findings
  }
  return findings;
}
