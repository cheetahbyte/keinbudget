from app.database.models import User, User2fa
from passlib.hash import argon2
from app.core.jwt import create_access_token, create_intermediate_token
from app.core.mfa import prepare_token, validate_otp

async def login(data: dict) -> dict | None:
    user = await User.get_or_none(email=data.get("email"))
    if not user or not user.password_hash:
        return None

    if not argon2.verify(data.get("password"), user.password_hash):
        return None
    
    if user.twofa_enabled:
        token = create_intermediate_token({"sub": str(user.id)})
    else:
        token = create_access_token({"sub": str(user.id)})
        
    return {"token": token, "token_type": "bearer", "twofa": user.twofa_enabled}
   
async def enable_2fa(user: User):
    await User2fa.create(user = user)
    user.twofa_enabled = True
    await user.save()
    return await prepare_token(user)

async def validate_2fa(user: User, code: int) -> str | None:
    result = await validate_otp(user, code)
    token = create_access_token({"sub": str(user.id)})
    if result:
        return token
    return None

async def disable_2fa(user: User):
    user.twofa_enabled = False
    await user.save()