// src/index.ts
import LinkedInService from './LinkedInService';
import { QueryParams } from './types';
import fs from 'fs';
import path from 'path';

const queryObject: QueryParams = {
  keyword: 'developer',
  location: 'San Francisco Bay Area',
  dateSincePosted: 'past week',
  experienceLevel: 'entry level',
  jobType: 'full time',
  remoteFilter: 'remote',
  salary: '80000',
  sortBy: 'recent',
};

async function fetchAndSaveJobListings() {
  const linkedInService = new LinkedInService();
  const jobs = await linkedInService.fetchJobListings(queryObject);

  // Convert jobs to CSV format and save to file
  const csv = jobs.map(job => Object.values(job).join(',')).join('\n');
  fs.writeFileSync(path.resolve(__dirname, 'job_listings.csv'), csv);
}

fetchAndSaveJobListings();
