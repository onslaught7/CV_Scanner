from sqlalchemy import Column, String, Integer, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from server.app.models.database import Base


# Model for our users table
class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    disabled = Column(Boolean, default=False, nullable=False)

    resume = relationship("ResumeModel", back_populates="user", uselist=False, cascade="all, delete-orphan")


# Model for our resume table
class ResumeModel(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    resume_url = Column(String)
    ats_score = Column(Integer)

    user = relationship("UserModel", back_populates="resume")
