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
