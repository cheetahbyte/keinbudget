import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tortoise.contrib.fastapi import register_tortoise
from fastapi.staticfiles import StaticFiles
from dto import AccountCreateDTO, ExternalAccountCreateDTO, TransactionCreateDTO
from database import Account, ExternalAccount, Transaction, _AccountBase
import decimal
import middleware
import utils
origins = [
    "http://localhost:5173",
    "http://localhost:3000"
]

is_production: bool = os.getenv("MODE") == "prod"

app = FastAPI(docs_url=None if is_production else "/docs", redoc_url=None if is_production else "/redoc")
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
register_tortoise(app, db_url='sqlite://db.sqlite3', modules={'models': ['database']}, generate_schemas=True)


route_prefix: str = "/api" if is_production else ""

class SPAStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope):
        response = await super().get_response(path, scope)
        if response.status_code == 404:
            response = await super().get_response('.', scope)
        return response

@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post(route_prefix+"/transaction")
async def create_transaction(transaction: TransactionCreateDTO):
    fr = await Account.filter(id=transaction.fr).first() or await ExternalAccount.filter(id=transaction.fr).first()
    to = await Account.filter(id=transaction.to).first() or await ExternalAccount.filter(id=transaction.to).first()
    if type(fr) != ExternalAccount:
        fr.balance -= decimal.Decimal(transaction.amount)
    if type(to) != ExternalAccount:
        to.balance += decimal.Decimal(transaction.amount)
    await fr.save()
    await to.save()
    transaction.fr = fr.id
    transaction.to = to.id
    transaction = await Transaction.create(**transaction.model_dump())
    return transaction

@app.get(route_prefix+ "/transaction/{transaction_id}")
async def get_transaction(transaction_id: str):
    transaction = await Transaction.get(id=transaction_id)
    return transaction

@app.get(route_prefix+ "/external-account")
async def get_external_accounts():
    return await ExternalAccount.all()

@app.post(route_prefix+ "/external_account")
async def create_external_account(exacc: ExternalAccountCreateDTO ):
    exacc = await ExternalAccount.create(**exacc.model_dump())
    return exacc

@app.delete(route_prefix+ "/external_account/{account_id}")
async def delete_external_account(account_id: str):
    account = await ExternalAccount.filter(id=account_id).delete()
    return {"status": "success"} if account else {"status": "not-found"}


@app.post(route_prefix+ "/account")
async def create_account(account: AccountCreateDTO):
    account = await Account.create(**account.model_dump())
    return account

@app.get(route_prefix+ "/account")
async def get_accounts():
    accounts = await Account.all()
    return accounts

@app.get(route_prefix+ "/account/{account_id}")
async def get_account(account_id: str):
    account = await utils.fetch_account(account_id)
    return account

@app.delete(route_prefix+ "/account/{account_id}")
async def delete_account(account_id: str):
    account = await Account.filter(id=account_id).delete()
    return {"status": "success"} if account else {"status": "not-found"}


@app.get(route_prefix+ "/account/{account_id}/transactions")
async def get_account_transactions(account_id: str):
    account = await Account.filter(id=account_id).first() or await ExternalAccount.filter(id=account_id).first()
    transactions_from = await Transaction.filter(fr=account.id)
    transactions_to = await Transaction.filter(to=account.id)
    transactions = sorted(list(transactions_from) + list(transactions_to), key=lambda x: x.created_at)
    for t in transactions:
        t.fr = await utils.fetch_account(t.fr)
        t.to = await utils.fetch_account(t.to)
    return transactions

health
if (is_production):
    app.mount("/assets", StaticFiles(directory="./dist/assets", html=False), name="assets")
    app.mount("/", SPAStaticFiles(directory="./dist", html=True), name="webapp")
    app.add_middleware(middleware.RewriteMiddleware)