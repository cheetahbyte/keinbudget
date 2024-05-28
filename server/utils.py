from database import ExternalAccount, Account


async def fetch_account(account_id: str):
    account = await Account.filter(id=account_id).first() or await ExternalAccount.filter(id=account_id).first()
    return account