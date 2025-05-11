from app.api.v1.endpoints.finance.schema import FinanceOverview, FinanceMonthlyReport
from app.database.models import User, Account, Transaction
from datetime import datetime
from zoneinfo import ZoneInfo
from typing import List, Optional
import calendar

# should not be hardcoded
LOCAL_TZ = ZoneInfo("Europe/Berlin")
UTC_TZ = ZoneInfo("UTC")


async def get_transactions_in_timerange(
    user: User, start_date: datetime, end_date: datetime, **kwargs
) -> List[Transaction]:
    """
    Gibt alle Transaktionen des Nutzers zwischen start_date (inklusive)
    und end_date (exklusive) zurück.
    Beide Datetimes sind tz-aware in UTC.
    """
    return await Transaction.filter(
        user=user,
        created_at__gte=start_date,
        created_at__lt=end_date,
        **kwargs
    ).all()


def get_month_date_range(
    year: Optional[int] = None,
    month: Optional[int] = None
) -> tuple[datetime, datetime]:
    """
    Liefert die UTC-Intervallgrenzen für den gesamten Monatszeitraum:
      start = 1. des Monats 00:00 LOCAL → in UTC
      end   = 1. des Folgemonats 00:00 LOCAL → in UTC
    """

    now_local = datetime.now(LOCAL_TZ)
    year = year or now_local.year
    month = month or now_local.month

    start_local = datetime(year, month, 1, 0, 0, 0, tzinfo=LOCAL_TZ)
    if month == 12:
        end_local = datetime(year + 1, 1, 1, 0, 0, 0, tzinfo=LOCAL_TZ)
    else:
        end_local = datetime(year, month + 1, 1, 0, 0, 0, tzinfo=LOCAL_TZ)

    start_utc = start_local.astimezone(UTC_TZ)
    end_utc = end_local.astimezone(UTC_TZ)
    return start_utc, end_utc


async def calculate_month_expenses(
    user: User,
    year: Optional[int] = None,
    month: Optional[int] = None
) -> float:
    """
    Summiert alle Ausgaben (to_account_id IS NULL) im gegebenen Monat.
    """
    start_date, end_date = get_month_date_range(year, month)
    txs = await get_transactions_in_timerange(
        user, start_date, end_date, to_account_id__isnull=True
    )
    return sum(t.amount for t in txs)


async def calculate_month_income(
    user: User,
    year: Optional[int] = None,
    month: Optional[int] = None
) -> float:
    """
    Summiert alle Einnahmen (from_account_id IS NULL) im gegebenen Monat.
    """
    start_date, end_date = get_month_date_range(year, month)
    txs = await get_transactions_in_timerange(
        user, start_date, end_date, from_account_id__isnull=True
    )
    return sum(t.amount for t in txs)


async def calculate_current_balance(user: User) -> float:
    """
    Addiert die aktuellen Salden aller Accounts des Nutzers.
    """
    accounts = await Account.filter(user=user).all()
    balances = [await acc.current_balance() for acc in accounts]
    return sum(balances)


async def finance_overview(
    user: User,
    year: Optional[int] = None,
    month: Optional[int] = None
) -> FinanceOverview:
    """
    Gibt für das angegebene Jahr/Monat Gesamt-Balance, Einnahmen, Ausgaben
    und eine Platzhalter-Sparrate zurück.
    """
    expenses = await calculate_month_expenses(user, year, month)
    income = await calculate_month_income(user, year, month)
    balance = await calculate_current_balance(user)
    return FinanceOverview(
        total_balance=balance,
        income=income,
        expenses=expenses,
        savings=-1.0,
    )


async def get_finance_report(
    user: User,
    months: int = 6,
    relevant_only: bool = False
) -> List[FinanceMonthlyReport]:
    """
    Returns income and expenses for the last `months` months.
    If `relevant_only` is True, only months with income or expenses > 0 are included.
    """
    now_local = datetime.now(LOCAL_TZ)
    reports: List[FinanceMonthlyReport] = []

    for i in range(months):
        month_index = now_local.month - i - 1
        year_offset, month0 = divmod(month_index, 12)
        year = now_local.year + year_offset
        month = month0 + 1

        income = await calculate_month_income(user, year=year, month=month)
        expenses = await calculate_month_expenses(user, year=year, month=month)

        if not relevant_only or (income > 0 or expenses > 0):
            reports.append(FinanceMonthlyReport(
                month=calendar.month_abbr[month],
                income=income,
                expenses=expenses
            ))

    return list(reversed(reports))