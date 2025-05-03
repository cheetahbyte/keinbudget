from typing import Optional
from fastapi import APIRouter, Depends, Query
from app.api.v1.endpoints.finance.schema import FinanceOverview
from app.api.v1.endpoints.finance import crud
from app.database.models import User
from app.core.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=FinanceOverview)
async def finance_overview(
    year: Optional[int] = Query(None, ge=1),
    month: Optional[int] = Query(None, ge=1, le=12),
    user: User = Depends(get_current_user),
):
    return await crud.finance_overview(user, year=year, month=month)


@router.get("/report")
async def finance_monthly_report(
    months: int = 6,
    relevant_only: bool = False,
    user: User = Depends(get_current_user),
):
    return await crud.get_finance_report(user, months, relevant_only)