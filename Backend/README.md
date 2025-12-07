# CodeShare Backend

Express.js backend server for CodeShare - a real-time code snippet sharing platform with MongoDB, JWT authentication, and Google OAuth integration.

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)
- Google OAuth credentials

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start server
npm start
```

Server runs on `http://localhost:5000`

## 📦 Dependencies

```json
{
  "express": "^4.18.2",
  "mongoose": "^7.0.0",
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.3",
  "passport": "^0.6.0",
  "passport-google-oauth20": "^2.0.0",
  "cors": "^2.8.5",
  "dotenv": "^16.0.3",
  "socket.io": "^4.5.4"
}
```

## 🔧 Environment Variables

Create a `.env` file in the Backend directory:

```env
# Server
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/codeshare
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codeshare

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_chars

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Environment
NODE_ENV=development
```

## 📁 Project Structure

```
Backend/
├── config/
│   ├── db.js                 # MongoDB connection
│   └── googleAuth.js         # Google OAuth configuration
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── snippetController.js  # Snippet CRUD & likes
│   └── commentController.js  # Comment management
├── middleware/
│   ├── authMiddleware.js     # JWT verification
│   └── googleStrategy.js     # Passport Google strategy
├── models/
│   ├── User.js               # User schema
│   ├── Snippet.js            # Snippet schema
│   └── Comment.js            # Comment schema
├── routes/
│   ├── authRoutes.js         # Auth endpoints
│   ├── snippetRoutes.js      # Snippet endpoints
│   ├── commentRoutes.js      # Comment endpoints
│   └── googleAuthRoutes.js   # Google OAuth endpoints
├── server.js                 # Express app & Socket.io
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: 200 OK
{
  "message": "Registered successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: 200 OK
{
  "message": "Logged in",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Get User by ID
```http
GET /api/auth/user/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "editor",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### Google OAuth Login
```http
GET /api/auth/google

# Redirects to Google login page
```

#### Google OAuth Callback
```http
GET /api/auth/google/callback?code=...

# Redirects to frontend with token:
# http://localhost:8080/login-success?token=eyJhbGciOiJIUzI1NiIs...
```

### Snippet Routes (`/api/snippets`)

#### Get All Snippets
```http
GET /api/snippets

Response: 200 OK
[
  {
    "_id": "snippet_id",
    "title": "Hello World",
    "content": "console.log('Hello');",
    "language": "JavaScript",
    "author": {
      "_id": "user_id",
      "name": "John Doe"
    },
    "likes": ["user_id_1", "user_id_2"],
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

#### Get Popular Snippets
```http
GET /api/snippets/popular

Response: 200 OK
# Returns snippets sorted by likes (descending)
```

#### Get Snippet by ID
```http
GET /api/snippets/:id

Response: 200 OK
{
  "_id": "snippet_id",
  "title": "Hello World",
  "content": "console.log('Hello');",
  "language": "JavaScript",
  "author": { ... },
  "likes": [...],
  "versions": [...]
}
```

#### Create Snippet
```http
POST /api/snippets
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Hello World",
  "content": "console.log('Hello');",
  "language": "JavaScript"
}

Response: 201 Created
{
  "_id": "snippet_id",
  "title": "Hello World",
  "content": "console.log('Hello');",
  "language": "JavaScript",
  "author": "user_id",
  "likes": [],
  "versions": [...]
}
```

#### Update Snippet
```http
PUT /api/snippets/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "console.log('Updated');"
}

Response: 200 OK
{
  "_id": "snippet_id",
  "title": "Hello World",
  "content": "console.log('Updated');",
  "versions": [...]
}
```

#### Like/Unlike Snippet
```http
POST /api/snippets/:id/like
Authorization: Bearer <token>

Response: 200 OK
{
  "liked": true,
  "likesCount": 5,
  "likes": ["user_id_1", "user_id_2", ...],
  "snippetId": "snippet_id"
}
```

### Comment Routes (`/api/comments`)

#### Get Comments for Snippet
```http
GET /api/comments/:snippetId

