# JanConnect

JanConnect is a Smart City Citizen Management System built for a Webathon.

## Features

- Citizens can report civic issues
- Each issue gets a unique complaint ID
- Issues are stored in MongoDB
- Users can track complaint status using complaint ID
- Admin can update issue status

## Backend Tech Stack

- Node.js
- Express.js
- MongoDB Atlas / MongoDB
- Mongoose
- dotenv
- cors

## Project Structure

```bash
server/
├── models/
│   └── Issue.js
├── routes/
│   └── issueRoutes.js
├── .env
├── .env.example
├── package.json
└── server.js