# Code base to manage login and signup authentication
from datetime import datetime, timedelta, timezone
from typing import Annotated
import jwt
from fastapi import Depends, HTTPException, status #, FastAPI
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from server.app.models.models import UserModel
from sqlalchemy.orm import Session
from server.app.models.database import get_db 
from server.config import settings


SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = 60


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: EmailStr


class SignupResponse(BaseModel):
    message: str
    user: EmailStr
    access_token: str
    token_type: str


class User(BaseModel):
    id: int
    username: str
    email: EmailStr
    disabled: bool


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


# Separating User and UserInDB ensures that sensitive data (like passwords) is not exposed in API responses.
class UserInDB(User):
    password: str


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# app = FastAPI()


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_hash_password(password):
    return pwd_context.hash(password)


def create_user(db: Session, user_data):
    db_user = UserModel(**user_data)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_by_email(db: Session, email: EmailStr):
    return db.query(UserModel).filter(UserModel.email == email).first()


def get_user(db, email: EmailStr):
    return get_user_by_email(db, email)
    

def authenticate_user(db: Session, email: EmailStr, plain_password: str):
    user = get_user(db, email)
    if not user:
        return False
    if not verify_password(plain_password, user.password):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else: 
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: Annotated[Session, Depends(get_db)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except InvalidTokenError:
        raise credentials_exception
    user = get_user(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(current_user: Annotated[User, Depends(get_current_user)]):
    if current_user.disabled:
        raise HTTPException(status_code=401, detail="Inactive User")
    return current_user


# @app.post("/login")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)) -> Token:
    user = authenticate_user(db, form_data.username, form_data.password)
    print(form_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data = {"sub": user.email}, # we are passing the email as the token subject
        expires_delta = access_token_expires        
    )
    return Token(access_token=access_token, token_type="bearer")

# @app.post("/signup", response_model=SignupResponse)
async def signup(user: UserCreate, db: Annotated[Session, Depends(get_db)]):
    existing_user = get_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(
            status_code=400, 
            detail="An account with this email already exists. Please log in instead."
        )
    hashed_password = get_hash_password(user.password)
    user_data = user.model_dump()
    user_data["password"] = hashed_password
    user_data["disabled"] = False
    new_user = create_user(db, user_data)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data = {"sub": new_user.email}, 
        expires_delta = access_token_expires
    )
    return SignupResponse(
        message="User created successfully",
        user=new_user.email,
        access_token=access_token,
        token_type="bearer"
    )



# @app.get("/user/me/", response_model=User)
# async def read_users_me(current_user: Annotated[User, Depends(get_current_active_user)]):
#     return current_user


# @app.get("/users/me/items/")
# async def read_own_items(current_user: Annotated[User, Depends(get_current_active_user)]):
#     return [{"item_id": "Foo", "owner": current_user.username}]

    


def google_login():
    pass

def google_signup():
    pass