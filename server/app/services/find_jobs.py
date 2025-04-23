import requests
from server.config import settings

  
SCRAPINGDOG_API_KEY = settings.SCRAPINGDOG_API_KEY
SCRAPINGDOG_URL = settings.SCRAPINGDOG_URL


def fetch_jobs(job_params): 
    params = {
        "api_key": SCRAPINGDOG_API_KEY,
        "field": job_params.field,
        "geoid": job_params.geoid,
        "page": job_params.page,
        "sortBy": job_params.sortBy,
        "jobType": job_params.jobType,
        "expLevel": job_params.expLevel,
        "workType": job_params.workType,
        "filterByCompany": job_params.filterByCompany
    }
    
    response = requests.get(SCRAPINGDOG_URL, params=params)
    
    if response.status_code == 200:
        data = response.json()
        return data
    else:
        return f"Request failed with status code: {response.status_code}"


# ToDo
# This service is hit from findjobs_controller when the user hits find jobs
# At the botom part of the screen, a new section is rendered with options
# The options will provide the values for the above params
# the values are put into params and the response is generated
# This response id then rendered on the front-end in a clean interactive ui
# the user can click and get to the posting and get the job description from there and use it here