# FrontPage-Backend-Intern-Assignment

A microservices-based system that provides real-time updates for Hacker News stories.



https://github.com/user-attachments/assets/32555f1a-4286-419a-a4f0-8aa0a01cab95



## Architecture Overview

- **Scraper Service**: Fetches and processes stories from Hacker News API
- **API Gateway**: Handles REST endpoints and initial data loading
- **WebSocket Service**: Manages real-time updates to clients
- **Web Client**: Static interface displaying stories and updates


![Architecture](https://github.com/user-attachments/assets/312c8221-3035-4949-aebc-60d030eb3d30)


![AF563AB3-FEA1-41A6-9716-F14DFA139A56](https://github.com/user-attachments/assets/0d105d4d-7b74-4170-90da-661619e217c6)


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

## WebSocket Integration Guide

### 1. Initial Connection

First, fetch the WebSocket URL from the API:

```javascript
// Get WebSocket URL and initial stories
const response = await fetch('http://localhost:3000/api/stories/recent');
const data = await response.json();

// Example response format:
{
  success: true,
  data: {
    stories: [...],
    count: 10,
    websocket: {
      url: "ws://localhost:8000",
      protocol: "ws"
    }
  }
}
```

### 2\. Connect to WebSocket

Use the WebSocket URL from the API response:

```
const ws = new WebSocket(data.data.websocket.url);

ws.onopen = () => {
  console.log('Connected to WebSocket');
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  // Example message format:
  // {
  //   type: 'story',
  //   data: {
  //     id: number,
  //     title: string,
  //     url: string,
  //     score: number,
  //     author: string,
  //     published_at: Date
  //   },
  //   timestamp: Date
  // }

  if (message.type === 'story') {
    // Handle new story
    console.log('New story:', message.data);
  }
};

ws.onclose = () => {
  console.log('Disconnected from WebSocket');
  // Implement reconnection logic if needed
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};
```
