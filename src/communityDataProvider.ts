// communityDataProvider.ts
// Allows developers to submit compatibility data for browsers/features

import * as fs from 'fs';

export interface CommunityCompatibility {
  feature: string;
  browser: string;
  support: boolean;
  notes?: string;
  contributor: string;
}

const DATA_FILE = 'community-compat-data.json';

export function submitCommunityData(entry: CommunityCompatibility) {
  let data: CommunityCompatibility[] = [];
  if (fs.existsSync(DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  }
  data.push(entry);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export function getCommunityData(): CommunityCompatibility[] {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}
