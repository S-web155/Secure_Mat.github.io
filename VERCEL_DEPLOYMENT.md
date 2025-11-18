# SecureMat — Vercel Deployment Guide

## Prerequisites
- GitHub account (free)
- Vercel account (free, sign up at https://vercel.com)
- A MySQL/MariaDB database (local or managed — see options below)
- Node.js 18+ (for local testing)

## Quick Start (5 mins)

### 1. Push code to GitHub
```bash
cd /home/sanchit/projects/securemat-site
git init
git add .
git commit -m "Initial commit: SecureMat with serverless auth"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/securemat-site.git
git push -u origin main
```

### 2. Set up database (pick one option)

**Option A: Keep using your local MySQL (for testing)**
- Ensure MySQL is running locally
- Your Vercel functions will connect to your local DB via a tunnel (not recommended for production)

**Option B: Use a free managed MySQL (recommended)**

Free tier options:
- **PlanetScale** (MySQL-compatible, free tier): https://planetscale.com
  - Sign up → Create DB → Get connection string
  - Example: `mysql://user:pass@region.mysql.planetscale.com/dbname`

- **AWS RDS Free Tier**: https://aws.amazon.com/rds/free/
  - Create MySQL DB, note endpoint and credentials

- **Google Cloud SQL Free**: https://cloud.google.com/sql/pricing (300 free credits)

For this guide, I'll use **PlanetScale** (simplest for serverless).

1. Go to https://planetscale.com, sign up, create a database
2. Click "Connect" and select "Node.js" to get your connection string:
   ```
   mysql://user:password@region.mysql.planetscale.com/securemat_db
   ```
3. Run the database schema:
   ```bash
   mysql -h region.mysql.planetscale.com -u user -p < database/database.sql
   # (when prompted, paste the password from the connection string)
   ```

### 3. Connect GitHub repo to Vercel

1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Select "Import Git Repository"
4. Find and select your `securemat-site` GitHub repo
5. Click "Import"
6. Go to "Settings" → "Environment Variables"
7. Add the following (from your PlanetScale or DB provider):
   - `DB_HOST`: `region.mysql.planetscale.com` (or your DB host)
   - `DB_USER`: Your DB username
   - `DB_PASSWORD`: Your DB password
   - `DB_NAME`: `securemat_db` (or your DB name)
8. Click "Deploy"

Done! Vercel will automatically deploy your site. You'll get a URL like:
```
https://securemat-site.vercel.app
```

### 4. Test the live site
- Visit `https://YOUR_VERCEL_URL/`
- Try signing up at `https://YOUR_VERCEL_URL/signup.html`
- Try logging in at `https://YOUR_VERCEL_URL/login.html`

## Local Testing (optional)

Test locally before deploying:

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file (Vercel dev mode reads this):
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=221183
   DB_NAME=securemat_db
   ```

4. Run local dev server:
   ```bash
   vercel dev
   ```
   Opens at `http://localhost:3000`

5. Stop with Ctrl+C

## Production Checklist

Before sharing your site publicly:
- [ ] Use a strong, unique DB password (not `221183`)
- [ ] Enable HTTPS (Vercel does this automatically)
- [ ] Add server-side rate limiting to prevent brute-force attacks
- [ ] Consider email verification for new signups
- [ ] Use stronger password hashing (bcryptjs is already in the code)
- [ ] Add a Terms of Service and Privacy Policy page
- [ ] Monitor logs: Dashboard → Logs → check for errors
- [ ] Set up a custom domain (optional): Dashboard → Settings → Domains

## Troubleshooting

**Issue: "Cannot find module 'mysql2'"**
- Run `npm install` in the repo directory

**Issue: Database connection error on Vercel**
- Check env vars in Vercel dashboard match your DB credentials
- Ensure your DB allows connections from Vercel (check firewall/IP allowlist)
- If using PlanetScale, make sure you're using the correct connection string format

**Issue: 404 on `/api/signup` or `/api/login`**
- Check `vercel.json` exists and `api/signup.js` and `api/login.js` exist
- Redeploy: `git push` (auto-triggers Vercel redeploy)

**Issue: CORS errors in browser console**
- The serverless functions include CORS headers, but verify `vercel.json` routing is correct

## Next Steps

- Add email verification for signups
- Create a dashboard page for logged-in users
- Add password reset functionality
- Monitor usage and costs (Vercel is free for most small projects)

---

Questions? See:
- Vercel Docs: https://vercel.com/docs
- Serverless Functions: https://vercel.com/docs/concepts/functions/serverless-functions
- MySQL2 Docs: https://github.com/sidorares/node-mysql2
