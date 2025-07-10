FROM golang:latest AS builder
WORKDIR /build
COPY ./ ./
RUN go mod download
RUN CGO_ENABLED=0 go build -o ./main cmd/api/main.go


FROM scratch
WORKDIR /app
COPY --from=builder /build/main ./main
EXPOSE 80
ENTRYPOINT ["./main"]