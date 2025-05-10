from fastapi import FastAPI, HTTPException, Request
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

if os.getenv("ENVIRONMENT") == "production":
    app.mount(
        "/assets", StaticFiles(directory="/app/server/static/assets"), name="assets"
    )

    @app.api_route("/{full_path:path}", methods=["GET"])
    async def serve_spa(request: Request, full_path: str):
        # Blockiere alles, was wie API aussieht
        if request.url.path.startswith("/api/"):
            raise HTTPException(status_code=404, detail="Not Found")

        static_path = f"/app/server/static/{full_path}"
        if os.path.exists(static_path) and os.path.isfile(static_path):
            return FileResponse(static_path)

        return FileResponse("/app/server/static/index.html")


@app.get("/health")
async def health_check():
    return {"ok": 1}


if __name__ == "__main__":
    uvicorn.run("server:app", reload=True)