Response: 200 OK
[
  {
    "_id": "comment_id",
    "text": "Great snippet!",
    "author": {
      "_id": "user_id",
      "name": "Jane Doe"
    },
    "snippet": "snippet_id",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

#### Add Comment
```http
POST /api/comments/:snippetId
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Great snippet!"
}

Response: 201 Created
{
  "_id": "comment_id",
  "text": "Great snippet!",
  "author": { ... },
  "snippet": "snippet_id",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## 🔐 Authentication

### JWT Token
- Generated on login/registration
- Stored in frontend localStorage
- Sent in `Authorization: Bearer <token>` header
- Verified using `JWT_SECRET`
- Expires in 7 days

### Protected Routes
Routes requiring authentication use the `protect` middleware:

```javascript
router.post("/", protect, createSnippet);
```

The middleware:
1. Extracts token from Authorization header
2. Verifies token signature
3. Loads full user from database
4. Attaches user to `req.user`

### Google OAuth
1. User clicks "Login with Google"
2. Redirected to Google consent screen
3. User authorizes app
4. Google redirects to callback URL with auth code
5. Backend exchanges code for user info
6. User created/updated in database
7. JWT token generated
8. Frontend redirected with token in URL

## 📊 Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique, lowercase, trimmed),
  password: String (hashed with bcrypt),
  role: String (default: "editor"),
  createdAt: Date,
  updatedAt: Date
}
```

### Snippet Model
```javascript
{
  title: String,
  content: String,
  language: String,
  author: ObjectId (ref: User),
  likes: [ObjectId] (ref: User),
  versions: [{
    content: String,
    timestamp: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Model
```javascript
{
  text: String,
  author: ObjectId (ref: User),
  snippet: ObjectId (ref: Snippet),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔄 Real-time Features (Socket.io)

### Events

#### Emit: `edit-snippet`
```javascript
socket.emit("edit-snippet", {
  snippetId: "snippet_id",
  content: "updated code"
});
```

#### Listen: `receive-edit`
```javascript
socket.on("receive-edit", (data) => {
  // data.snippetId
  // data.content
});
```

## 🛡️ Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ CORS enabled for frontend
- ✅ Protected routes with middleware
- ✅ Google OAuth 2.0
- ✅ Cache-control headers
- ✅ Input validation

## 🐛 Error Handling

All endpoints return appropriate HTTP status codes:

- `200 OK` - Successful request
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing/invalid token
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

Error response format:
```json
{
  "message": "Error description",
  "error": "error details"
}
```

## 📝 Logging

Console logs for debugging:
- ✅ User authentication events
- ✅ Snippet operations (create, like, update)
- ✅ Comment operations
- ✅ Socket.io connections
- ✅ Database errors

## 🚀 Deployment

### Heroku
```bash
# Create Procfile
echo "web: node server.js" > Procfile

# Deploy
git push heroku main
```

### Railway
```bash
# Connect GitHub repo
# Set environment variables
# Deploy automatically
```

### Environment Variables for Production
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/codeshare
JWT_SECRET=very_long_random_secret_key_min_32_chars
GOOGLE_CLIENT_ID=your_production_client_id
GOOGLE_CLIENT_SECRET=your_production_client_secret
CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
NODE_ENV=production
```

## 🧪 Testing

### Test User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Create Snippet
```bash
curl -X POST http://localhost:5000/api/snippets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Snippet",
    "content": "console.log(\"test\");",
    "language": "JavaScript"
  }'
```

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT Documentation](https://jwt.io/)
- [Passport.js Documentation](https://www.passportjs.org/)
- [Socket.io Documentation](https://socket.io/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify network access (for Atlas)

### Google OAuth Error
- Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- Check CALLBACK_URL matches Google Console
- Ensure frontend redirects to correct URL

### JWT Token Error
- Verify JWT_SECRET is set
- Check token format in Authorization header
- Ensure token hasn't expired

### CORS Error
- Verify frontend URL in CORS config
- Check request headers
- Ensure credentials are included if needed

---

**Made with ❤️ for developers**
