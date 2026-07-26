# YouTube Summarizer

A modern web application that summarizes YouTube videos using AI. Built with React, Express, MongoDB, and JWT authentication.

## Features

- User authentication with JWT tokens
- YouTube video summarization
- Summary history tracking
- MongoDB database for persistent storage
- Beautiful, responsive UI with Tailwind CSS
- Backend API with Express.js

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (icons)
- Axios (HTTP client)
- React Router (navigation)

### Backend
- Express.js
- MongoDB
- Mongoose (ODM)
- JWT (authentication)
- bcryptjs (password hashing)

## Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB (local or Atlas)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Ishaan400/youtube-summarizer.git
cd youtube-summarizer
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your MongoDB connection string and JWT secret.

## Running the Application

### Development Mode (Frontend + Backend)

Run both frontend and backend concurrently:
```bash
npm run dev:all
```

Or run them separately:

```bash
# Terminal 1 - Backend server (http://localhost:5000)
npm run server

# Terminal 2 - Frontend dev server (http://localhost:5173)
npm run dev
```

### Production Build

```bash
npm run build
```

## Project Structure

```
├── src/
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── Dashboard.tsx
│   ├── components/
│   │   └── ProtectedRoute.tsx
│   ├── utils/
│   │   ├── auth.ts
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── server.js          # Express backend
├── package.json
├── vite.config.ts
├── tsconfig.json
└── .env.example
```

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user and get JWT token

### Summarization
- `POST /api/summarize` - Generate summary for YouTube URL (requires auth)
- `GET /api/summaries` - Get all summaries for the user (requires auth)

## Environment Variables

```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/youtube-summarizer

# JWT Secret (change in production)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development
```

## Authentication Flow

1. User registers with email and password
2. Password is hashed using bcryptjs
3. User logs in and receives JWT token
4. Token is stored in localStorage
5. Token is sent with protected API requests
6. Backend verifies token and processes request

## File Structure Breakdown

### Frontend
- **src/App.tsx**: Main app component with routing
- **src/pages/Login.tsx**: Login page with API integration
- **src/pages/Register.tsx**: Registration page
- **src/pages/Dashboard.tsx**: Main dashboard with summarization
- **src/components/ProtectedRoute.tsx**: Route protection wrapper
- **src/utils/auth.ts**: API service functions

### Backend
- **server.js**: Express server with all routes and MongoDB integration

## Future Enhancements

- Real YouTube summarization integration (OpenAI, Cohere, etc.)
- User profile management
- Summary sharing
- Advanced filtering and search
- Rate limiting
- Email verification
- Password reset functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

## Contact

Created by [Ishaan](mailto:ishname200@gmail.com)
