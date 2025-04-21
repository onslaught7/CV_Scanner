from fastapi import APIRouter, Depends
from server.app.controllers.coverletter_controller import generate_cover_letter
from server.app.middlewares.auth_middleware import verify_token
from server.app.controllers.resume_controller import JDRequest
from typing import Annotated
from server.app.controllers.auth_controller import User
from sqlalchemy.orm import Session
from server.app.models.database import get_db

router = APIRouter()


@router.post("/generate-coverletter")
async def get_coverletter(
    jd: JDRequest,
    current_user: Annotated[User, Depends(verify_token)],
    db: Annotated[Session, Depends(get_db)]
):
    return await generate_cover_letter(jd.jobDescription, current_user, db)