// LinkedInService.ts
import axios from 'axios';
import * as cheerio from 'cheerio';
import { JobListing } from './types';

class LinkedInService {
  private readonly apiUrl: string;

  constructor() {
    this.apiUrl = 'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search';
  }

  public async fetchJobListings(queryObject: any): Promise<JobListing[]> {
    try {
      const query = this.buildQuery(queryObject);
      const response = await axios.get(query);
      const jobs = this.parseJobList(response.data);
      return jobs;
    } catch (error) {
      console.error('Error fetching job listings:', error);
      return [];
    }
  }

  private buildQuery(queryObj: any): string {
    const queryParams: any = {
      keywords: queryObj.keyword?.trim().replace(' ', '+') || '',
      location: queryObj.location?.trim().replace(' ', '+') || '',
      f_TPR: this.getDateSincePosted(queryObj.dateSincePosted),
      f_E: this.getExperienceLevel(queryObj.experienceLevel),
      f_JT: this.getJobType(queryObj.jobType),
      f_WT: this.getRemoteFilter(queryObj.remoteFilter),
      f_SB2: this.getSalary(queryObj.salary),
      sortBy: this.getSortBy(queryObj.sortBy),
    };

    let query = `${this.apiUrl}?`;
    for (const param in queryParams) {
      if (queryParams[param]) {
        query += `${param}=${queryParams[param]}&`;
      }
    }
    return encodeURI(query.slice(0, -1)); // Remove the last '&'
  }

  private getDateSincePosted(dateSincePosted: string): string {
    const dateRange: { [key: string]: string } = {
      'past month': 'r2592000',
      'past week': 'r604800',
      '24hr': 'r86400',
    };
    return dateRange[dateSincePosted?.toLowerCase()] ?? '';
  }

  private getExperienceLevel(experienceLevel: string): string {
    const experienceRange: { [key: string]: string } = {
      internship: '1',
      'entry level': '2',
      associate: '3',
      senior: '4',
      director: '5',
      executive: '6',
    };
    return experienceRange[experienceLevel?.toLowerCase()] ?? '';
  }

  private getJobType(jobType: string): string {
    const jobTypeRange: { [key: string]: string } = {
      'full time': 'F',
      'full-time': 'F',
      'part time': 'P',
      'part-time': 'P',
      contract: 'C',
      temporary: 'T',
      volunteer: 'V',
      internship: 'I',
    };
    return jobTypeRange[jobType?.toLowerCase()] ?? '';
  }

  private getRemoteFilter(remoteFilter: string): string {
    const remoteFilterRange: { [key: string]: string } = {
      'on-site': '1',
      'on site': '1',
      remote: '2',
      hybrid: '3',
    };
    return remoteFilterRange[remoteFilter?.toLowerCase()] ?? '';
  }

  private getSalary(salary: string): string {
    const salaryRange: { [key: string]: string } = {
      '40000': '1',
      '60000': '2',
      '80000': '3',
      '100000': '4',
      '120000': '5',
    };
    return salaryRange[salary?.toLowerCase()] ?? '';
  }

  private getSortBy(sortBy: string): string {
    return sortBy === 'recent' ? 'DD' : 'R';
  }

  private parseJobList(jobData: string): JobListing[] {
    const $ = cheerio.load(jobData);
    const jobs = $('li');

    const jobObjects: JobListing[] = jobs
      .map((index, element) => {
        const job = $(element);
        const position = job.find('.base-search-card__title').text().trim() || '';
        const company = job.find('.base-search-card__subtitle').text().trim() || '';
        const location = job.find('.job-search-card__location').text().trim() || '';
        const date = job.find('time').attr('datetime') || '';
        const salary = job.find('.job-search-card__salary-info')
          .text()
          .trim()
          .replace(/\n/g, '')
          .replace(/ /g, '') || ''; // Replace .replaceAll with .replace(/ /g, '')
        const jobUrl = job.find('.base-card__full-link').attr('href') || '';
        const companyLogo = job.find('.artdeco-entity-image').attr('data-delayed-url') || '';
        const agoTime = job.find('.job-search-card__listdate').text().trim() || '';
        return {
          position: position,
          company: company,
          companyLogo: companyLogo,
          location: location,
          date: date,
          agoTime: agoTime,
          salary: salary,
          jobUrl: jobUrl,
        };
      })
      .get();

    return jobObjects;
  }
}

export default LinkedInService;
