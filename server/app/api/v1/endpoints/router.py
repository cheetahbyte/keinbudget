from fastapi import APIRouter
from app.api.v1.endpoints.accounts.router import router as accounts_router
from app.api.v1.endpoints.users.router import router as users_router
from app.api.v1.endpoints.auth.router import auth_router
from app.api.v1.endpoints.transactions.router import router as transactions_router
from app.api.v1.endpoints.finance.router import router as finance_router
router = APIRouter()

@router.get("/version")
async def get_version() -> dict:
    with open("./version.txt") as e:
        version = e.read()
    return {"version": version}

router.include_router(users_router, prefix="/users", tags=["users"])
router.include_router(auth_router, prefix="/auth", tags=["auth"])
router.include_router(accounts_router, prefix="/accounts", tags=["accounts"])
router.include_router(transactions_router, prefix="/transactions", tags=["transactions"])
router.include_router(finance_router, prefix="/finance", tags=["finance"])