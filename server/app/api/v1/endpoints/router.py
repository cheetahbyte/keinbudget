from fastapi import APIRouter
from app.api.v1.endpoints.users.router import router as users_router
from app.api.v1.endpoints.auth.router import auth_router
router = APIRouter()

router.include_router(users_router, prefix="/users", tags=["users"])
router.include_router(auth_router, prefix="/auth", tags=["auth"])