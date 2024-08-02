// src/types.ts

export interface JobData {
    jobId: string;
    title: string;
    company: string;
    location: string;
    lastUpdate: string;
}

export interface EnvVariables {
    LINKEDIN_ACCESS_TOKEN: string;
    SEARCH_KEYWORDS: string;
    SEARCH_LOCATION: string;
    OUTPUT_FILE: string;
    FETCH_INTERVAL: string;
}
