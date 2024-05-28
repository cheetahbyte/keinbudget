from tortoise import fields, models
import decimal

class _AccountBase(models.Model):
    id = fields.UUIDField(pk=True)
    name = fields.CharField(max_length=255)
    created_at = fields.DatetimeField(auto_now_add=True)
    modified_at = fields.DatetimeField(auto_now=True)

    class Meta:
        abstract = True


class Account(_AccountBase):
    balance = fields.DecimalField(max_digits=55, decimal_places=2, default=decimal.Decimal(0.0))

class ExternalAccount(_AccountBase):
    pass

class Transaction(models.Model):
    id = fields.UUIDField(pk=True)
    fr = fields.UUIDField(null=False)
    to = fields.UUIDField(null=False)
    amount = fields.DecimalField(max_digits=55, decimal_places=2)
    description = fields.CharField(max_length=255, null=True)
    currency = fields.CharField(max_length=3, null=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    modified_at = fields.DatetimeField(auto_now=True)