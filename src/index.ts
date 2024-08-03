// index.ts
import LinkedInService from './LinkedInService';

const service = new LinkedInService();
const queryObject = {
  keyword: process.env.KEYWORD,
  location: process.env.LOCATION,
  dateSincePosted: process.env.DATE_SINCE_POSTED,
  jobType: process.env.JOB_TYPE,
  remoteFilter: process.env.REMOTE_FILTER,
  salary: process.env.SALARY,
  experienceLevel: process.env.EXPERIENCE_LEVEL,
  sortBy: process.env.SORT_BY,
  limit: process.env.LIMIT,
};

service.fetchJobListings(queryObject).then((jobs) => {
  console.log('Fetched jobs:', jobs);
});
