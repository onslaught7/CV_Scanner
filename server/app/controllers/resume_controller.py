import os
from fastapi import UploadFile, HTTPException, status
import shutil
from werkzeug.utils import secure_filename
from server.app.controllers.auth_controller import User
from server.config import settings
from server.app.models.models import ResumeModel
from sqlalchemy.orm import Session
from pydantic import BaseModel
from server.app.services.ats_score import ats_score_and_keywords
from typing import List
# import boto3


class JDRequest(BaseModel):
    jobDescription: str


class ATSResponse(BaseModel):
    atsScore: int
    keyWordsMatching: List[str]
    keyWordsMissing: List[str]



async def save_resume_locally(user: User, db: Session, resume: UploadFile, upload_dir: str = settings.UPLOAD_DIR):
    try:
        print("User received in save_resume_locally with id: ", user.id)
        print("File received in save_resume_locally: ", resume.filename)
        original_filename = secure_filename(resume.filename)
        _, ext = os.path.splitext(original_filename)
        new_filename = f"{user.id}{ext}"
        file_path = os.path.join(upload_dir, new_filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(resume.file, buffer) 
        resume_record = db.query(ResumeModel).filter(ResumeModel.user_id == user.id).first()
        if resume_record:
            resume_record.resume_url = file_path
        else:
            resume_record = ResumeModel(user_id = user.id, resume_url = file_path)
            db.add(resume_record)
        db.commit()
        db.refresh(resume_record)
        return file_path, new_filename
    except Exception as e:
        print("Unexpected Error Occured", e)


async def save_resume_s3(file: UploadFile, upload_dir: str = "uploads/resumes"):
    pass


async def calculate_ats_score(job_description: str, user: User, db: Session):
    try:
        resume_path_url = db.query(ResumeModel).filter(ResumeModel.user_id == user.id).first().resume_url
        if not resume_path_url or not job_description:
            raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found."
        )
        ats_score, matching_keywords, missing_keywords = ats_score_and_keywords(resume_path_url, job_description) 
        print("Resume URL froom database: ", resume_path_url)
        print("Job Description from client: ", job_description)
        return {
            "atsScore": ats_score,
            "keyWordsMatching": matching_keywords,
            "keyWordsMissing": missing_keywords,
        }
    except Exception as e:
        print("Unexpected error", e)
        raise HTTPException(status_code=500, detail="Something went wrong during ATS calculation.")
    