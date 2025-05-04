FROM node:23-slim AS frontend-builder
WORKDIR /app/client
COPY client/ ./
ENV VITE_BACKEND_URL=/api/v1
RUN npm install --legacy-peer-deps && npm run build

FROM python:3.13-slim
RUN pip install --no-cache-dir uv
WORKDIR /app
COPY server/pyproject.toml ./pyproject.toml
COPY server/uv.lock ./uv.lock
RUN uv sync --locked
COPY server/ ./server
COPY --from=frontend-builder /app/client/dist ./server/static
WORKDIR /app/server
ENV ENVIRONMENT=production
EXPOSE 8000
CMD ["uv", "run", "uvicorn", "app.server:app", "--host", "0.0.0.0", "--port", "8000"]