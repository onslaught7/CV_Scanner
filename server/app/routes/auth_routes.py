from server.app.controllers.auth_controller import login, signup, logout, google_login, google_signup, SignupResponse, LoginResponse, User, UserCreate, get_current_user
# from server.app.middlewares.auth_middleware import verify_token
from fastapi import APIRouter, Depends
from typing import Annotated
from sqlalchemy.orm import Session
from server.app.models.database import get_db
from fastapi.security import OAuth2PasswordRequestForm
from server.app.middlewares.auth_middleware import verify_token



router = APIRouter()


@router.post("/signup")
async def signup_user(user: UserCreate, db: Annotated[Session, Depends(get_db)]):
    print("User from Route: ", user)
    return await signup(user, db)


@router.post("/login", response_model=LoginResponse)
async def login_user(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Annotated[Session, Depends(get_db)]):
    return await login(form_data, db)


@router.post("/logout")
async def logout_user():
    return await logout()


@router.get("/user-info")
async def get_user_info(current_user: Annotated[User, Depends(verify_token)]):
    return current_user