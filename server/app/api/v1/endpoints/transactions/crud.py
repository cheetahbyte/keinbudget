from app.database.models import Transaction, User, Account, Category
from uuid import UUID
from tortoise.expressions import Q

async def get_transactions(user: User, account_id: UUID = None) -> list[Transaction]:
    query = Transaction.filter(user=user).prefetch_related("to_account", "from_account", "category")

    if account_id:
        query = query.filter(
            Q(to_account_id=account_id) | Q(from_account_id=account_id)
        )

    return await query.order_by("-created_at").all()

async def get_last_transaction(limit: int, user: User) -> list[Transaction]:
    return await Transaction.filter(user=user).prefetch_related("to_account", "from_account", "category").order_by("-created_at").limit(limit).all()


async def create_transaction(transaction_data: dict, user: User) -> Transaction | None:
    from_account = await Account.get_or_none(id=transaction_data.get("from_account"))
    to_account = await Account.get_or_none(id=transaction_data.get("to_account"))
    category = await Category.get_or_none(id=transaction_data.get("category"))
    if not to_account and not from_account:
        return None
    return await Transaction.create(
        description=transaction_data.get("description"),
        amount=transaction_data.get("amount"),
        category=category,
        to_account=to_account,
        from_account=from_account,
        user=user,
        created_at=transaction_data.get("created_at")
    )


async def get_transaction_by_id(id: UUID, user: User) -> Transaction | None:
    return await Transaction.get_or_none(id=id, user=user)


async def delete_transaction_by_id(id: UUID, user: User) -> None:
    transaction = await Transaction.get_or_none(id=id, user=user)
    return await transaction.delete()

async def edit_transaction_by_id(id: UUID, transaction_data: dict, user: User) -> Transaction | None:
    tx = await Transaction.get_or_none(id=id, user=user)
    if not tx:
        return None
    if transaction_data.get("description"):
        tx.description = transaction_data.get("description")
    if transaction_data.get("amount"):
        tx.amount = transaction_data.get("amount")
    if transaction_data.get("category"):
        tx.category = await Category.get_or_none(id=transaction_data.get("category"))
    if transaction_data.get("to_account"):
        tx.to_account = await Account.get_or_none(id=transaction_data.get("to_account"))
        tx.from_account = None
    if transaction_data.get("from_account"):
        tx.from_account = await Account.get_or_none(id=transaction_data.get("from_account"))
        tx.to_account = None
    await tx.save()
    await tx.fetch_related("to_account", "from_account", "category")
    return tx