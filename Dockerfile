# Stage 1: Build the frontend
FROM node:alpine as builder
WORKDIR /build
COPY ./frontend/package*.json ./
ENV VITE_SERVER_URL_PREFIX=/api/
RUN npm install
COPY ./frontend .
RUN npm run build

# Stage 2: Build the final image
FROM python:alpine
WORKDIR /app
COPY ./server/requirements.txt .
RUN pip install  --upgrade --no-cache-dir -r requirements.txt
COPY ./server .
COPY --from=builder /build/dist /app/static
RUN ls -la
ENV MODE=prod
EXPOSE 7586
CMD ["fastapi", "run", "--proxy-headers", "--port", "7586"]