from fastapi import APIRouter, HTTPException, Depends, HTTPException
from app.api.v1.endpoints.auth import crud
from app.api.v1.endpoints.auth.schemas import LoginData
from app.core.auth import get_current_user
from app.database.models import User


auth_router = APIRouter()


# TODO: granular error handling
@auth_router.post("/login")
async def login(login_data: LoginData):
    token = await crud.login(login_data.model_dump())
    if not token:
        raise HTTPException(404, "error")
    return {"access_token": token, "token_type": "bearer"}
        
@auth_router.put("/enable-2fa")
async def enable_2fa(user: User = Depends(get_current_user)):    
    url = await crud.enable_2fa(user)
    return {"url": url}

@auth_router.post("/validate-2fa")
async def validate_2fa(code: int, user: User = Depends(get_current_user)):
    result = await crud.validate_2fa(user, code)
    return {"ok": result}

@auth_router.put("/disable-2fa")
async def disable_2fa(user: User = Depends(get_current_user)):
    await crud.disable_2fa(user)
    return {"ok": 1}