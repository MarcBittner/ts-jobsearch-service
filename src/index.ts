// src/index.ts
import * as dotenv from 'dotenv';
import * as schedule from 'node-schedule';
import { fetchJobPostings, readPreviousData, saveNewData } from './utils';
import { EnvVariables } from './types';

dotenv.config();

const env: EnvVariables = {
    LINKEDIN_ACCESS_TOKEN: process.env.LINKEDIN_ACCESS_TOKEN!,
    SEARCH_KEYWORDS: process.env.SEARCH_KEYWORDS!,
    SEARCH_LOCATION: process.env.SEARCH_LOCATION!,
    OUTPUT_FILE: process.env.OUTPUT_FILE!,
    FETCH_INTERVAL: process.env.FETCH_INTERVAL!,
};

if (
    !env.LINKEDIN_ACCESS_TOKEN ||
    !env.SEARCH_KEYWORDS ||
    !env.SEARCH_LOCATION ||
    !env.OUTPUT_FILE ||
    !env.FETCH_INTERVAL
) {
    console.error('Missing required environment variables.');
    process.exit(1);
}

const updateJobPostings = async () => {
    const newJobs = await fetchJobPostings(env);
    const existingJobs = readPreviousData(env.OUTPUT_FILE);

    const uniqueJobs = newJobs.filter(
        (newJob) => !existingJobs.some((existingJob) => existingJob.jobId === newJob.jobId)
    );

    if (uniqueJobs.length > 0) {
        await saveNewData(env.OUTPUT_FILE, uniqueJobs);
        console.log('New job postings saved:', uniqueJobs);
    } else {
        console.log('No new job postings found.');
    }
};

// Schedule the job fetching at a specified interval
schedule.scheduleJob(env.FETCH_INTERVAL, updateJobPostings);

// Initial call to start the first fetch immediately
updateJobPostings();
