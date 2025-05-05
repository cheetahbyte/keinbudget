from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
from tortoise.contrib.fastapi import register_tortoise
from app.api.v1.endpoints.router import router as api_router
import os

app = FastAPI()

register_tortoise(
    app,
    db_url="sqlite://db.sqlite3",
    modules={"models": ["app.database.models"]},
    generate_schemas=True,
    add_exception_handlers=True,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/{full_path:path}")
async def spa_handler(full_path: str):
    print(full_path)
    if not full_path.startswith("api/"):
        return FileResponse("/app/server/static/index.html")
    raise HTTPException(status_code=404, detail="Not found")

if os.getenv("ENVIRONMENT") == "production":
    app.mount("/", StaticFiles(directory="/app/server/static", html=True), name="static")




if __name__ == "__main__":
    uvicorn.run("server:app", reload=True)
