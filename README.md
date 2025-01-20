# FrontPage-Backend-Intern-Assignment

A microservices-based system that provides real-time updates for Hacker News stories.

![Architecture](https://github.com/user-attachments/assets/312c8221-3035-4949-aebc-60d030eb3d30)


## Architecture Overview

- **Scraper Service**: Fetches and processes stories from Hacker News API
- **API Gateway**: Handles REST endpoints and initial data loading
- **WebSocket Service**: Manages real-time updates to clients
- **Web Client**: Static interface displaying stories and updates

## Quick Start

1. Clone the repository

2.  Start the services:

`docker-compose up --build`

3.  Access the services:

-   Web Interface: <http://localhost:8081>
-   API Gateway: <http://localhost:3000>
-   WebSocket Service: <ws://localhost:8000>
-   phpMyAdmin: <http://localhost:8080> [username - app_user , password - app_pass]
-   RabbitMQ Management: <http://localhost:15672> [username - guest , password - guest]
