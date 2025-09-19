// accessibilityIntlAnalyzer.ts
// Analyzes source code for accessibility and internationalization issues

export interface AccessibilityIntlIssue {
  file: string;
  type: 'accessibility' | 'internationalization';
  message: string;
  line?: number;
}

// Dummy implementation for demo purposes
export function analyzeAccessibilityIntl(source: string, file: string): AccessibilityIntlIssue[] {
  const issues: AccessibilityIntlIssue[] = [];
  // Accessibility: Check for missing alt attributes in <img>
  if (source.includes('<img') && !source.includes('alt=')) {
    issues.push({
      file,
      type: 'accessibility',
      message: 'Image tag missing alt attribute.'
    });
  }
  // Internationalization: Check for hardcoded English text
  if (/\bHello\b|\bWelcome\b/.test(source)) {
    issues.push({
      file,
      type: 'internationalization',
      message: 'Hardcoded English text detected.'
    });
  }
  return issues;
}
