from tortoise import fields, models
import decimal

class TimeableEntry(models.Model):
    id = fields.UUIDField(pk=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    modified_at = fields.DatetimeField(auto_now=True)

    class Meta:
        abstract = True

class _AccountBase(TimeableEntry):
    name = fields.CharField(max_length=255)
    

    class Meta:
        abstract = True


class Account(_AccountBase):
    balance = fields.DecimalField(max_digits=55, decimal_places=2, default=decimal.Decimal(0.0))

class ExternalAccount(_AccountBase):
    pass

class Transaction(TimeableEntry):
    fr = fields.UUIDField(null=False)
    to = fields.UUIDField(null=False)
    amount = fields.DecimalField(max_digits=55, decimal_places=2)
    description = fields.CharField(max_length=255, null=True)
    currency = fields.CharField(max_length=3, null=True)

class User(TimeableEntry):
    id = fields.UUIDField(pk=True)
    name = fields.TextField(null=True)
    email = fields.CharField(unique=True, max_length=256)
    password_hash = fields.TextField(max_length=256)