# Assignment 11 - Multi-Tier Application Frontend

## Overview

This repository contains the React frontend service for Assignment 11.

The frontend retrieves user information from the Flask backend API and displays the users in a web interface.

Nginx is used as the production web server and reverse proxy. Requests to `/api/` are forwarded to the backend service.

### Technologies Used

* React 19
* Vite
* Node.js
* Jest
* React Testing Library
* Nginx
* Docker
* Docker Compose
* GitHub Actions
* Docker Hub
* Self-hosted GitHub Actions runner on a Vagrant VM

## Project Structure

```text
frontend/
├── .github/
│   └── workflows/
│       └── frontend.yml
├── src/
│   ├── __tests__/
│   │   └── App.test.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   └── setupTests.js
├── babel.config.js
├── docker-compose.yml
├── Dockerfile
├── index.html
├── jest.config.js
├── nginx.conf
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## Frontend Application

The React application requests user data from:

```text
/api/users
```

The frontend uses the same-origin API path so that Nginx can reverse proxy the request to the Flask backend.

The production request flow is:

```text
Browser
   |
   | HTTP :3000
   v
Nginx Frontend
   |
   | /api/*
   v
Flask Backend :5000
   |
   v
MySQL :3306
```

## Run Tests Locally

Install the Node.js dependencies:

```bash
npm ci
```

Run the Jest test suite:

```bash
npm test
```

The tests verify that:

* Users returned by the backend API are displayed.
* API errors are handled correctly.

The API request is mocked during testing, so the tests do not require the backend or MySQL database to be running.

## Run Frontend in Development

Install dependencies:

```bash
npm ci
```

Start the Vite development server:

```bash
npm run dev
```

The development server will normally be available at:

```text
http://localhost:5173
```

## Build the Frontend

Create a production build:

```bash
npm run build
```

The generated production files are placed in:

```text
dist/
```

## Docker

The frontend uses a multi-stage Dockerfile.

The first stage uses Node.js to install dependencies and build the React application.

The second stage uses Nginx to serve the generated production files.

### Build Docker Image

```bash
docker build -t codeykenny/frontend-repo:local .
```

### Run Docker Container

```bash
docker run -d \
  --name assignment11-frontend \
  -p 3000:80 \
  codeykenny/frontend-repo:local
```

The frontend can then be accessed at:

```text
http://localhost:3000
```

## Docker Compose

The production frontend Compose configuration uses the Docker image published to Docker Hub.

Start the frontend:

```bash
docker compose up -d
```

Check the container:

```bash
docker compose ps
```

Stop the frontend:

```bash
docker compose down
```

The frontend container listens on port `80` internally and is exposed on port `3000` on the host.

## Nginx Reverse Proxy

The Nginx configuration serves the React application and forwards backend API requests.

Requests matching:

```text
/api/*
```

are proxied to:

```text
http://assignment11-backend:5000
```

The frontend and backend communicate through the shared Docker network:

```text
backend-repo_default
```

This allows the frontend to communicate with the backend using the Docker service/container name rather than exposing the backend directly to the browser.

## Docker Image

The frontend Docker image is published to Docker Hub:

```text
codeykenny/frontend-repo
```

The GitHub Actions workflow publishes three image tags:

```text
latest
<commit-sha>
<build-number>
```

## GitHub Actions CI/CD

The frontend workflow is located at:

```text
.github/workflows/frontend.yml
```

The workflow contains three stages:

### 1. Test

The workflow:

1. Checks out the repository.
2. Sets up Node.js.
3. Installs dependencies using `npm ci`.
4. Runs the Jest test suite.

### 2. Build

After the tests pass, GitHub Actions:

1. Sets up Docker Buildx.
2. Logs in to Docker Hub.
3. Builds the frontend Docker image.
4. Pushes the image to Docker Hub.

The image is published with:

```text
latest
commit SHA
GitHub Actions build number
```

### 3. Deploy

After the build succeeds, the deployment runs on a self-hosted GitHub Actions runner hosted inside a Vagrant VM.

The deployment:

1. Checks out the repository.
2. Logs in to Docker Hub.
3. Pulls the frontend Docker image.
4. Starts the frontend using Docker Compose.
5. Verifies the frontend service.

The deployment uses:

```text
runs-on: self-hosted
```

## CI/CD Flow

```text
Git Push
   |
   v
Test
   |
   | npm ci
   | npm test
   v
Build
   |
   | Docker Buildx
   | Push to Docker Hub
   v
Deploy
   |
   | Self-hosted Vagrant Runner
   | docker compose pull
   | docker compose up -d
   v
Running Frontend
```

## Application Architecture

```text
                 Browser
                    |
                    | :3000
                    v
             Frontend Nginx
                    |
              /api/* requests
                    |
                    v
             Flask Backend
                  :5000
                    |
                    v
                 MySQL
                  :3306
```

## Repository

GitHub repository:

https://github.com/sujanpakhrin/frontend-repo

