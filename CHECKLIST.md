# Setup Checklist

Use this checklist to ensure everything is configured correctly.

## Initial Setup

### 1. Environment Configuration
- [ ] Copy `.env.example` to `.env`
- [ ] Set `DATABASE_URL` with MongoDB connection string
- [ ] Set `ADMIN_PASSWORD` (use a strong password)
- [ ] Generate and set `NEXTAUTH_SECRET` (random 32+ characters)
- [ ] Set `CLIENT_ALLOWED_ORIGIN` with client domain(s)
- [ ] Set `CLIENT_API_KEY` (optional but recommended)

### 2. Database Setup
- [ ] Create MongoDB Atlas account (if needed)
- [ ] Create new cluster
- [ ] Create database user with read/write permissions
- [ ] Configure network access (whitelist IP)
- [ ] Get connection string
- [ ] Run `pnpm prisma:generate`
- [ ] Run `pnpm prisma:push`

### 3. Local Development
- [ ] Run `pnpm install`
- [ ] Run `pnpm dev`
- [ ] Visit http://localhost:3000
- [ ] Test health check: http://localhost:3000/api/health

### 4. Test Admin Dashboard
- [ ] Go to http://localhost:3000/admin/login
- [ ] Login with `ADMIN_PASSWORD`
- [ ] Verify dashboard loads
- [ ] Check stats cards display
- [ ] Verify lead table is empty

### 5. Test API Endpoint
- [ ] Use cURL or Postman to submit test lead:
```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "source": "test"
  }'
```
- [ ] Verify lead appears in admin dashboard
- [ ] Test delete functionality
- [ ] Test CSV export

## Pre-Deployment Checklist

### Security
- [ ] Strong `ADMIN_PASSWORD` set (12+ characters)
- [ ] Unique `NEXTAUTH_SECRET` generated
- [ ] `CLIENT_API_KEY` is random and secure
- [ ] `.env` file is in `.gitignore`
- [ ] No secrets committed to git

### Configuration
- [ ] Production `DATABASE_URL` configured
- [ ] `CLIENT_ALLOWED_ORIGIN` set to production domain(s)
- [ ] `NODE_ENV` will be set to "production" by platform
- [ ] Email configuration ready (if using)

### Testing
- [ ] All API endpoints tested locally
- [ ] Admin dashboard fully functional
- [ ] CORS working with client domain
- [ ] Error handling tested
- [ ] Mobile responsive checked

## Deployment Checklist

### Platform Setup (Vercel/Netlify/Railway)
- [ ] Repository pushed to GitHub
- [ ] Project imported to deployment platform
- [ ] Build command: `pnpm build`
- [ ] Install command: `pnpm install`

### Environment Variables (Production)
- [ ] `DATABASE_URL` set
- [ ] `ADMIN_PASSWORD` set (different from dev)
- [ ] `NEXTAUTH_SECRET` set (different from dev)
- [ ] `CLIENT_ALLOWED_ORIGIN` set
- [ ] `CLIENT_API_KEY` set (different from dev)
- [ ] `NODE_ENV` set to "production"

### Post-Deployment
- [ ] Deployment successful
- [ ] Visit production URL
- [ ] Test `/api/health` endpoint
- [ ] Test admin login
- [ ] Submit test lead via API
- [ ] Verify lead in dashboard
- [ ] Test from client website (if ready)

## Client Integration Checklist

### Backend Configuration
- [ ] Production URL shared with client
- [ ] API key shared securely
- [ ] CORS configured for client domain
- [ ] API documentation provided

### Client Website
- [ ] Form created on client site
- [ ] API endpoint configured
- [ ] API key added to environment variables
- [ ] Success/error messages implemented
- [ ] Form validation added
- [ ] Mobile responsive
- [ ] Loading states implemented

### Testing
- [ ] Form submits successfully
- [ ] Lead appears in dashboard
- [ ] Success message displays
- [ ] Error handling works
- [ ] CORS headers correct
- [ ] Email delivery working (if configured)

## Email Integration Checklist (Optional)

### Service Setup
- [ ] Email service chosen (Resend/SendGrid/Nodemailer)
- [ ] Account created
- [ ] API key obtained
- [ ] Domain verified (if required)

### Configuration
- [ ] Email service package installed
- [ ] `lib/email.ts` updated with service code
- [ ] `EMAIL_SERVICE_API_KEY` set in environment
- [ ] `EMAIL_FROM_ADDRESS` set
- [ ] Email template created
- [ ] PDF attachment configured

### Testing
- [ ] Test email sends successfully
- [ ] Email arrives in inbox
- [ ] Attachment included
- [ ] Links work correctly
- [ ] Mobile email display checked

## Maintenance Checklist

### Weekly
- [ ] Check deployment logs for errors
- [ ] Review lead submissions
- [ ] Export leads for backup

### Monthly
- [ ] Update dependencies (`pnpm update`)
- [ ] Review database size
- [ ] Check MongoDB Atlas metrics
- [ ] Review API usage

### Quarterly
- [ ] Rotate `CLIENT_API_KEY`
- [ ] Update client with new key
- [ ] Review and update documentation
- [ ] Check for security updates

## Troubleshooting Checklist

### Database Issues
- [ ] Connection string correct
- [ ] Database user has permissions
- [ ] IP address whitelisted
- [ ] Network access configured
- [ ] Prisma client generated

### API Issues
- [ ] CORS headers configured
- [ ] API key matches
- [ ] Request format correct
- [ ] Content-Type header set
- [ ] Origin header present

### Admin Dashboard Issues
- [ ] Password correct
- [ ] Cookie not blocked
- [ ] HTTPS in production
- [ ] Session not expired
- [ ] Browser cache cleared

### Deployment Issues
- [ ] All environment variables set
- [ ] Build completed successfully
- [ ] No TypeScript errors
- [ ] Dependencies installed
- [ ] Prisma client generated

## Success Criteria

Your system is ready when:
- ✅ Health check returns "ok"
- ✅ Admin dashboard accessible
- ✅ Leads can be submitted via API
- ✅ Leads appear in dashboard
- ✅ Leads can be deleted
- ✅ CSV export works
- ✅ CORS configured correctly
- ✅ Client integration working
- ✅ No errors in logs
- ✅ Mobile responsive

## Next Client Setup

When setting up for a new client:
- [ ] Clone repository to new folder
- [ ] Create new `.env` with client-specific values
- [ ] Generate new `CLIENT_API_KEY`
- [ ] Set client's domain in `CLIENT_ALLOWED_ORIGIN`
- [ ] Deploy to new project/domain
- [ ] Test thoroughly
- [ ] Provide integration documentation to client

---

**Keep this checklist handy for each new client deployment!**
