# Code file to manage authentication tokens
from fastapi import Request, HTTPException, status, Depends
from typing import Annotated
from fastapi.responses import JSONResponse
from jwt.exceptions import InvalidTokenError
from server.config import settings
from server.app.controllers.auth_controller import get_user, TokenData
from server.app.models.database import get_db
from sqlalchemy.orm import Session
from datetime import datetime, timezone
import jwt


SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM



async def verify_token(request: Request, db: Annotated[Session, Depends(get_db)]):
    token = request.cookies.get("access_token")  # Assuming you're storing the token in cookies
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No token provided, please login first.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decode the JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        exp = payload.get("exp")
        if not email or (exp and datetime.fromtimestamp(exp, tz=timezone.utc) < datetime.now(timezone.utc)):
            raise credentials_exception        
        token_data = TokenData(email=email)
        # Retrieve user from the database
        user = get_user(db, email=token_data.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found.",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token could not be verified.",
            headers={"WWW-Authenticate": "Bearer"},
        )

