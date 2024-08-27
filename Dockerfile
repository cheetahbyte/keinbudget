FROM golang:1.23-alpine as builder
WORKDIR /build
RUN go install github.com/pressly/goose/v3/cmd/goose@latest
COPY server/go.mod server/go.sum ./
RUN apk add make
RUN go version
RUN go mod tidy
COPY server/ ./
RUN make build

