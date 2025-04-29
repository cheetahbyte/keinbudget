from app.database.models import User
from passlib.hash import argon2
from app.core.jwt import create_access_token

async def login(data: dict) -> str | None:
    user = await User.get_or_none(email=data.get("email"))
    if not user or not user.password_hash:
        return None

    if not argon2.verify(data.get("password"), user.password_hash):
        return None

    token = create_access_token({"sub": str(user.id)})
    return token
   
    
    