FROM python:3.12-alpine AS builder

WORKDIR /app

COPY app.py .

FROM python:3.12-alpine

WORKDIR /app

COPY --from=builder /app/app.py .

EXPOSE 8080

CMD ["python", "app.py"]
