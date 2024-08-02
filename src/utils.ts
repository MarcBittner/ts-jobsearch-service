// src/utils.ts
import axios from 'axios';
import { createObjectCsvWriter } from 'csv-writer';
import * as fs from 'fs';
import { JobData, EnvVariables } from './types';

export const fetchJobPostings = async (env: EnvVariables): Promise<JobData[]> => {
    try {
        const response = await axios.get('https://api.linkedin.com/v2/jobSearch', {
            params: {
                q: 'jobs',
                keywords: env.SEARCH_KEYWORDS,
                location: env.SEARCH_LOCATION,
            },
            headers: {
                Authorization: `Bearer ${env.LINKEDIN_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data.elements.map((job: any) => ({
            jobId: job.id,
            title: job.title,
            company: job.companyName,
            location: job.location,
            lastUpdate: new Date().toISOString(),
        }));
    } catch (error) {
        console.error('Error fetching job postings:', error);
        return [];
    }
};

export const readPreviousData = (filePath: string): JobData[] => {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        const lines = data.split('\n').slice(1); // Skip header
        return lines.map((line) => {
            const [jobId, title, company, location, lastUpdate] = line.split(',');
            return { jobId, title, company, location, lastUpdate };
        });
    }
    return [];
};

export const saveNewData = async (filePath: string, newData: JobData[]): Promise<void> => {
    const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: [
            { id: 'jobId', title: 'Job ID' },
            { id: 'title', title: 'Title' },
            { id: 'company', title: 'Company' },
            { id: 'location', title: 'Location' },
            { id: 'lastUpdate', title: 'Last Update' },
        ],
        append: true,
    });

    await csvWriter.writeRecords(newData);
};
