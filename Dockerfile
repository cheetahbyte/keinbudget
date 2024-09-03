FROM docker.io/golang:1.23-alpine as builder
WORKDIR /build
RUN apk add alpine-sdk
RUN go install github.com/pressly/goose/v3/cmd/goose@latest
COPY server/go.mod server/go.sum ./
RUN apk add make
RUN go version
RUN go mod tidy
COPY server/ ./
RUN make build

FROM docker.io/node:alpine as frontend
WORKDIR /build
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install 
COPY frontend/ ./
RUN npm run build

FROM scratch
WORKDIR /app
COPY --from=builder /build/bin/app /app/
COPY --from=frontend /build/dist /app/frontend/
ENV DB_DRIVER="sqlite"
ENV DB_STRING="test.db"
EXPOSE 8080
CMD ["./app"]