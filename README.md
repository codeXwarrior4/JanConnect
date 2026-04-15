# JanConnect

JanConnect is a Smart City Citizen Management System built for a Webathon.

## Features

- Citizens can report civic issues
- Each issue gets a unique complaint ID
- Issues are geotagged using latitude and longitude
- Issues are stored in MongoDB
- Users can track complaint status using complaint ID
- Admin/staff can update complaint status

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv
- cors

## Project Structure

```bash
JanConnect-dev/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── models/
│   │   └── Issue.js
│   ├── routes/
│   │   └── issueRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── README.md