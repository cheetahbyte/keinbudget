from typing import Annotated
from fastapi import Depends, HTTPException, status
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
from app.core.config import SECRET_KEY, ALGORITHM
from app.database.models import User
from uuid import UUID

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

# TODO: maybe make this more efficient
async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], audience="auth")
        user_id = UUID(payload.get("sub"))
    except (JWTError, TypeError, ValueError) as e:
        print(e)
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail=f"invalid token: {e}")

    user = await User.get_or_none(id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    
    return user

async def get_user_from_entermediate_token(token: Annotated[str, Depends(oauth2_scheme)]) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], audience="2fa")
        user_id = UUID(payload.get("sub"))
    except (JWTError, TypeError, ValueError):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="invalid token")

    user = await User.get_or_none(id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    
    return user