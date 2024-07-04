from fastapi import APIRouter, Request, HTTPException, Response
from fastapi.responses import RedirectResponse
from dto import UserCreateDTO
from database import User
from tortoise.exceptions import IntegrityError
import uuid
import hashlib

router = APIRouter()

RANDOM_SESSION_ID="session1"
SESSION_DB = {}
USER_CORRECT = ("admin", "admin")

def get_random_session_id(username: str) -> str:
    m = hashlib.md5(username)
    m.update(username.encode("utf-8"))
    return str(uuid.UUID(m.hexdigest()))

@router.get("/")
async def users_root():
    return "main"

@router.post("/register")
async def create_user(data: UserCreateDTO):
    try:
        user = await User.create(name=data.name, email=data.email, password_hash=data.password)
        response = RedirectResponse("/", status_code=302)
        return response
    except Exception as e:
        if isinstance(e, IntegrityError):
            return {"status": 409, "msg": "email already exists"}
        
@router.post("/login")
async def login_user(username: str, password: str):
    allow = (username, password) == USER_CORRECT
    if allow is False:
        raise HTTPException(status_code=401)
    response = RedirectResponse("/", status_code=302)
    session_id: str = get_random_session_id(username)
    response.set_cookie(key="Authorization", value=session_id)
    SESSION_DB[session_id] = username
    return response

@router.delete("/logout")
async def session_logout(response: Response):
    response.delete_cookie(key="Authorization")
    SESSION_DB.pop(get_random_session_id("admin"), None)
        
def get_auth_user(request: Request):
    """verify that user has a valid session"""
    session_id = request.cookies.get("Authorization")
    if not session_id:
        raise HTTPException(status_code=401)
    if session_id not in SESSION_DB:
        raise HTTPException(status_code = 403)
    return True 