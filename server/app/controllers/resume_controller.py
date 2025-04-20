import os
from fastapi import UploadFile
import shutil
from werkzeug.utils import secure_filename
from server.app.controllers.auth_controller import User
from server.config import settings
from server.app.models.models import ResumeModel
from sqlalchemy.orm import Session
# import boto3


async def save_resume_locally(user: User, db: Session, resume: UploadFile, upload_dir: str = settings.UPLOAD_DIR):
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

async def save_resume_s3(file: UploadFile, upload_dir: str = "uploads/resumes"):
    pass


async def calculate_ats_score():
    pass