from app.database.models import Account, User
from uuid import UUID

async def create_account(account_data: dict, user: User) -> Account:
    return await Account.create(name=account_data.get("name"),user=user, start_balance=account_data.get("start_balance"))

async def get_account_by_id(account_id: UUID, user: User) -> Account | None:
    return await Account.get_or_none(id=account_id, user=user)

async def get_accounts(user: User) -> list[Account]:
    return await Account.all().filter(user=user)