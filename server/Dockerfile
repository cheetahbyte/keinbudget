FROM golang:alpine as builder
WORKDIR /build
COPY go.mod go.sum ./
RUN go mod download
RUN apk add --no-cache build-base
COPY . .
RUN CGO_ENABLED=1 go build -o main .

FROM alpine:latest
WORKDIR /app
COPY --from=builder /build/main .
COPY docker/Entrypoint.sh .
RUN chmod +x ./Entrypoint.sh
RUN chmod +x /app/main
RUN apk add --no-cache curl
RUN curl -fsSL \
    https://raw.githubusercontent.com/pressly/goose/master/install.sh |\
    sh
EXPOSE 3000
COPY database/migrations ./database/migrations
ENV DB_DRIVER sqlite3
ENV DB_STRING database.db
ENTRYPOINT [ "./Entrypoint.sh" ]