// Polyfill recommendation utility
// Integrates with Polyfill.io to suggest polyfills for unsupported features

export function getPolyfillUrl(featureName: string, browsers: string[] = ['chrome', 'firefox', 'safari', 'edge']): string | null {
  // Polyfill.io supports a limited set of features; map feature names if needed
  // Example: fetch => 'fetch', Array.prototype.includes => 'Array.prototype.includes'
  // For demo, assume featureName is valid for Polyfill.io
  const encodedFeature = encodeURIComponent(featureName);
  const browserList = browsers.join(',');
  return `https://polyfill.io/v3/polyfill.min.js?features=${encodedFeature}&ua=${browserList}`;
}
