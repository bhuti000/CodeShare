# CodeShare - Real-time Code Snippet Sharing Platform

A modern, collaborative code snippet sharing platform built with React, Node.js, and MongoDB. Share, discover, and collaborate on code snippets in real-time with syntax highlighting, comments, and likes.

## 🌟 Features

### Core Features
- **🔐 Authentication**
  - Google OAuth 2.0 integration
  - JWT-based authentication
  - Secure token management

- **📝 Snippet Management**
  - Create, read, update, and delete code snippets
  - Support for multiple programming languages
  - Syntax highlighting with Monaco Editor
  - Version history tracking

- **❤️ Social Features**
  - Like/unlike snippets
  - Comment on snippets
  - Real-time activity feed
  - User profiles

- **🔄 Real-time Collaboration**
  - Live code editing with WebSocket
  - Real-time updates across multiple users
  - Instant synchronization

- **🔍 Discovery**
  - Search snippets by title or description
  - Filter by programming language
  - Sort by popularity (most liked)
  - Grid and list view modes

- **📱 Responsive Design**
  - Mobile-friendly interface
  - Tailwind CSS styling
  - Smooth animations with Framer Motion

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Query** - Data fetching & caching
- **Monaco Editor** - Code editor
- **Framer Motion** - Animations
- **Socket.io Client** - Real-time communication
- **Sonner** - Toast notifications

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Passport.js** - OAuth strategy
- **Socket.io** - Real-time communication
- **CORS** - Cross-origin requests

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Google OAuth credentials

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/codeshare.git
cd codeshare
```

### 2. Backend Setup

```bash
cd Backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/codeshare
JWT_SECRET=your_jwt_secret_key_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CALLBACK_URL=http://localhost:5000/api/auth/google/callback
EOF

# Start the backend server
npm start
```

### 3. Frontend Setup

```bash
cd Frontend

# Install dependencies
npm install

# Create .env file
cat > .env.local << EOF
VITE_API_URL=http://localhost:5000
EOF

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:8080`

## 🔑 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/codeshare
JWT_SECRET=your_super_secret_jwt_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/user/:id` - Get user by ID

### Snippets
- `GET /api/snippets` - Get all snippets
- `GET /api/snippets/popular` - Get popular snippets (sorted by likes)
- `GET /api/snippets/:id` - Get snippet by ID
- `POST /api/snippets` - Create new snippet (protected)
- `PUT /api/snippets/:id` - Update snippet (protected)
- `POST /api/snippets/:id/like` - Like/unlike snippet (protected)

### Comments
- `GET /api/comments/:snippetId` - Get comments for snippet
- `POST /api/comments/:snippetId` - Add comment (protected)

## 🗂️ Project Structure

```
codeshare/
├── Backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── googleAuth.js      # Google OAuth config
│   ├── controllers/
│   │   ├── authController.js  # Auth logic
│   │   ├── snippetController.js
│   │   └── commentController.js
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT verification
│   │   └── googleStrategy.js  # Passport strategy
│   ├── models/
│   │   ├── User.js
│   │   ├── Snippet.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ���── snippetRoutes.js
│   │   ├── commentRoutes.js
│   │   └── googleAuthRoutes.js
│   ├── server.js              # Express app
│   └── package.json
│
└── Frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Header.tsx
    │   │   ├── SnippetCard.tsx
    │   │   ├── SnippetGallery.tsx
    │   │   ├── CodeEditor.tsx
    │   │   ├── CommentSection.tsx
    │   │   └── ui/              # UI components
    │   ├── pages/
    │   │   ├── Index.tsx
    │   │   ├── Create.tsx
    │   │   ├── Explore.tsx
    │   │   ├── SnippetDetail.tsx
    │   │   ├── Login.tsx
    │   │   ├── LoginSuccess.tsx
    │   │   └── Register.tsx
    │   ├── lib/
    │   │   ├── api.ts           # Axios instance
    │   │   └── socket.js        # Socket.io client
    │   ├── App.tsx
    │   └── main.tsx
    ├── index.html
    ├── vite.config.ts
    └── package.json
```

## 🔐 Authentication Flow

### Google OAuth
1. User clicks "Login with Google"
2. Redirected to Google login page
3. User authorizes the app
4. Google redirects to callback URL with auth code
5. Backend exchanges code for user info
6. Backend creates/updates user in database
7. JWT token generated and sent to frontend
8. Frontend stores token in localStorage
9. User redirected to home page

### JWT Token
- Stored in localStorage
- Sent in Authorization header for protected routes
- Verified on backend using JWT_SECRET
- Expires in 7 days

## 🎯 Key Features Explained

### Real-time Editing
- Uses Socket.io for WebSocket connection
- When user edits code, changes broadcast to all connected users
- Instant synchronization without page reload

### Like System
- Users can like/unlike snippets
- Likes are stored in database
- Like count displayed on snippet cards
- Persists after page reload

### Comments
- Users can comment on snippets
- Comments are threaded and timestamped
- Real-time comment updates

### Search & Filter
- Search by snippet title or description
- Filter by programming language
- Sort by popularity (most liked)
- Responsive grid/list view

## 🐛 Bug Fixes & Improvements

### Recent Fixes
- ✅ Fixed Google OAuth user data not updating in header
- ✅ Fixed likes not persisting after page reload
- ✅ Added cache-control headers to prevent stale data
- ✅ Improved error handling and logging
- ✅ Added React Query cache invalidation for likes

## 📝 Usage Examples

### Create a Snippet
1. Click "New Snippet" button
2. Enter title, select language
3. Write or paste code
4. Click "Create"

### Like a Snippet
1. Browse snippets on home or explore page
2. Click heart icon on snippet card
3. Like count updates instantly
4. Like persists after page reload

### Comment on Snippet
1. Click on snippet to view details
2. Scroll to comments section
3. Type comment and click "Post"
4. Comment appears instantly

### Search Snippets
1. Use search bar to find snippets by title
2. Filter by programming language
3. Sort by popularity
4. Switch between grid and list view

## 🚀 Deployment

### Backend (Heroku/Railway)
```bash
# Add Procfile
echo "web: node server.js" > Procfile

# Deploy
git push heroku main
```

### Frontend (Vercel/Netlify)
```bash
# Build
npm run build

# Deploy
vercel deploy
```

## 📊 Database Schema

### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (default: "editor"),
  createdAt: Date,
  updatedAt: Date
}
```

### Snippet
```javascript
{
  _id: ObjectId,
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

### Comment
```javascript
{
  _id: ObjectId,
  text: String,
  author: ObjectId (ref: User),
  snippet: ObjectId (ref: Snippet),
  createdAt: Date,
  updatedAt: Date
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋 Support

For support, email support@codeshare.com or open an issue on GitHub.

## 🎉 Acknowledgments

- React community for amazing libraries
- MongoDB for reliable database
- Google for OAuth integration
- All contributors and users

---

**Made with ❤️ for developers**
