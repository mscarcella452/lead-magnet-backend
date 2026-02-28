# Lead Magnet Backend System

A reusable, production-ready lead magnet backend built with Next.js 15, Prisma, MongoDB, and TypeScript. This system provides both public API endpoints for client websites and a secure admin dashboard for managing leads.

## 🚀 Features

- **Public API Endpoints** - External client websites can submit leads via REST API
- **Admin Dashboard** - Secure admin panel with authentication
- **MongoDB Integration** - Scalable database with Prisma ORM
- **CORS & API Key Security** - Protect your API from unauthorized access
- **Server Components & Actions** - Modern Next.js 15 architecture
- **TypeScript** - Full type safety throughout
- **shadcn/ui Components** - Beautiful, accessible UI components
- **CSV Export** - Export leads for analysis
- **Email Placeholder** - Ready for email service integration

## 📋 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: MongoDB with Prisma ORM
- **Validation**: Zod
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd lead-magnet-backend

# Install dependencies
pnpm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

**Required Environment Variables:**

```env
# MongoDB connection string
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/leadmagnet?retryWrites=true&w=majority"

# Admin password for dashboard access
ADMIN_PASSWORD="your-secure-password"

# Secret for cookie encryption
NEXTAUTH_SECRET="generate-a-random-secret-string"

# Allowed origins for CORS (comma-separated)
CLIENT_ALLOWED_ORIGIN="https://yourclient.com,https://www.yourclient.com"

# Optional API key for additional security
CLIENT_API_KEY="your-api-key"
```

### 3. Database Setup

```bash
# Generate Prisma client
pnpm prisma:generate

# Push schema to MongoDB
pnpm prisma:push

# (Optional) Open Prisma Studio to view data
pnpm prisma:studio
```

### 4. Run Development Server

```bash
pnpm dev
```

Visit:
- **Home**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
- **API Health Check**: http://localhost:3000/api/health

## 📡 API Documentation

### POST /api/leads

Submit a new lead from external client websites.

**Headers:**
```
Content-Type: application/json
x-api-key: your-api-key (if configured)
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "source": "website-a",
  "metadata": {
    "phone": "+1234567890",
    "company": "Acme Inc"
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com"
  },
  "message": "Lead created successfully"
}
```

**Example Usage (JavaScript):**
```javascript
const response = await fetch('https://your-backend.com/api/leads', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'your-api-key',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    name: 'John Doe',
    source: 'landing-page-a',
  }),
});

const data = await response.json();
console.log(data);
```

