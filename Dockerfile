# Use an official Python runtime as the parent image
FROM python:3.12-slim as builder

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install --upgrade pip \
    && pip install poetry

# Set the working directory in the builder container
WORKDIR /app

# Copy only the requirements file and install dependencies
COPY pyproject.toml poetry.lock /app/

RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# ------------------------------
# Production image starts here
# ------------------------------
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Create a non-root user
RUN useradd --create-home appuser && \
    groupadd -f lp && \
    groupadd -f  -g 121 lpadmin && \
    usermod -aG lp appuser && \
    usermod -aG lpadmin appuser

USER appuser

# Set the working directory in the production container
WORKDIR /home/appuser

# Copy installed dependencies from the builder
COPY --from=builder /usr/local/lib/python3.12/site-packages/ /usr/local/lib/python3.12/site-packages/
COPY --from=builder /usr/local/bin/ /usr/local/bin/

# Copy the content of the local src directory to the working directory
COPY . .

# Specify the command to run on container start
CMD ["python3", "app.py", "--model=QL-800", "--host=0.0.0.0", "--port=8080", "/dev/usb/lp0"]