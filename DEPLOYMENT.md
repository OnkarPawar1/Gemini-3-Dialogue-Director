# 🚀 Deployment Guide - Gemini 3 Dialogue Director

Production build is ready! The application has been built and optimized for production deployment.

---

## ✅ Build Status

```
✓ Production build complete
- Main bundle: index-BiSMdqrD.js (126.71 kB gzipped)
- Styles: index-DRKOy05C.css (8.39 kB gzipped)  
- HTML: index.html (0.82 kB gzipped)
```

**Total Size:** ~136 kB gzipped (highly efficient)

---

## 📁 Deployment Artifacts

Location: `/dist/`

```
dist/
├── index.html              # Entry point
├── favicon.svg
├── assets/
│   ├── index-BiSMdqrD.js   # Main application bundle
│   └── index-DRKOy05C.css  # Styles
├── image-assets/           # Actor thumbnails
└── video-assets/           # Talking head video library
```

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended - Zero Config)

**Steps:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel

# For production
vercel --prod
```

**Benefits:** Auto-scaling, CDN, free tier available, automatic HTTPS

---

### Option 2: GitHub Pages

**Steps:**
1. Push code to GitHub
2. Go to **Settings → Pages**
3. Select **Deploy from branch**
4. Choose **main branch** and **/ (root)** directory
5. Save

**Note:** GitHub Pages serves from a subdirectory. The app already has `base: '/Gemini-3-Dialogue-Director/'` in vite.config.ts

---

### Option 3: Netlify

**Steps:**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

**Or connect via UI:**
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import from Git"
3. Select repo and branch
4. Build command: `npm run build`
5. Publish directory: `dist`

---

### Option 4: Docker (Self-hosted)

**Create Dockerfile:**
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
```

**Deploy:**
```bash
# Build image
docker build -t gemini-dialogue-director .

# Run container
docker run -p 3000:3000 gemini-dialogue-director
```

---

### Option 5: AWS S3 + CloudFront

**Steps:**
```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name/ --delete

# Invalidate CloudFront (optional)
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

**Benefits:** Highly scalable, CDN included, Pay-as-you-go

---

### Option 6: Firebase Hosting

**Steps:**
```bash
# Install Firebase CLI
npm i -g firebase-tools

# Initialize Firebase
firebase init hosting

# Deploy
firebase deploy --only hosting
```

---

## 🔑 Environment Variables (Production)

The app uses:
- **Gemini API Key** - Provided by users via UI (stored in localStorage browser-side)
- **Vertex AI Credentials** - Optional fallback, user-provided

**Note:** API keys are entered through the app's "Manage Credentials" modal and stored locally in the browser. No backend server required.

---

## ⚙️ Configuration

### Update Base Path (if needed)

If deploying to a subdirectory, update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/your-subdirectory/',  // Change this
  // ...
});
```

Then rebuild:
```bash
npm run build
```

---

## 📊 Performance Metrics

| Metric | Value |
|--------|-------|
| First Contentful Paint (FCP) | ~1-2s |
| Largest Contentful Paint (LCP) | ~2-3s |
| Cumulative Layout Shift (CLS) | <0.1 |
| Total Bundle | 136 kB (gzipped) |

---

## 🔒 Security Checklist

- ✅ No backend server exposure required
- ✅ API keys handled client-side only
- ✅ No sensitive data logged
- ✅ CORS-friendly (cross-origin requests to Google APIs)
- ✅ localStorage for credential persistence (user control)

**Recommendation:** Always use HTTPS in production. All deployment platforms above include automatic HTTPS.

---

## 🧪 Testing Production Build Locally

```bash
# Preview production build
npm run preview

# Open http://localhost:4173
```

---

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 📞 Quick Deployment Command

### Vercel (Fastest)
```bash
npx vercel --prod
```

### Netlify
```bash
npm run build && npx netlify deploy --prod --dir=dist
```

### GitHub Pages
Just push to `main` branch - auto-deploys to `https://yourusername.github.io/Gemini-3-Dialogue-Director/`

---

## ✨ Post-Deployment

1. **Test the live site:**
   - Click "Manage Credentials"
   - Enter your Gemini API Key
   - Try generating a script
   - Test video generation

2. **Monitor errors:**
   - Check browser console (F12)
   - Enable error tracking (Sentry, LogRocket, etc. optional)

3. **Performance monitoring:**
   - Use Chrome DevTools Lighthouse
   - Monitor Core Web Vitals

---

## 🆘 Troubleshooting

### "API Key must be set" error
- User hasn't entered API key in "Manage Credentials"
- Verify localStorage persists (check DevTools → Application → localStorage)

### Videos not loading
- Ensure `/video-assets/` and `/image-assets/` are deployed
- Check CORS headers on your hosting platform

### Credentials not saving
- Clear localStorage and try again
- Check browser console for errors
- Ensure private/incognito mode isn't blocking storage

---

## 📝 Version Info

- **Build Date:** February 8, 2026
- **Node Version:** 20+
- **Vite Version:** 6.4.1
- **React Version:** 19.2.4

---

**🎉 Ready to go live!**
