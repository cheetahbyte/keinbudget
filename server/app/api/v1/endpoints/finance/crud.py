from app.api.v1.endpoints.finance.schema import FinanceOverview, FinanceMonthlyReport
from app.database.models import User, Account, Transaction
from datetime import datetime
from typing import List, Optional
import calendar


async def get_transactions_in_timerange(
    user: User, start_date: datetime, end_date: datetime, **kwargs
) -> List[Transaction]:
    transactions = await Transaction.filter(
        user=user, created_at__gte=start_date, created_at__lte=end_date, **kwargs
    ).all()
    return transactions


def get_month_date_range(
    year: Optional[int] = None, month: Optional[int] = None
) -> tuple[datetime, datetime]:
    today = datetime.today()
    year = year or today.year
    month = month or today.month
    first = datetime(year, month, 1, 0, 0, 0)
    last_day = calendar.monthrange(year, month)[1]
    last = datetime(year, month, last_day, 23, 59, 59, 999999)
    return first, last


async def calculate_month_expenses(
    user: User, year: Optional[int] = None, month: Optional[int] = None
) -> float:
    start_date, end_date = get_month_date_range(year, month)
    transactions = await get_transactions_in_timerange(
        user, start_date, end_date, to_account_id__isnull=True
    )
    return sum(t.amount for t in transactions)


async def calculate_month_income(
    user: User, year: Optional[int] = None, month: Optional[int] = None
) -> float:
    start_date, end_date = get_month_date_range(year, month)
    transactions = await get_transactions_in_timerange(
        user, start_date, end_date, from_account_id__isnull=True
    )
    return sum(t.amount for t in transactions)


async def calculate_current_balance(user: User) -> float:
    accounts = await Account.filter(user=user).all()
    balances = [(await acc.current_balance()) for acc in accounts]
    return sum(balances)


async def finance_overview(
    user: User, year: Optional[int] = None, month: Optional[int] = None
) -> FinanceOverview:
    expenses = await calculate_month_expenses(user, year, month)
    income = await calculate_month_income(user, year, month)
    balance = await calculate_current_balance(user)
    return FinanceOverview(
        total_balance=balance,
        income=income,
        expenses=expenses,
        savings=-1.0,
    )


async def get_finance_report(user: User, months: int = 6, relevant_only: bool = False) -> List[FinanceMonthlyReport]:
    """Returns income and expenses for the last `months` months. 
    If `relevant_only` is True, only months with income or expenses > 0 are included.
    """
    now = datetime.now()
    reports: List[FinanceMonthlyReport] = []

    for i in range(months):
        month = (now.month - i - 1) % 12 + 1
        year = now.year - ((now.month - i - 1) // 12)

        income = await calculate_month_income(user, year=year, month=month)
        expenses = await calculate_month_expenses(user, year=year, month=month)

        if not relevant_only or (income > 0 or expenses > 0):
            reports.append(FinanceMonthlyReport(
                month=calendar.month_abbr[month],
                income=income,
                expenses=expenses
            ))

    return list(reversed(reports))
