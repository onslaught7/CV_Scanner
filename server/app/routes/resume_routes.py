from fastapi import APIRouter, Depends
from typing import Annotated
from fastapi import UploadFile, File
from server.config import settings
from server.app.models.database import get_db
from sqlalchemy.orm import Session
from server.app.controllers.resume_controller import save_resume_locally, save_resume_s3, calculate_ats_score
from server.app.middlewares.auth_middleware import verify_token
from server.app.controllers.auth_controller import User

router = APIRouter()


# Add file size/type validation here too (backend validation is always essential).
# Return consistent API response (e.g., include file name, status, or a message).
@router.post("/upload-resume")  
async def upload_resume(
    current_user: Annotated[User, Depends(verify_token)],
    db: Annotated[Session, Depends(get_db)],
    resume: UploadFile = File(...)    
):
    print("File received at resume_routes: ", resume.filename)
    if settings.ENV == "production":
        # path = save_resume_s3(file, bucket_name = settings.S3_BUCKET)
        # path, filename = "To be implemented"
        path = "s3/path/to/resume.pdf"
        filename = resume.filename
        pass
    else:
        path, filename = await save_resume_locally(current_user, db, resume)
    return {
        "message": "Resume uploaded successfully",
        "resume_path": path,
        "filename": filename
    }


@router.get("/calculate-ats")
async def calculate_ats():
    return await calculate_ats_score()




