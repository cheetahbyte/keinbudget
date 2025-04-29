from fastapi import APIRouter, HTTPException
from app.api.v1.endpoints.auth import crud
from app.api.v1.endpoints.auth.schemas import LoginData


auth_router = APIRouter()


# TODO: granular error handling
@auth_router.post("/login")
async def login(login_data: LoginData):
    token = await crud.login(login_data.model_dump())
    if not token:
        raise HTTPException(404, "error")
    return {"access_token": token, "token_type": "bearer"}
        
    
    
    