// baseline-compat framework configuration
// Supported frameworks: react, vue, angular

export type Framework = 'react' | 'vue' | 'angular' | 'none';

export interface FrameworkConfig {
  framework: Framework;
}

// Default config
export const defaultFrameworkConfig: FrameworkConfig = {
  framework: 'none',
};
