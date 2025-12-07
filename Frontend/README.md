# CodeShare Frontend

Modern React frontend for CodeShare - a real-time code snippet sharing platform with TypeScript, Tailwind CSS, and real-time collaboration features.

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- npm or yarn
- Backend server running on `http://localhost:5000`

### Installation

```bash
# Install dependencies
npm install

# Create .env.local file
echo "VITE_API_URL=http://localhost:5000" > .env.local

# Start development server
npm run dev
```

Frontend runs on `http://localhost:8080`

## 📦 Dependencies

### Core
- **react** - UI library
- **react-dom** - React DOM rendering
- **react-router-dom** - Client-side routing
- **typescript** - Type safety

### State & Data
- **@tanstack/react-query** - Data fetching & caching
- **axios** - HTTP client
- **socket.io-client** - Real-time communication

### UI & Styling
- **tailwindcss** - Utility-first CSS
- **framer-motion** - Animations
- **lucide-react** - Icons
- **sonner** - Toast notifications

### Editor
- **@monaco-editor/react** - Code editor

### Build
- **vite** - Build tool
- **@vitejs/plugin-react** - React plugin

## 🔧 Environment Variables

Create a `.env.local` file:

```env
# API Configuration
VITE_API_URL=http://localhost:5000

# Optional: For production
# VITE_API_URL=https://api.codeshare.com
```

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── components/
│   │   ├── ui/                    # Shadcn UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── avatar.tsx
│   │   │   └── ... (more UI components)
│   │   ├── Header.tsx             # Navigation header
│   │   ├── SnippetCard.tsx        # Snippet display card
│   │   ├── SnippetGallery.tsx     # Snippet grid/list
│   │   ├── CodeEditor.tsx         # Monaco editor wrapper
│   │   ├── CommentSection.tsx     # Comments display
│   │   ├── ActivityFeed.tsx       # Activity feed
│   │   ├── HeroSection.tsx        # Landing page hero
│   │   ├── SnippetDetail.tsx      # Snippet detail view
│   │   ├── ProtectedRoute.tsx     # Auth guard
│   │   └── NavLink.tsx            # Navigation link
│   ├── pages/
│   │   ├── Index.tsx              # Home page
│   │   ├── Create.tsx             # Create snippet
│   │   ├── Explore.tsx            # Browse snippets
│   │   ├── SnippetDetail.tsx      # View snippet
│   │   ├── Login.tsx              # Login page
│   │   ├── LoginSuccess.tsx       # OAuth callback
│   │   ├── Register.tsx           # Registration page
│   │   ├── Docs.tsx               # Documentation
│   │   ├── Pricing.tsx            # Pricing page
│   │   └── NotFound.tsx           # 404 page
│   ├── lib/
│   │   ├── api.ts                 # Axios instance
│   │   ├── socket.js              # Socket.io client
│   │   └── utils.ts               # Utility functions
│   ├── hooks/
│   │   ├── use-mobile.tsx         # Mobile detection
│   │   └── use-toast.ts           # Toast hook
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # Entry point
│   ├── index.css                  # Global styles
│   └── vite-env.d.ts              # Vite types
├── public/                        # Static assets
├── index.html                     # HTML template
├── vite.config.ts                 # Vite configuration
├── tailwind.config.ts             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json
└── README.md
```

## 🎨 Key Components

### Header Component
Navigation bar with:
- Logo and branding
- Navigation links (Explore, Docs, Pricing)
- Search functionality
- User authentication status
- Login/Register buttons
- Logout button
- New Snippet button (when logged in)

### SnippetCard Component
Displays individual snippet with:
- Title and language badge
- Code preview (first 3 lines)
- Author information
- Like button with count
- Copy code button
- Link to full snippet

### SnippetGallery Component
Grid/list view of snippets with:
- Search by title/description
- Filter by programming language
- Sort by popularity
- Grid/list view toggle
- Real-time like updates

### CodeEditor Component
Monaco editor with:
- Syntax highlighting
- Multiple language support
- Real-time collaboration
- Line numbers
- Code formatting

### CommentSection Component
Comments display with:
- Comment list
- Add comment form
- Author and timestamp
- Real-time updates

## 🔐 Authentication Flow

### Login with Email/Password
1. User enters email and password
2. Submit to `/api/auth/login`
3. Backend returns JWT token
4. Token stored in localStorage
5. User redirected to home

### Google OAuth
1. User clicks "Login with Google"
2. Redirected to Google consent screen
3. User authorizes app
4. Google redirects to `/login-success?token=xxx`
5. LoginSuccess component:
   - Extracts token from URL
   - Stores token in localStorage
   - Fetches user data
   - Stores user in localStorage
   - Redirects to home
6. Header component reads user data and updates

### Protected Routes
Routes requiring authentication:
- `/create` - Create snippet
- `/snippet/:id` - View snippet (can comment/like)

ProtectedRoute component checks for token and redirects to login if missing.

## 🔄 State Management

### React Query
Used for server state management:
- Caching API responses
- Automatic refetching
- Invalidation on mutations
- Optimistic updates

```typescript
const { data: snippets } = useQuery({
  queryKey: ["snippets"],
  queryFn: async () => (await api.get("/snippets")).data,
});
```

### localStorage
Used for client state:
- JWT token
- User data
- User ID

```typescript
localStorage.setItem("token", token);
localStorage.setItem("user", JSON.stringify(userData));
localStorage.setItem("userId", userId);
```

## 🌐 API Integration

### Axios Instance
```typescript
// lib/api.ts
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

