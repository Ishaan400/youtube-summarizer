# YouTube Summarizer

[![Next.js](https://img.shields.io/badge/Next.js-15.4-black?logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.3-green?logo=mongodb)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

A modern, full-stack web application that summarizes YouTube videos using AI. Built with **Next.js 15**, **MongoDB**, **TypeScript**, and **JWT authentication**.

## ✨ Features

- 🎥 **YouTube Video Summarization** - Extract key insights from any YouTube video
- 🔐 **Secure Authentication** - JWT-based auth with bcrypt password hashing
- 📝 **Summary History** - View and manage all your generated summaries
- 🗄️ **MongoDB Database** - Persistent data storage with Mongoose ODM
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- ⚡ **Full-Stack** - Backend API routes built into Next.js
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- 🧪 **TypeScript** - Type-safe code throughout the application

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client

### Backend
- **Next.js API Routes** - Serverless functions
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing

## 📋 Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **MongoDB** ([Local](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas))

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Ishaan400/youtube-summarizer.git
cd youtube-summarizer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your configuration:

```env
MONGODB_URI=mongodb://localhost:27017/youtube-summarizer
JWT_SECRET=your_secret_key_here_minimum_32_characters
NODE_ENV=development
```

### 4. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**MongoDB Atlas:**
Use your connection string in `.env.local`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
youtube-summarizer/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/
│   │   │   │   └── route.ts       # User registration endpoint
│   │   │   ├── login/
│   │   │   │   └── route.ts       # User login endpoint
│   │   │   └── verify/
│   │   │       └── route.ts       # Token verification
│   │   └── summarize/
│   │       └── route.ts           # Summarization endpoint
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx           # Login page
│   │   └── register/
│   │       └── page.tsx           # Register page
│   ├── dashboard/
│   │   ├── page.tsx               # Dashboard page
│   │   └── layout.tsx             # Dashboard layout
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   └── globals.css                # Global styles
├── lib/
│   ├── db/
│   │   ├── models/
│   │   │   ├── User.ts            # User Mongoose model
│   │   │   └── Summary.ts         # Summary Mongoose model
│   │   └── connect.ts             # MongoDB connection
│   ├── auth/
│   │   ├── jwt.ts                 # JWT utilities
│   │   └── middleware.ts          # Authentication middleware
│   └── utils/
│       └── validation.ts          # Input validation
├── types/
│   └── index.ts                   # TypeScript type definitions
├── public/
│   └── [static files]
├── .env.example                   # Environment variables template
├── .gitignore
├── next.config.ts                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
├── package.json
└── README.md                      # This file
```

## 🔌 API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  }
}
```

#### Verify Token
```http
GET /api/auth/verify
Authorization: Bearer <token>
```

### Summarization

#### Summarize Video
```http
POST /api/summarize
Authorization: Bearer <token>
Content-Type: application/json

{
  "youtubeUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "language": "English"
}
```

**Response:**
```json
{
  "success": true,
  "summary": "Video summary text...",
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

## 🔐 Authentication Flow

1. **Registration** - User creates account with email & password
2. **Password Hashing** - Password is hashed using bcryptjs (10 salt rounds)
3. **Storage** - User data stored in MongoDB
4. **Login** - User provides credentials
5. **Token Generation** - JWT token created with user ID and email
6. **Client Storage** - Token stored in localStorage
7. **Protected Requests** - Token sent in Authorization header
8. **Verification** - Middleware verifies token on protected routes

## 📚 Key Files Explained

### `/lib/db/connect.ts`
Manages MongoDB connection pooling and initialization.

### `/lib/auth/jwt.ts`
Handles JWT token creation, verification, and decoding.

### `/lib/auth/middleware.ts`
Protects API routes by verifying authentication tokens.

### `/lib/db/models/User.ts`
Defines User schema with email, password, and timestamps.

### `/lib/db/models/Summary.ts`
Defines Summary schema linked to users with URL and summary content.

## 🎯 Error Handling

The application implements comprehensive error handling:

- **Validation Errors** - Input validation on registration/login
- **Database Errors** - Graceful MongoDB error handling
- **Authentication Errors** - Invalid token/credentials
- **Server Errors** - Proper HTTP status codes

## 🧪 Testing Recommendations

### Manual Testing
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on git push

### Deploy to Other Platforms

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔒 Security Best Practices

- ✅ Passwords hashed with bcryptjs
- ✅ JWT tokens with expiration
- ✅ Environment variables for secrets
- ✅ Input validation on all endpoints
- ✅ CORS configuration
- ✅ SQL injection prevention (MongoDB)
- ✅ XSS protection

## 🐛 Troubleshooting

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongosh

# Verify connection string in .env.local
```

### Port 3000 Already in Use
```bash
# Use different port
PORT=3001 npm run dev
```

### Token Verification Failing
- Clear browser localStorage
- Check JWT_SECRET matches between sessions
- Verify token hasn't expired

## 📝 Future Enhancements

- [ ] Real YouTube summarization API integration
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Social authentication (Google, GitHub)
- [ ] Summary sharing and collaboration
- [ ] Advanced analytics
- [ ] Rate limiting
- [ ] Caching layer (Redis)
- [ ] Unit and integration tests
- [ ] CI/CD pipeline

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

## 👤 Author

**Ishaan**
- Email: [ishname200@gmail.com](mailto:ishname200@gmail.com)
- GitHub: [@Ishaan400](https://github.com/Ishaan400)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ using Next.js, MongoDB, and TypeScript**
