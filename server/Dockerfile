FROM --platform=linux/amd64 python:3.11-alpine as base
WORKDIR /
RUN apk add --no-cache \
    libc-dev \
    build-base \
    libffi-dev \
    openssl-dev \
    git \
    librdkafka-dev \
    && pip install --upgrade pip


FROM --platform=linux/amd64 base as builder
COPY ./req.txt /app/req.txt
RUN pip install --no-cache-dir -r /app/req.txt --default-timeout=100

FROM --platform=linux/amd64 base as final
COPY --from=builder /usr/local /usr/local
COPY ./app /app/
COPY ./main.py /app/main.py
ENV PATH="/usr/local/lib/python3.11/site-packages:${PATH}"
CMD ["gunicorn", "-w", "8", "-k", "uvicorn.workers.UvicornWorker", "app.main:app", "--preload", "-b", "0.0.0.0:8000"]
