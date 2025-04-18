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


@router.post("login", response_model=Token)
async def login_user(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Annotated[Session, Depends(get_db)]):
    return await login(form_data, db)


# async def signup_users(request: SignupRequest):
#     try:
#         # Call the signup function and pass the validated input
#         result = signup(request.email, request.password)
#         return {"message": "User created successfully", "data": result}
#     except ValueError as e:
#         # Handle specific errors (e.g., user already exists)
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
#     except Exception as e:
#         # Handle unexpected errors
#         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred")