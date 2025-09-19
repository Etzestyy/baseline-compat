// Framework-specific compatibility rules
// This file defines compatibility adjustments for React, Vue, and Angular

import { Framework } from './frameworkConfig';

export interface FrameworkRule {
  id: string;
  description: string;
  adjust: (featureId: string) => boolean;
}

export const frameworkRules: Record<Framework, FrameworkRule[]> = {
  react: [
    {
      id: 'react-dom-polyfill',
      description: 'React DOM polyfills certain APIs, adjust compatibility checks.',
      adjust: (featureId) => featureId.startsWith('dom.')
    },
    // Add more React-specific rules here
  ],
  vue: [
    {
      id: 'vue-template-polyfill',
      description: 'Vue templates may polyfill some DOM features.',
      adjust: (featureId) => featureId.startsWith('dom.')
    },
    // Add more Vue-specific rules here
  ],
  angular: [
    {
      id: 'angular-zone-polyfill',
      description: 'Angular uses zone.js and polyfills for async APIs.',
      adjust: (featureId) => featureId.startsWith('es.')
    },
    // Add more Angular-specific rules here
  ],
  none: []
};
