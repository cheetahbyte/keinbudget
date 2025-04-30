from app.database.models import User, User2fa
from passlib.hash import argon2
from app.core.jwt import create_access_token
from app.core.mfa import prepare_token, validate_otp

async def login(data: dict) -> str | None:
    user = await User.get_or_none(email=data.get("email"))
    if not user or not user.password_hash:
        return None

    if not argon2.verify(data.get("password"), user.password_hash):
        return None

    token = create_access_token({"sub": str(user.id)})
    return token
   
async def enable_2fa(user: User):
    await User2fa.create(user = user)
    user.twofa_enabled = True
    await user.save()
    return await prepare_token(user)

async def validate_2fa(user: User, code: int):
    return await validate_otp(user, code)

async def disable_2fa(user: User):
    user.twofa_enabled = False
    await user.save()