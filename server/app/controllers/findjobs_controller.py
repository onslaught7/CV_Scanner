from pydantic import BaseModel, Field
from typing import Optional
from server.app.services.find_jobs import fetch_jobs


class JobQueryParams(BaseModel):
    field: str
    geoid: str
    page: int = Field(1, ge=1)
    sortBy: Optional[str] = None
    jobType: Optional[str] = None
    expLevel: Optional[str] = None
    workType: Optional[str] = None
    filterByCompany: Optional[str] = None


async def find_linkedin_jobs(job_params: JobQueryParams):
    # Call th fetch jobs service and return the list based on the filteration 
    print("Job params in findjobs_controller: ", job_params)
    jobs_list = fetch_jobs(job_params)
    return jobs_list
