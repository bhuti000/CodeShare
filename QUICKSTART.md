# CodeShare Quick Start Guide

Get CodeShare up and running in 5 minutes! 🚀

## ⚡ 5-Minute Setup

### Prerequisites
- Node.js v16+ installed
- MongoDB running locally (or MongoDB Atlas account)
- Google OAuth credentials (optional for basic testing)

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/codeshare.git
cd codeshare
```

### Step 2: Backend Setup (2 minutes)
```bash
cd Backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/codeshare
JWT_SECRET=dev_secret_key_change_in_production
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
CALLBACK_URL=http://localhost:5000/api/auth/google/callback
EOF

# Start backend
npm start
```

✅ Backend running on `http://localhost:5000`

### Step 3: Frontend Setup (2 minutes)
```bash
cd ../Frontend

# Install dependencies
npm install

# Create .env.local file
echo "VITE_API_URL=http://localhost:5000" > .env.local

# Start frontend
npm run dev
```

✅ Frontend running on `http://localhost:8080`

### Step 4: Test It Out (1 minute)
1. Open `http://localhost:8080` in browser
2. Click "Register" and create an account
3. Create your first snippet
4. Like and comment on snippets
5. Enjoy! 🎉

---

## 🔑 Getting Google OAuth Credentials (Optional)

### Quick Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Secret to `.env`

---

## 📁 Project Structure
```
codeshare/
├── Backend/          # Express.js server
├── Frontend/         # React app
├── README.md         # Full documentation
├── DEPLOYMENT.md     # Deployment guide
└── CONTRIBUTING.md   # Contributing guide
```

---

## 🎯 Common Tasks

### Create a Snippet
1. Click "New Snippet" button
2. Enter title and select language
3. Write code
4. Click "Create"

### Like a Snippet
1. Browse snippets
2. Click heart icon
3. Like count updates instantly

### Search Snippets
1. Use search bar
2. Filter by language
3. Sort by popularity

### Comment on Snippet
1. Click snippet to view details
2. Scroll to comments
3. Type and post comment

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000

# Check MongoDB is running
mongod --version
```

### Frontend won't load
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### API connection error
- Verify backend is running on port 5000
- Check `VITE_API_URL` in `.env.local`
- Check browser console for CORS errors

### MongoDB connection error
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env`
- For Atlas: verify IP whitelist

---

## 📚 Next Steps

1. **Read Full Documentation**
   - [Main README](./README.md)
   - [Backend README](./Backend/README.md)
   - [Frontend README](./Frontend/README.md)

2. **Deploy to Production**
   - See [Deployment Guide](./DEPLOYMENT.md)
   - Choose hosting platform
   - Configure environment variables

3. **Contribute**
   - See [Contributing Guide](./CONTRIBUTING.md)
   - Fork repository
   - Submit pull requests

4. **Customize**
   - Update branding
   - Add custom features
   - Modify styling

---

## 🚀 Deployment Quick Links

- **Backend**: [Heroku](https://www.heroku.com/) | [Railway](https://railway.app/) | [AWS](https://aws.amazon.com/)
- **Frontend**: [Vercel](https://vercel.com/) | [Netlify](https://netlify.com/) | [GitHub Pages](https://pages.github.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## 💡 Tips

- Use `npm run dev` for development with hot reload
- Check browser DevTools for debugging
- Use `npm run build` to create production build
- Read error messages carefully
- Check console logs for debugging

---

## 🆘 Need Help?

1. Check [GitHub Issues](https://github.com/yourusername/codeshare/issues)
2. Read [Full Documentation](./README.md)
3. Create new issue with details
4. Include error messages and steps to reproduce

---

## 🎉 You're All Set!

Start coding and sharing! Happy hacking! 🚀

---

**Questions?** Open an issue on GitHub or check the documentation.
