from server.app.controllers.auth_controller import login, signup, google_login, google_signup, SignupResponse, Token, UserCreate
from server.app.middlewares.auth_middleware import verify_token
from fastapi import APIRouter, Depends
from typing import Annotated
from sqlalchemy.orm import Session
from server.app.models.database import get_db
from fastapi.security import OAuth2PasswordRequestForm


router = APIRouter()


@router.post("/signup", response_model=SignupResponse)
async def signup_user(user: UserCreate, db: Annotated[Session, Depends(get_db)]):
    return await signup(user, db)


@router.post("/login", response_model=Token)
async def login_user(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Annotated[Session, Depends(get_db)]):
    return await login(form_data, db)

