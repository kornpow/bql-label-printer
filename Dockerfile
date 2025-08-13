# Use Debian bookworm-slim as the base image
FROM debian:bookworm-slim AS builder

# Set environment variables
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        gcc \
        libpq-dev \
        build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install uv
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin:$PATH"

# Install Python using uv
RUN uv python install 3.11

# Set the working directory in the builder container
WORKDIR /app

# Copy dependency files
COPY pyproject.toml uv.lock /app/

# Use uv sync to validate dependencies and cache downloads
RUN uv sync --frozen --no-dev

# ------------------------------
# Production image starts here  
# ------------------------------
FROM debian:bookworm-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install runtime dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user first
RUN useradd --create-home appuser

# Switch to appuser before installing uv and Python
USER appuser

# Install uv as appuser
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/home/appuser/.local/bin:$PATH"

# Install Python using uv as appuser
RUN uv python install 3.11

# Set the working directory in the production container
WORKDIR /home/appuser

# Copy dependency files from builder
COPY --chown=appuser:appuser pyproject.toml uv.lock ./

# Use uv sync to create virtual environment and install dependencies as appuser
RUN uv sync --frozen --no-dev

# Make sure the virtual environment is in PATH
ENV PATH="/home/appuser/.venv/bin:$PATH"

# Copy the content of the local src directory to the working directory  
COPY --chown=appuser:appuser . .

# Specify the command to run on container start
CMD ["/home/appuser/.venv/bin/python", "app.py", "--host=0.0.0.0", "--port=8080"]
