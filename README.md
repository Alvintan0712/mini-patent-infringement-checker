# Mini Patent Infringement Checker

This project is a mini patent infringement checker application consisting of a backend API and a frontend interface. The backend is implemented in **Python** using **FastAPI**, and the frontend uses **React** with **Vite** for a responsive, modern user experience. The application also integrates OpenAI for text processing and uses Redis for caching.

## Project Structure

- `patent-infringement-app/`: The frontend application built with React and Vite.
- `patent-infringement-service/`: The backend service built with FastAPI.
- `docker-compose.yml`: Docker Compose file to orchestrate the frontend, backend, and Redis services.

## Prerequisites

- Docker and Docker Compose
- OpenAI API Key (set in `.env` file)

## Installation and Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd mini-patent-infringement-checker
   ```

2. **Environment Variables**:
   Create a `.env` file in the root directory with the following variables:
   ```env
   OPENAI_API_KEY=<your_openai_api_key>
   ```

3. **Docker Compose**:  
   Build and start the containers:
   ```bash
   docker-compose up --build
   ```

   This will start:
   - The backend API on `http://localhost:8000`
   - The frontend app on `http://localhost:3000`
   - Redis for caching on port `6379`

## Frontend

- Located in the `patent-infringement-app` directory.
- **Tech Stack**: React, Vite, TailwindCSS.
- **Scripts**:
  - `npm run dev`: Start the development server.
  - `npm run build`: Build the project for production.
  - `npm run preview`: Preview the production build.

### Frontend Configuration

The frontend connects to the backend using the `VITE_SERVICE_HOST` environment variable, which defaults to `http://localhost:8000`.

## Backend

- Located in the `patent-infringement-service` directory.
- **Tech Stack**: FastAPI, Redis, SQLModel, PyTorch, OpenAI API.
- **Dependencies**:
  - `FastAPI`, `uvicorn` for the API server.
  - `redis` for caching.
  - `torch` and `sentence-transformers` for natural language processing.

### Running Locally

If you want to run the backend outside of Docker, ensure Redis is running and accessible. Then install dependencies and start the server:
```bash
pip install -r patent-infringement-service/requirements.txt
uvicorn patent-infringement-service.app.main:app --reload
```

### Backend Configuration

The backend uses the following environment variables:
- `REDIS_HOST`: Redis host, default is `redis` (as set in Docker Compose).
- `REDIS_PORT`: Redis port, default is `6379`.
- `OPENAI_API_KEY`: OpenAI API key for NLP processing.

## Docker Compose Details

The `docker-compose.yml` file configures the following services:
- **web**: The backend FastAPI service on port `8000`.
- **frontend**: The React frontend on port `3000`.
- **redis**: Redis instance for caching on port `6379`.
