from server.app.services.cover_letter import cover_letter_service
from server.app.controllers.auth_controller import User
from sqlalchemy.orm import Session
from fastapi import HTTPException
from server.app.models.models import ResumeModel
from server.app.services.ats_score import extract_text_from_resume

async def generate_cover_letter(jd: str, user: User, db: Session):
    try:
        resume_record = db.query(ResumeModel).filter(ResumeModel.user_id == user.id).first()
        if not resume_record: 
            raise HTTPException(status_code=400, detail="User record not found")
        resume_url = resume_record.resume_url
        resume_text = extract_text_from_resume(resume_url)
        generated_cover_letter = cover_letter_service(jd, resume_text)
        return generated_cover_letter
    except Exception as e:
        print("Unexpected error", e)
        raise HTTPException(status_code=500, detail="Something went wrong during ATS calculation.")