from tortoise import models, fields
import pyotp

class User(models.Model):
    id = fields.UUIDField(primary_key=True)
    email = fields.CharField(unique=True, max_length=50)
    first_name = fields.CharField(max_length=25)
    last_name = fields.CharField(max_length=25, null=True)
    password_hash = fields.CharField(max_length=128, null=True)
    twofa_enabled = fields.BooleanField(default=False)
    twofa: fields.ReverseRelation["User2fa"]
    created_at = fields.DatetimeField(auto_now_add=True)
    modified_at = fields.DatetimeField(auto_now=True)
    categories: fields.ReverseRelation["Category"]


    @property
    def full_name(self) -> str:
        """
        Returns the full name
        """
        if self.first_name or self.last_name:
            return f"{self.first_name or ''} {self.last_name or ''}".strip()

    class PydanticMeta:
        computed = ["full_name"]
        exclude = ["password_hash"]

class User2fa(models.Model):
    id = fields.UUIDField(primary_key=True)
    user = fields.OneToOneField("models.User", related_name="twofa")
    created_at = fields.DatetimeField(auto_now_add=True)
    twofa_secret = fields.CharField(max_length=32, default=pyotp.random_base32())
        
class Transaction(models.Model):
    id = fields.UUIDField(primary_key=True)
    user = fields.ForeignKeyField("models.User", related_name="transactions")
    description = fields.CharField(max_length=255)
    amount = fields.FloatField(max_digits=10, decimal_places=2)
    from_account = fields.ForeignKeyField(
        "models.Account",
        related_name="incoming_transactions",
        null=True,
        on_delete=fields.CASCADE
    )
    to_account = fields.ForeignKeyField(
        "models.Account",
        related_name="outgoing_transactions",
        null=True,
        on_delete=fields.CASCADE
    )
    created_at = fields.DatetimeField()
    category = fields.ForeignKeyField(
        "models.Category",
        related_name="transactions",
        null=True,
        on_delete=fields.SET_NULL
    )
    class Meta:
        table = "transactions"
        
class Account(models.Model):
    id = fields.UUIDField(primary_key=True)
    name = fields.CharField(max_length=128)
    user = fields.ForeignKeyField("models.User", related_name="accounts")
    incoming_transactions: fields.ReverseRelation["Transaction"]
    outgoing_transactions: fields.ReverseRelation["Transaction"]
    start_balance = fields.FloatField(max_digits=10, decimal_places=2)
    created_at = fields.DatetimeField(auto_now_add=True)
    class Meta:
        table = "accounts"
        
    class PydanticMeta:
        computed = ["current_balance"]
        
    async def current_balance(self) -> float:
        incoming = await self.incoming_transactions.all().values_list("amount", flat=True)
        outgoing = await self.outgoing_transactions.all().values_list("amount", flat=True)

        incoming_sum = sum(float(x) for x in incoming)
        outgoing_sum = sum(float(x) for x in outgoing)

        return round(float(self.start_balance) - incoming_sum + outgoing_sum, 2)

class Category(models.Model):
    id = fields.UUIDField(primary_key=True)
    name = fields.CharField(max_length=25)
    user = fields.ForeignKeyField("models.User", related_name="categories", on_delete=fields.CASCADE)
    description = fields.CharField(max_length=255, nullable=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    icon = fields.CharField(max_length=255, default="shopping-basket")
    #modified_at = fields.DatetimeField(auto_now=True)
    class Meta:
        table = "categories"