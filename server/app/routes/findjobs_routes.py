from fastapi import APIRouter, Depends, Body
from server.app.controllers.findjobs_controller import JobQueryParams, find_linkedin_jobs
from typing import Annotated
from server.app.middlewares.auth_middleware import verify_token
from server.app.models.models import UserModel

router = APIRouter()


@router.post("/get-jobs")
async def find_jobs(job_params: Annotated[JobQueryParams, Body(...)], user: Annotated[UserModel, Depends(verify_token)]):
    jobs =  await find_linkedin_jobs(job_params)
    return {"jobs": jobs}