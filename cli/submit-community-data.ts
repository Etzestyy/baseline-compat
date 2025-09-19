#!/usr/bin/env node
// submit-community-data.ts
// CLI tool for submitting community compatibility data

import { submitCommunityData } from '../src/communityDataProvider';

const [,, feature, browser, support, contributor, ...notesArr] = process.argv;
if (!feature || !browser || !support || !contributor) {
  console.error('Usage: submit-community-data <feature> <browser> <support:true|false> <contributor> [notes]');
  process.exit(1);
}

const entry = {
  feature,
  browser,
  support: support === 'true',
  contributor,
  notes: notesArr.join(' ')
};

submitCommunityData(entry);
console.log('Community compatibility data submitted:', entry);
