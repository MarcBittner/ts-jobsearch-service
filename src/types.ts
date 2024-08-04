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
