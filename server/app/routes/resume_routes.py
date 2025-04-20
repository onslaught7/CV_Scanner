from fastapi import APIRouter, Depends
from typing import Annotated
from fastapi import UploadFile, File
from server.config import settings
from server.app.controllers.resume_controller import save_resume_locally, save_resume_s3
from server.app.middlewares.auth_middleware import verify_token
from server.app.controllers.auth_controller import User

router = APIRouter()


# Add file size/type validation here too (backend validation is always essential).
# Return consistent API response (e.g., include file name, status, or a message).
@router.post("/upload-resume")  
async def upload_resume(
    current_user: Annotated[User, Depends(verify_token)],
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
        path, filename = await save_resume_locally(current_user, resume)
    return {
        "message": "Resume uploaded successfully",
        "resume_path": path,
        "filename": filename
    }




