# Patent Infringement Checker Application Documentation

## Overview

This is a FastAPI application designed to run in a Docker container. The application uses `docker-compose` for easy deployment and can be quickly set up and managed with a few simple commands.

## Prerequisites

- **Docker**: Ensure Docker is installed and running on your machine.
- **Docker Compose**: This application uses `docker-compose` for managing containers.

## Project Structure

```plaintext
.
├── Dockerfile                # Docker configuration for the FastAPI app
├── docker-compose.yml        # Docker Compose configuration
├── requirements.txt          # Python dependencies
└── app/                      # Application code (including main.py and other modules)
```

### Dockerfile

The `Dockerfile` sets up the environment, installs dependencies, and runs the FastAPI application with Uvicorn.

### docker-compose.yml

The `docker-compose.yml` file orchestrates the containerized services, allowing you to start the application with a single command.

### requirements.txt

This file lists the dependencies for the FastAPI application:
- `fastapi[standard]`
- `uvicorn[standard]` 

## Getting Started

### Step 1: Build the Docker Image

First, build the Docker image for the FastAPI application:

```bash
docker-compose build
```

### Step 2: Start the Application

After building, you can start the application using:

```bash
docker-compose up
```

This command will start the FastAPI application, making it accessible at `http://localhost:8000` (or a different port if specified in the Docker Compose file).

### Step 3: Access the API Documentation

FastAPI provides interactive API documentation at the following endpoints:

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Managing Containers

- **Stop the application**: Use `Ctrl+C` in the terminal where `docker-compose up` is running, or run `docker-compose down` to stop and remove containers.
- **Rebuild the application**: If you make changes to dependencies or the Dockerfile, run `docker-compose build` again to rebuild the image.
