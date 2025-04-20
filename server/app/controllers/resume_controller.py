import os
from fastapi import UploadFile
import shutil
from werkzeug.utils import secure_filename
from server.app.controllers.auth_controller import User
from server.config import settings
# import boto3


async def save_resume_locally(user: User, resume: UploadFile, upload_dir: str = settings.UPLOAD_DIR):
    print("User received in save_resume_locally", user)
    print("File received in save_resume_locally", resume.filename)
    original_filename = secure_filename(resume.filename)
    _, ext = os.path.splitext(original_filename)
    new_filename = f"{user.id}{ext}"
    file_path = os.path.join(upload_dir, new_filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(resume.file, buffer) 
    return file_path, new_filename

async def save_resume_s3(file: UploadFile, upload_dir: str = "uploads/resumes"):
    pass