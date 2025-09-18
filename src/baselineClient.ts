// baselineClient.ts
// Wraps web-features package, provides feature lookup and compatibility scoring

// Use require to import features from data.json
const webFeaturesData = require('web-features/data.json');
const features = webFeaturesData.features;

export function getFeatureByName(name: string) {
  // Simple case-insensitive name match
  for (const id in features) {
    const feature = features[id];
    if (feature && typeof feature.name === 'string' && feature.name.toLowerCase() === name.toLowerCase()) {
      return { id, ...feature };
    }
  }
  return undefined;
}

export function getFeatureById(id: string) {
  const feature = features[id];
  return feature ? { id, ...feature } : undefined;
}

export function featureCompatibilityScore(feature: any, targets: string[] = ['chrome', 'firefox', 'safari', 'edge']): number {
  // Calculate compatibility score based on Baseline status
  if (!feature || !feature.status) return 0;
  let total = 0;
  let count = 0;
  for (const browser of targets) {
    // If feature is baseline, score 100, else 0
    const baseline = feature.status?.baseline;
    if (baseline === 'high' || baseline === 'low') {
      total += 100;
    } else {
      total += 0;
    }
    count++;
  }
  return count ? Math.round(total / count) : 0;
}
