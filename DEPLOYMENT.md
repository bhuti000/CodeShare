# Deployment Guide for CodeShare

Complete guide to deploy CodeShare to production environments.

## 📋 Pre-Deployment Checklist

- [ ] All tests passing
- [ ] No console errors or warnings
- [ ] Environment variables configured
- [ ] Database backups created
- [ ] SSL certificates ready
- [ ] Domain configured
- [ ] API keys secured

## 🚀 Backend Deployment

### Option 1: Heroku

#### Prerequisites
- Heroku account
- Heroku CLI installed

#### Steps

1. **Create Heroku App**
```bash
cd Backend
heroku create your-app-name
```

2. **Create Procfile**
```bash
echo "web: node server.js" > Procfile
```

3. **Set Environment Variables**
```bash
heroku config:set PORT=5000
heroku config:set MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/codeshare
heroku config:set JWT_SECRET=your_production_secret_key
heroku config:set GOOGLE_CLIENT_ID=your_production_client_id
heroku config:set GOOGLE_CLIENT_SECRET=your_production_client_secret
heroku config:set CALLBACK_URL=https://your-app-name.herokuapp.com/api/auth/google/callback
heroku config:set NODE_ENV=production
```

4. **Deploy**
```bash
git push heroku main
```

5. **View Logs**
```bash
heroku logs --tail
```

### Option 2: Railway

#### Prerequisites
- Railway account
- GitHub repository

#### Steps

1. **Connect Repository**
   - Go to railway.app
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Authorize and select repository

2. **Configure Service**
   - Select Backend directory
   - Add environment variables
   - Set start command: `npm start`

3. **Deploy**
   - Railway automatically deploys on push
   - Monitor deployment in dashboard

### Option 3: DigitalOcean App Platform

#### Prerequisites
- DigitalOcean account
- GitHub repository

#### Steps

1. **Create App**
   - Go to DigitalOcean
   - Click "Create" → "Apps"
   - Connect GitHub repository

2. **Configure**
   - Select Backend directory
   - Set environment variables
   - Configure HTTP routes

3. **Deploy**
   - Click "Deploy"
   - Monitor in dashboard

### Option 4: AWS EC2

#### Prerequisites
- AWS account
- EC2 instance running
- Node.js installed

#### Steps

1. **SSH into Instance**
```bash
ssh -i your-key.pem ec2-user@your-instance-ip
```

2. **Clone Repository**
```bash
git clone https://github.com/yourusername/codeshare.git
cd codeshare/Backend
```

3. **Install Dependencies**
```bash
npm install
```

4. **Create .env File**
```bash
nano .env
# Add all environment variables
```

5. **Install PM2 (Process Manager)**
```bash
npm install -g pm2
```

6. **Start Application**
```bash
pm2 start server.js --name "codeshare-backend"
pm2 startup
pm2 save
```

7. **Configure Nginx (Reverse Proxy)**
```bash
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

8. **Enable SSL with Let's Encrypt**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 🎨 Frontend Deployment

### Option 1: Vercel

#### Prerequisites
- Vercel account
- GitHub repository

#### Steps

1. **Connect Repository**
   - Go to vercel.com
   - Click "New Project"
   - Import GitHub repository

2. **Configure**
   - Select Frontend directory
   - Set environment variables:
     - `VITE_API_URL=https://your-backend-url.com`
   - Set build command: `npm run build`
   - Set output directory: `dist`

3. **Deploy**
   - Click "Deploy"
   - Vercel automatically deploys on push

### Option 2: Netlify

#### Prerequisites
- Netlify account
- GitHub repository

#### Steps

1. **Connect Repository**
   - Go to netlify.com
   - Click "New site from Git"
   - Connect GitHub

2. **Configure**
   - Base directory: `Frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variables:
     - `VITE_API_URL=https://your-backend-url.com`

3. **Deploy**
   - Click "Deploy site"
   - Netlify automatically deploys on push

### Option 3: GitHub Pages

#### Steps

1. **Update vite.config.ts**
```typescript
export default defineConfig({
  base: '/codeshare/',
  // ... rest of config
})
```

2. **Build**
```bash
npm run build
```

3. **Deploy**
```bash
npm install -g gh-pages
gh-pages -d dist
```

### Option 4: AWS S3 + CloudFront

#### Prerequisites
- AWS account
- S3 bucket
- CloudFront distribution

#### Steps

1. **Build Frontend**
```bash
npm run build
```

2. **Upload to S3**
```bash
aws s3 sync dist/ s3://your-bucket-name/
```

3. **Invalidate CloudFront**
```bash
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

## 🔗 Connecting Frontend & Backend

### Update Frontend Environment
```env
VITE_API_URL=https://your-backend-domain.com
```

### Update Backend CORS
```javascript
// server.js
app.use(cors({
  origin: "https://your-frontend-domain.com",
  credentials: true
}));
```

### Update Google OAuth Callback
```env
CALLBACK_URL=https://your-backend-domain.com/api/auth/google/callback
```

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create Account**
   - Go to mongodb.com/cloud/atlas
   - Sign up for free tier

2. **Create Cluster**
   - Click "Create a Deployment"
   - Choose free tier
   - Select region
   - Create cluster

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Set username and password
   - Add to all databases

4. **Get Connection String**
   - Go to "Databases"
   - Click "Connect"
   - Copy connection string
   - Replace `<username>` and `<password>`

5. **Set in Environment**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codeshare?retryWrites=true&w=majority
```

### Self-Hosted MongoDB

1. **Install MongoDB**
```bash
# Ubuntu/Debian
sudo apt-get install -y mongodb

# macOS
brew install mongodb-community
```

2. **Start MongoDB**
```bash
sudo systemctl start mongod
```

3. **Create Database**
```bash
mongo
> use codeshare
> db.createCollection("users")
```

## 🔐 Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database credentials protected
- [ ] API keys not in code
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented

## 📊 Monitoring & Logging

### Backend Monitoring
- Use PM2 Plus for monitoring
- Set up error tracking (Sentry)
- Monitor database performance
- Track API response times

### Frontend Monitoring
- Use Sentry for error tracking
- Monitor Core Web Vitals
- Track user interactions
- Monitor performance metrics

### Logging
```bash
# View logs
heroku logs --tail
pm2 logs
docker logs container-name
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy Backend
        run: |
          cd Backend
          npm install
          npm test
          git push heroku main
      
      - name: Deploy Frontend
        run: |
          cd Frontend
          npm install
          npm run build
          vercel --prod
```

## 🚨 Troubleshooting

### Backend Won't Start
```bash
# Check logs
heroku logs --tail

# Check environment variables
heroku config

# Restart app
heroku restart
```

### Frontend Not Loading
- Check browser console for errors
- Verify API URL in environment
- Check CORS configuration
- Clear browser cache

### Database Connection Error
- Verify connection string
- Check database credentials
- Ensure IP whitelist includes server
- Test connection locally

### OAuth Not Working
- Verify callback URL matches
- Check client ID and secret
- Ensure redirect URI is authorized
- Test in incognito window

## 📈 Performance Optimization

### Backend
- Enable gzip compression
- Use caching headers
- Optimize database queries
- Use CDN for static files

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- Minification

## 🔄 Rollback Procedure

### Heroku
```bash
heroku releases
heroku rollback v123
```

### Railway
- Use deployment history
- Click "Rollback" on previous deployment

### Manual
```bash
git revert <commit-hash>
git push
```

## 📞 Support

For deployment issues:
1. Check logs
2. Review environment variables
3. Verify configurations
4. Check documentation
5. Open GitHub issue

---

**Happy Deploying! 🚀**
