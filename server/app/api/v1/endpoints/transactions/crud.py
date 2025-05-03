from app.database.models import Transaction, User, Account
from uuid import UUID


async def get_transactions(user: User) -> list[Transaction]:
    return await Transaction.filter(user=user).prefetch_related("to_account", "from_account").all()

async def get_last_transaction(limit: int, user: User) -> list[Transaction]:
    return await Transaction.filter(user=user).prefetch_related("to_account", "from_account").order_by("-created_at").limit(limit).all()


async def create_transaction(transaction_data: dict, user: User) -> Transaction | None:
    from_account = await Account.get_or_none(id=transaction_data.get("from_account"))
    to_account = await Account.get_or_none(id=transaction_data.get("to_account"))
    if not to_account and not from_account:
        return None
    return await Transaction.create(
        description=transaction_data.get("description"),
        amount=transaction_data.get("amount"),
        to_account=to_account,
        from_account=from_account,
        user=user,
    )


async def get_transaction_by_id(id: UUID, user: User) -> Transaction | None:
    return await Transaction.get_or_none(id=id, user=user)