### GET /api/health

Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-02-04T22:23:00.000Z",
  "database": "connected",
  "version": "1.0.0"
}
```

## 🔐 Admin Dashboard

### Login

Navigate to `/admin/login` and enter your admin password (configured in `.env`).

### Features

- **Dashboard Statistics** - View total leads, today's leads, weekly, and monthly counts
- **Lead Table** - Sortable table with all lead information
- **Delete Leads** - Remove leads with confirmation dialog
- **Export CSV** - Download all leads as CSV file
- **Logout** - Secure logout functionality

## 🏗️ Project Structure

```
lead-magnet-backend/
├── app/
│   ├── api/                    # API Routes (External Access)
│   │   ├── leads/route.ts      # Lead submission endpoint
│   │   ├── health/route.ts     # Health check
│   │   └── admin/              # Admin API routes
│   ├── admin/                  # Admin Dashboard
│   │   ├── dashboard/          # Dashboard pages & components
│   │   ├── actions.ts          # Server Actions
│   │   ├── layout.tsx          # Admin layout
│   │   └── login/page.tsx      # Login page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── components/
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── db.ts                   # Prisma client singleton
│   ├── security.ts             # CORS & API key validation
│   ├── auth.ts                 # Authentication utilities
│   ├── email.ts                # Email placeholder
│   ├── utils.ts                # Helper functions
│   └── validations.ts          # Zod schemas
├── prisma/
│   └── schema.prisma           # Database schema
├── types/
│   ├── lead.ts                 # Lead types
│   └── index.ts                # Type exports
├── middleware.ts               # Route protection & CORS
├── .env.example                # Environment template
└── package.json
```

## 🔧 Customization Guide

### For Each New Client

1. **Clone the repository**
   ```bash
   git clone <repo-url> client-name-leads
   cd client-name-leads
   ```

2. **Update environment variables**
   - Set `CLIENT_ALLOWED_ORIGIN` to client's domain
   - Generate new `CLIENT_API_KEY`
   - Set unique `ADMIN_PASSWORD`

3. **Customize branding** (optional)
   - Update colors in `app/globals.css`
   - Modify admin dashboard title in `app/admin/AdminNav.tsx`

4. **Deploy**
   - Deploy to Vercel, Netlify, or your preferred platform
   - Set environment variables in deployment platform

### Adding Custom Fields

To add custom fields to leads:

1. **Update Prisma schema** (`prisma/schema.prisma`):
   ```prisma
   model Lead {
     // ... existing fields
     phone     String?
     company   String?
   }
   ```

2. **Push changes**:
   ```bash
   pnpm prisma:push
   ```

3. **Update validation** (`lib/validations.ts`):
   ```typescript
   export const leadSubmissionSchema = z.object({
     // ... existing fields
     phone: z.string().optional(),
     company: z.string().optional(),
   });
   ```

4. **Update UI** - Add columns to `LeadTable.tsx`

## 📧 Email Integration

The system includes email placeholders in `lib/email.ts`. To integrate:

### Option 1: Resend (Recommended)

```bash
pnpm add resend
```

```typescript
// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendLeadMagnetEmail(email: string, pdfUrl: string) {
  await resend.emails.send({
    from: 'leads@yourdomain.com',
    to: email,
    subject: 'Your Free Lead Magnet',
    html: '<h1>Thank you!</h1>',
    attachments: [{ filename: 'guide.pdf', path: pdfUrl }],
  });
}
```

### Option 2: SendGrid

```bash
pnpm add @sendgrid/mail
```

### Option 3: Nodemailer (SMTP)

```bash
pnpm add nodemailer
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Environment Variables for Production

Make sure to set all required environment variables in your deployment platform:
- `DATABASE_URL`
- `ADMIN_PASSWORD`
- `NEXTAUTH_SECRET`
- `CLIENT_ALLOWED_ORIGIN`
- `CLIENT_API_KEY`

## 🧪 Testing the API

### Using cURL

```bash
# Submit a lead
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "source": "test"
  }'

# Health check
curl http://localhost:3000/api/health
```

### Using Postman

1. Create new POST request to `http://localhost:3000/api/leads`
2. Add header: `x-api-key: your-api-key`
3. Set body to raw JSON:
   ```json
   {
     "email": "test@example.com",
     "name": "Test User"
   }
   ```

## 📝 Scripts

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm prisma:generate  # Generate Prisma client
pnpm prisma:push      # Push schema to database
pnpm prisma:studio    # Open Prisma Studio
```

## 🔒 Security Best Practices

1. **Never commit `.env`** - It's in `.gitignore` by default
2. **Use strong passwords** - For `ADMIN_PASSWORD`
3. **Rotate API keys** - Regularly update `CLIENT_API_KEY`
4. **Enable HTTPS** - Always use HTTPS in production
5. **Whitelist origins** - Set `CLIENT_ALLOWED_ORIGIN` precisely
6. **Monitor logs** - Check for suspicious activity

## 🐛 Troubleshooting

### Prisma Client Not Generated

```bash
pnpm prisma:generate
```

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check MongoDB Atlas IP whitelist
- Ensure database user has proper permissions

### CORS Errors

- Add client domain to `CLIENT_ALLOWED_ORIGIN`
- Include protocol (https://)
- Check for trailing slashes

### Authentication Issues

- Clear browser cookies
- Verify `ADMIN_PASSWORD` in `.env`
- Check `NEXTAUTH_SECRET` is set

## 📄 License

MIT License - Feel free to use this for your clients!

## 🤝 Contributing

This is a template project. Fork it and customize for your needs!

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ using Next.js 15, Prisma, and MongoDB**
