# SmartUni 

This repository contains a Spring Boot backend and an Angular frontend. This README shows how to initialize git, push to a remote, and deploy locally or via GitHub Actions (Docker Hub).

Quick git setup

1. Initialize repository and push to remote:

```bash
git init
git add .
git commit -m "Initial project import with Docker and CI"
git branch -M main
git remote add origin <your-remote-url>
git push -u origin main
```

GitHub Actions CI

- The workflow `.github/workflows/ci.yml` builds Docker images for `backend` and `frontend` and pushes them to Docker Hub.
- Before using it, set the repository secrets `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`.

Local deployment with docker-compose

```bash
# Build and start services
docker-compose up --build -d

# Stop services
docker-compose down
```

Notes

- The backend image exposes port `8001`; the frontend is served on port `80` by nginx.
- For production you should manage secrets (DB credentials, mail server, etc.) via environment variables or a secrets manager.
