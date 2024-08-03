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
