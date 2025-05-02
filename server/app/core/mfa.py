import pyotp
from app.database.models import User
from app.core.config import TOTP_ISSUER

async def get_otp(user: User) -> pyotp.TOTP:
    secret = (await user.twofa).twofa_secret
    totp = pyotp.TOTP(secret)
    return totp

async def prepare_token(user: User) -> str:
    totp = await get_otp(user)
    return totp.provisioning_uri(name = user.email, issuer_name = TOTP_ISSUER)

async def validate_otp(user: User, code: int) -> bool:
    totp = await get_otp(user)
    return totp.verify(code)