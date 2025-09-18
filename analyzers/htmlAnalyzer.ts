// htmlAnalyzer.ts
// Uses htmlparser2 to analyze HTML for risky features

export function analyzeHtml(source: string) {
  // Use htmlparser2 to parse and analyze HTML
  const riskyTags = ['template', 'custom-element'];
  const findings: { featureName: string, nodeRange: [number, number] }[] = [];
  try {
    const htmlparser2 = require('htmlparser2');
    const handler = new htmlparser2.DomHandler((error: any, dom: any) => {
      if (error) return;
      // Traverse DOM for risky tags
      const traverse = (nodes: any[]) => {
        for (const node of nodes) {
          if (node.type === 'tag' && riskyTags.includes(node.name)) {
            findings.push({
              featureName: node.name,
              nodeRange: [node.startIndex || 0, node.endIndex || 0]
            });
          }
          if (node.children) traverse(node.children);
        }
      };
      traverse(dom);
    });
    const parser = new htmlparser2.Parser(handler, { recognizeSelfClosing: true });
    parser.write(source);
    parser.end();
  } catch (e) {
    // Fallback: return empty findings
  }
  return findings;
}