// Automatically adds token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### Usage
```typescript
// GET request
const { data } = await api.get("/snippets");

// POST request
const { data } = await api.post("/snippets", {
  title: "My Snippet",
  content: "code here",
  language: "JavaScript"
});

// PUT request
await api.put(`/snippets/${id}`, { content: "updated" });

// POST with auth
await api.post(`/snippets/${id}/like`);
```

## 🔄 Real-time Features

### Socket.io Connection
```typescript
// lib/socket.js
import io from "socket.io-client";

export const socket = io(import.meta.env.VITE_API_URL);
```

### Real-time Editing
```typescript
// Emit edit event
socket.emit("edit-snippet", {
  snippetId: id,
  content: updatedCode
});

// Listen for updates
socket.on("receive-edit", (data) => {
  if (data.snippetId === id) {
    setCode(data.content);
  }
});
```

## 🎯 Page Routes

| Route | Component | Auth Required | Description |
|-------|-----------|---------------|-------------|
| `/` | Index | No | Home page with featured snippets |
| `/explore` | Explore | No | Browse all snippets |
| `/create` | Create | Yes | Create new snippet |
| `/snippet/:id` | SnippetDetail | No | View snippet details |
| `/login` | Login | No | Login page |
| `/login-success` | LoginSuccess | No | OAuth callback handler |
| `/register` | Register | No | Registration page |
| `/docs` | Docs | No | Documentation |
| `/pricing` | Pricing | No | Pricing page |
| `*` | NotFound | No | 404 page |

## 🎨 Styling

### Tailwind CSS
Utility-first CSS framework for styling:
- Responsive design
- Dark mode support
- Custom color scheme
- Spacing and sizing utilities

### Framer Motion
Animation library for:
- Page transitions
- Component animations
- Hover effects
- Scroll animations

### Custom CSS
Global styles in `index.css`:
- CSS variables for colors
- Custom animations
- Gradient effects
- Responsive utilities

## 📱 Responsive Design

Breakpoints:
- `sm` - 640px
- `md` - 768px
- `lg` - 1024px
- `xl` - 1280px
- `2xl` - 1536px

Mobile-first approach with:
- Responsive grid layouts
- Mobile navigation menu
- Touch-friendly buttons
- Optimized spacing

## 🔍 Search & Filter

### SnippetGallery Features
- **Search**: By title or description
- **Filter**: By programming language
- **Sort**: By popularity (most liked)
- **View**: Grid or list mode

### Explore Page Features
- All gallery features
- Popular snippets filter
- Advanced sorting

## ❤️ Like System

### How It Works
1. User clicks heart icon on snippet
2. API call to `/snippets/:id/like`
3. Backend toggles like in database
4. Response includes updated like count
5. React Query cache invalidated
6. Gallery refetches fresh data
7. Like state updates in UI

### Persistence
- Likes stored in database
- Persists after page reload
- Real-time updates across users

## 💬 Comments

### Features
- Add comments to snippets
- View all comments
- Author and timestamp
- Real-time updates

### Implementation
```typescript
// Fetch comments
const { data: comments } = await api.get(`/comments/${snippetId}`);

// Add comment
const { data: newComment } = await api.post(`/comments/${snippetId}`, {
  text: commentText
});
```

## 🚀 Build & Deployment

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

### Deployment Options

#### Vercel
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm run build
# Deploy dist/ folder to Netlify
```

#### GitHub Pages
```bash
npm run build
# Push dist/ to gh-pages branch
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration works
- [ ] Google OAuth login works
- [ ] Create snippet works
- [ ] Like/unlike snippet works
- [ ] Like persists after reload
- [ ] Comments work
- [ ] Search filters work
- [ ] Real-time editing works
- [ ] Mobile responsive
- [ ] Dark mode works

## 🐛 Common Issues

### API Connection Error
- Ensure backend is running on `http://localhost:5000`
- Check `VITE_API_URL` in `.env.local`
- Check browser console for CORS errors

### Authentication Error
- Clear localStorage and try again
- Check token in browser DevTools
- Verify backend JWT_SECRET

### Real-time Editing Not Working
- Check Socket.io connection in DevTools
- Verify backend Socket.io is running
- Check browser console for errors

### Likes Not Persisting
- Clear browser cache
- Check React Query cache
- Verify backend is saving likes

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React Router Documentation](https://reactrouter.com/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Vite Documentation](https://vitejs.dev/)
- [Socket.io Documentation](https://socket.io/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
1. Check existing GitHub issues
2. Create a new issue with details
3. Include browser console errors
4. Provide steps to reproduce

---

**Made with ❤️ for developers**
