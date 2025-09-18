// baselineClient.test.ts
// Unit tests for baselineClient

import { getFeatureByName } from '../src/baselineClient';

describe('baselineClient', () => {
  it('should lookup features by name', () => {
    const feature = getFeatureByName('fetch');
    expect(feature).toBeDefined();
    expect(feature?.name.toLowerCase()).toBe('fetch');
  });
});
