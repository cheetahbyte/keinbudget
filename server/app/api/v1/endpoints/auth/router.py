from fastapi import APIRouter, HTTPException, Depends, HTTPException
from app.api.v1.endpoints.auth import crud
from app.api.v1.endpoints.auth.schemas import LoginData
from app.core.auth import get_current_user, get_user_from_entermediate_token
from app.database.models import User


auth_router = APIRouter()


@auth_router.post("/login")
async def login(login_data: LoginData):
    token = await crud.login(login_data.model_dump(by_alias=False))
    
    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return token
        
@auth_router.put("/enable-2fa")
async def enable_2fa(user: User = Depends(get_current_user)):    
    url = await crud.enable_2fa(user)
    return {"url": url}

@auth_router.post("/validate-2fa")
async def validate_2fa(code: int, user: User = Depends(get_user_from_entermediate_token)):
    result = await crud.validate_2fa(user, code)
    if not result:
        raise HTTPException(401, "the provided two fa token is not valid.")
    return result

@auth_router.put("/disable-2fa")
async def disable_2fa(user: User = Depends(get_current_user)):
    await crud.disable_2fa(user)
    return {"ok": 1}