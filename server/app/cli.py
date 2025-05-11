from typing import Annotated
from tortoise import Tortoise
import typer
import subprocess
from app.api.v1.endpoints.users import crud
import asyncio
from contextlib import asynccontextmanager


@asynccontextmanager
async def orm():
    await Tortoise.init(
        db_url="sqlite://db.sqlite3",
        modules={"models": ["app.database.models"]},
    )
    await Tortoise.generate_schemas()
    try:
        yield
    finally:
        await Tortoise.close_connections()


cli = typer.Typer()
users_app = typer.Typer()


@users_app.command()
def create(email: str, password: str, first_name: str, last_name: str):
    async def _run():
        async with orm():
            await crud.create_user(
                {
                    "email": email,
                    "password": password,
                    "first_name": first_name,
                    "last_name": last_name,
                }
            )
            print("Created user!")

    asyncio.run(_run())


@cli.command()
def run(
    port: Annotated[int, typer.Option(help="port for the application")] = 8000,
    host: Annotated[str, typer.Option(help="host for the application")] = "0.0.0.0",
    reload: Annotated[bool, typer.Option(help="hot-reload the app")] = True,
):
    """start application"""
    subprocess.run(
        [
            "uvicorn",
            "app.server:app",
            "--host",
            host,
            "--port",
            str(port),
            "--reload" if reload else None,
        ]
    )


cli.add_typer(users_app, name="users", help="control the user related api")

if __name__ == "__main__":
    cli()
