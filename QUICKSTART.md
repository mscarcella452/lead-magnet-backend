# Quick Start Guide

Get your lead magnet backend running in 5 minutes!

## Step 1: Install Dependencies

```bash
pnpm install
```

## Step 2: Set Up Environment Variables

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# MongoDB connection (get from MongoDB Atlas)
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/leadmagnet?retryWrites=true&w=majority"

# Admin password (choose a strong password)
ADMIN_PASSWORD="your-secure-password"

# Cookie secret (generate random string)
NEXTAUTH_SECRET="random-secret-string-here"

# Allowed client domains (comma-separated)
CLIENT_ALLOWED_ORIGIN="https://yourclient.com"

# API key (optional, for extra security)
CLIENT_API_KEY="your-api-key"
```

## Step 3: Set Up Database

```bash
# Generate Prisma client
pnpm prisma:generate

# Push schema to MongoDB
pnpm prisma:push
```

## Step 4: Run Development Server

```bash
pnpm dev
```

## Step 5: Test It Out

### Access Admin Dashboard

1. Go to http://localhost:3000/admin/login
2. Enter your `ADMIN_PASSWORD`
3. View the dashboard at http://localhost:3000/admin/dashboard

### Test API Endpoint

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

## Next Steps

1. **Deploy to Production** - See README.md for deployment instructions
2. **Integrate Email** - Configure email service in `lib/email.ts`
3. **Customize UI** - Modify colors and branding
4. **Add Custom Fields** - Extend the Lead model as needed

## Common Issues

### "Cannot connect to database"

- Check your `DATABASE_URL` is correct
- Verify MongoDB Atlas IP whitelist includes your IP
- Ensure database user has read/write permissions

### "Prisma Client not found"

```bash
pnpm prisma:generate
```

### CORS errors from client website

- Add client domain to `CLIENT_ALLOWED_ORIGIN`
- Include the protocol (https://)
- No trailing slashes

## Need Help?

Check the full README.md for detailed documentation!
