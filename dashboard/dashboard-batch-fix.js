// dashboard-batch-fix.js
// Adds batch auto-fix preview and apply logic to dashboard
import { POLYFILL_SNIPPETS } from '../src/autofix';

window.addEventListener('DOMContentLoaded', () => {
  const dashboard = document.getElementById('dashboard');
  if (!dashboard) return;
  // Add batch fix button
  const batchBtn = document.createElement('button');
  batchBtn.textContent = 'Preview & Apply Batch Auto-Fix';
  batchBtn.style.marginBottom = '1em';
  dashboard.parentNode.insertBefore(batchBtn, dashboard);
  batchBtn.onclick = () => {
    fetch('../baseline-report.json')
      .then(res => res.json())
      .then(results => {
        const fixes = results.filter(r => POLYFILL_SNIPPETS[r.feature]);
        let preview = '<h3>Batch Auto-Fix Preview</h3><ul>';
        fixes.forEach(fix => {
          preview += `<li><b>${fix.file}</b>: Insert polyfill for <code>${fix.feature}</code></li>`;
        });
        preview += '</ul>';
        preview += '<button id="applyBatchFix">Apply Fixes (CLI only)</button>';
        dashboard.innerHTML = preview + dashboard.innerHTML;
        document.getElementById('applyBatchFix').onclick = () => {
          alert('To apply fixes, run: npx ts-node cli/scan.ts demo/ --auto-fix');
        };
      });
  };
});
