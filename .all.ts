// ./src/LinkedInService.ts
import { RestliClient } from 'linkedin-api-client';
import { JobListing, QueryParams } from './types';
import dotenv from 'dotenv';

dotenv.config(); // Load .env file

const accessToken = process.env.ACCESS_TOKEN || process.env.LINKEDIN_ACCESS_TOKEN;

if (!accessToken) {
  throw new Error('Access token is not defined. Please check your environment variables.');
}

const restliClient = new RestliClient();

class LinkedInService {
  private readonly endpoint: string;

  constructor() {
    this.endpoint = 'jobSearch'; // Set the endpoint without /v2/
  }

  public async fetchJobListings(queryObject: QueryParams): Promise<JobListing[]> {
    try {
      const query = this.buildQuery(queryObject);
      const response = await restliClient.get({
        resourcePath: `${this.endpoint}${query}`, // Only path after /v2/ should be included
        accessToken: accessToken as string,
      });

      const jobs = this.parseJobList(response.data);
      return jobs;
    } catch (error) {
      console.error('Error fetching job listings:', error);
      return [];
    }
  }

  private buildQuery(queryObj: QueryParams): string {
    const queryParams: any = {
      q: 'jobs',
      keywords: encodeURIComponent(queryObj.keyword || ''),
      location: encodeURIComponent(queryObj.location || ''),
    };

    let query = '?';
    for (const param in queryParams) {
      if (queryParams[param]) {
        query += `${param}=${queryParams[param]}&`;
      }
    }
    return query.slice(0, -1); // Remove the last '&'
  }

  private parseJobList(jobData: any): JobListing[] {
    return jobData.elements.map((job: any) => ({
      position: job.title || '',
      company: job.companyName || '',
      companyLogo: job.companyLogoUrl || '',
      location: job.location || '',
      date: job.datePosted || '',
      agoTime: '', // This would depend on additional data available
      salary: job.salary || '',
      jobUrl: job.jobUrl || '',
    }));
  }
}

export default LinkedInService;
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
// src/types.ts
export interface JobListing {
  position: string;
  company: string;
  companyLogo: string;
  location: string;
  date: string;
  agoTime: string;
  salary: string;
  jobUrl: string;
}

export interface QueryParams {
  keyword?: string;
  location?: string;
  dateSincePosted?: string;
  experienceLevel?: string;
  jobType?: string;
  remoteFilter?: string;
  salary?: string;
  sortBy?: string;
}
// utils.ts
export function getDateSincePosted(dateSincePosted: string): string {
  const dateRange: { [key: string]: string } = {
    "past month": "r2592000",
    "past week": "r604800",
    "24hr": "r86400",
  };
  return dateRange[dateSincePosted.toLowerCase()] ?? "";
}

export function getExperienceLevel(experienceLevel: string): string {
  const experienceRange: { [key: string]: string } = {
    internship: "1",
    "entry level": "2",
    associate: "3",
    senior: "4",
    director: "5",
    executive: "6",
  };
  return experienceRange[experienceLevel.toLowerCase()] ?? "";
}

export function getJobType(jobType: string): string {
  const jobTypeRange: { [key: string]: string } = {
    "full time": "F",
    "full-time": "F",
    "part time": "P",
    "part-time": "P",
    contract: "C",
    temporary: "T",
    volunteer: "V",
    internship: "I",
  };
  return jobTypeRange[jobType.toLowerCase()] ?? "";
}

export function getRemoteFilter(remoteFilter: string): string {
  const remoteFilterRange: { [key: string]: string } = {
    "on-site": "1",
    "on site": "1",
    remote: "2",
    hybrid: "3",
  };
  return remoteFilterRange[remoteFilter.toLowerCase()] ?? "";
}

export function getSalary(salary: string): string {
  const salaryRange: { [key: string]: string } = {
    "40000": "1",
    "60000": "2",
    "80000": "3",
    "100000": "4",
    "120000": "5",
  };
  return salaryRange[salary.toLowerCase()] ?? "";
}
