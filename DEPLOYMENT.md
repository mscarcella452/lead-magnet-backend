# Deployment Guide

This guide covers deploying your lead magnet backend to production.

## Prerequisites

- MongoDB Atlas account (free tier available)
- Deployment platform account (Vercel, Netlify, Railway, etc.)
- Your client's domain configured

## Option 1: Deploy to Vercel (Recommended)

### 1. Prepare Your Repository

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`

### 3. Set Environment Variables

In Vercel dashboard, add these environment variables:

```env
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/leadmagnet?retryWrites=true&w=majority
ADMIN_PASSWORD=your-secure-production-password
NEXTAUTH_SECRET=generate-a-new-random-secret
CLIENT_ALLOWED_ORIGIN=https://clientdomain.com,https://www.clientdomain.com
CLIENT_API_KEY=generate-a-secure-api-key
NODE_ENV=production
```

**Important Security Notes:**
- Use different passwords/secrets than development
- Never commit `.env` files
- Rotate API keys regularly

### 4. Deploy

Click "Deploy" and wait for build to complete.

### 5. Set Up Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

## Option 2: Deploy to Netlify

### 1. Prepare Repository

Same as Vercel - push to GitHub.

### 2. Import to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select repository

### 3. Configure Build Settings

- **Build command**: `pnpm build`
- **Publish directory**: `.next`
- **Functions directory**: Leave empty (Next.js handles this)

### 4. Set Environment Variables

In Netlify dashboard → Site settings → Environment variables:

Add all the same variables as Vercel (see above).

### 5. Deploy

Netlify will automatically deploy on push to main branch.

## Option 3: Deploy to Railway

### 1. Create Railway Account

Go to [railway.app](https://railway.app) and sign up.

### 2. New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository

### 3. Configure

Railway auto-detects Next.js. Add environment variables in the Variables tab.

### 4. Deploy

Railway automatically deploys and provides a URL.

## MongoDB Atlas Setup

### 1. Create Cluster

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Choose cloud provider and region

### 2. Create Database User

1. Database Access → Add New Database User
2. Choose password authentication
3. Set username and strong password
4. Grant "Read and write to any database" role

### 3. Configure Network Access

1. Network Access → Add IP Address
2. For development: Add your current IP
3. For production: Add `0.0.0.0/0` (allow from anywhere)
   - Note: This is safe because authentication is required

### 4. Get Connection String

1. Clusters → Connect → Connect your application
2. Copy connection string
3. Replace `<password>` with your database user password
4. Replace `<dbname>` with `leadmagnet`

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/leadmagnet?retryWrites=true&w=majority
```

## Post-Deployment Checklist

### 1. Test API Endpoint

```bash
curl -X POST https://your-domain.com/api/health
```

Should return:
```json
{
  "status": "ok",
  "database": "connected"
}
```

### 2. Test Lead Submission

```bash
curl -X POST https://your-domain.com/api/leads \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-production-api-key" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "source": "production-test"
  }'
```

### 3. Test Admin Dashboard

1. Visit `https://your-domain.com/admin/login`
2. Log in with production password
3. Verify dashboard loads
4. Test deleting the test lead

### 4. Update Client Website

Update your client's website to use the production API:

```javascript
// In client website
const response = await fetch('https://your-domain.com/api/leads', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'production-api-key',
  },
  body: JSON.stringify({
    email: userEmail,
    name: userName,
    source: 'landing-page',
  }),
});
```

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | MongoDB connection string | `mongodb+srv://...` |
| `ADMIN_PASSWORD` | Yes | Admin dashboard password | `SecurePass123!` |
| `NEXTAUTH_SECRET` | Yes | Cookie encryption secret | Random 32+ char string |
| `CLIENT_ALLOWED_ORIGIN` | Yes | Allowed CORS origins | `https://client.com` |
| `CLIENT_API_KEY` | Recommended | API authentication key | Random string |
| `EMAIL_SERVICE_API_KEY` | No | Email service API key | When email integrated |
| `EMAIL_FROM_ADDRESS` | No | Sender email address | `leads@yourdomain.com` |
| `LEAD_MAGNET_PDF_URL` | No | PDF download URL | `https://...` |
| `NODE_ENV` | Auto-set | Environment | `production` |

## Monitoring & Maintenance

### Set Up Monitoring

1. **Vercel**: Built-in analytics in dashboard
2. **Uptime Monitoring**: Use services like:
   - UptimeRobot (free)
   - Pingdom
   - StatusCake

Monitor: `https://your-domain.com/api/health`

### Database Backups

MongoDB Atlas provides automatic backups on paid tiers. For free tier:
- Export leads regularly via admin dashboard (CSV)
- Consider upgrading for automatic backups

### Log Monitoring

Check deployment platform logs regularly:
- Vercel: Functions → Logs
- Netlify: Functions → Logs
- Railway: Deployments → Logs

Look for:
- Failed lead submissions
- Authentication attempts
- Database connection issues

## Scaling Considerations

### When to Scale

Monitor these metrics:
- Lead submission rate
- Database size
- Response times
- Error rates

### Scaling Options

1. **Database**: Upgrade MongoDB Atlas tier
2. **Compute**: Most platforms auto-scale
3. **CDN**: Already handled by deployment platforms

## Security Best Practices

1. **Rotate Secrets Regularly**
   - Change `CLIENT_API_KEY` every 3-6 months
   - Update client websites with new key

2. **Monitor Access Logs**
   - Check for suspicious activity
   - Review failed authentication attempts

3. **Keep Dependencies Updated**
   ```bash
   pnpm update
   ```

4. **Enable 2FA**
   - On GitHub
   - On deployment platform
   - On MongoDB Atlas

5. **Backup Strategy**
   - Export leads weekly
   - Store backups securely
   - Test restore process

## Troubleshooting Production Issues

### Database Connection Fails

1. Check `DATABASE_URL` is correct
2. Verify MongoDB Atlas IP whitelist
3. Confirm database user credentials
4. Check network access settings

### CORS Errors

1. Verify `CLIENT_ALLOWED_ORIGIN` includes client domain
2. Check for `www` vs non-`www` variants
3. Ensure HTTPS is used
4. Clear browser cache

### Admin Login Not Working

1. Verify `ADMIN_PASSWORD` environment variable
2. Check `NEXTAUTH_SECRET` is set
3. Clear browser cookies
4. Check deployment logs for errors

### API Returns 500 Errors

1. Check deployment logs
2. Verify all environment variables are set
3. Test database connection
4. Check Prisma client is generated

## Support

For deployment issues:
- Check platform documentation
- Review deployment logs
- Test locally first
- Verify environment variables

---

**Ready to deploy?** Follow the steps above and your lead magnet backend will be live in minutes!
