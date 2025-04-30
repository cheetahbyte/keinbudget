from app.database.models import Account, User

async def create_account(account_data: dict, user: User) -> Account:
    return await Account.create(name=account_data.get("name"),user=user, start_balance=account_data.get("start_balance"))