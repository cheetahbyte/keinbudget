from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import RedirectResponse
import os

class RewriteMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next) -> None:
        if not "/api/" in request.url.path and os.getenv("MODE") == "prod":
            if not "/assets/" in request.url.path:
                request.scope["path"] = "/"
        return await call_next(request)