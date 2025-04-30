from tortoise import models, fields


class User(models.Model):
    id = fields.UUIDField(primary_key=True)
    email = fields.CharField(unique=True, max_length=50)
    first_name = fields.CharField(max_length=25)
    last_name = fields.CharField(max_length=25, null=True)
    password_hash = fields.CharField(max_length=128, null=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    modified_at = fields.DatetimeField(auto_now=True)

    def full_name(self) -> str:
        """
        Returns the full name
        """
        if self.first_name or self.last_name:
            return f"{self.first_name or ''} {self.last_name or ''}".strip()

    class PydanticMeta:
        computed = ["full_name"]
        exclude = ["password_hash"]
        
class Transaction(models.Model):
    id = fields.UUIDField(primary_key=True)
    user = fields.ForeignKeyField("models.User", related_name="transactions")
    description = fields.CharField(max_length=255)
    amount = fields.DecimalField(max_digits=10, decimal_places=2)
    from_account = fields.ForeignKeyField(
        "models.Account",
        related_name="transactions_out",
        null=True,
        on_delete=fields.SET_NULL
    )
    to_account = fields.ForeignKeyField(
        "models.Account",
        related_name="transactions_in",
        null=True,
        on_delete=fields.SET_NULL
    )
    created_at = fields.DatetimeField(auto_now_add=True)
    class Meta:
        table = "transactions"
        
class Account(models.Model):
    id = fields.UUIDField(primary_key=True)
    name = fields.CharField(max_length=128)
    user = fields.ForeignKeyField("models.User", related_name="accounts")
    start_balance = fields.FloatField(max_digits=10, decimal_places=2)
    created_at = fields.DatetimeField(auto_now_add=True)
    class Meta:
        table = "accounts"