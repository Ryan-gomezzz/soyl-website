# SOYL — Story Of Your Life

**Emotion-aware AI salespersons. Multimodal agents that listen, adapt, and convert.**

SOYL provides advanced emotion intelligence and adaptive AI agents for modern commerce. We specialize in B2B & B2C solutions, foundation-model R&D, and SDK/APIs for emotion-aware AI systems.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/soyl-ai/soyl-site.git
cd soyl-site

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run Jest tests
- `npm run format` - Format code with Prettier

## 🧑‍💼 Careers & Applications System

### Environment Variables

Copy `.env.example` to `.env.local` and set:

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Yes (Careers) | Postgres connection string (RDS, Render, or Supabase) |
| `AWS_REGION` | Yes (Careers) | Region for S3/Secrets (e.g. `us-east-1`) |
| `RESUME_BUCKET` | Yes (Careers) | Private S3 bucket for resumes |
| `S3_UPLOAD_ACCESS_KEY_ID` / `S3_UPLOAD_SECRET_ACCESS_KEY` | Yes (Careers) | IAM user keys limited to the resume bucket |
| `UPLOAD_API_SECRET` | Yes (Careers) | Shared secret for `/api/upload-url` |
| `ADMIN_API_TOKEN` | Yes (Careers) | Secret token for admin API/UI access |
| `SENDGRID_API_KEY` / `SENDGRID_FROM_EMAIL` / `HIRING_INBOX` | Yes (Careers) | Email notifications |
| `SLACK_WEBHOOK_URL` | No | Slack channel webhook (optional) |
| `RECAPTCHA_SECRET_KEY` / `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Yes (Careers) | Google reCAPTCHA v3 keys |
| `NEXT_PUBLIC_UPLOAD_PUBLIC_HINT` | Yes (Careers) | Client-side hint that must match server secret (e.g. hashed) |
| `NEXT_PUBLIC_ADMIN_HINT` | Yes (Careers) | Token forwarded from admin UI to API |
| `ADMIN_USERNAME` | No | Admin login username (defaults to 'admin') |
| `ADMIN_PASSWORD` | No | Admin login password (required if admin login is enabled) |

#### Sample `.env.local`

```bash
# Database (Required for Careers System)
DATABASE_URL="postgresql://username:password@host:5432/soyl_applicants?schema=public"

# AWS S3 (Required for Careers System)
AWS_REGION="us-east-1"
RESUME_BUCKET="soyl-careers-resumes"
S3_UPLOAD_ACCESS_KEY_ID="aws_access_key_id"
S3_UPLOAD_SECRET_ACCESS_KEY="aws_secret_access_key"
UPLOAD_API_SECRET="super-shared-secret"

# Admin & Security (Required for Careers System)
ADMIN_API_TOKEN="admin-dashboard-token"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-secure-password"

# Email (Required for Careers System)
SENDGRID_API_KEY="SG.xxxxxx"
SENDGRID_FROM_EMAIL="careers@soyl.ai"
HIRING_INBOX="hiring@soyl.ai"

# Optional Integrations
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."

# reCAPTCHA (Required for Careers System)
RECAPTCHA_SECRET_KEY="recaptcha-secret-key"
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="recaptcha-site-key"

# Public Hints (Required for Careers System)
NEXT_PUBLIC_UPLOAD_PUBLIC_HINT="public-hint"
NEXT_PUBLIC_ADMIN_HINT="preview-admin-token"

# Voice Bot (Required for Voice Bot Feature)
OPENAI_API_KEY="sk-..."
```

### Local Development

1. Install dependencies (`npm install`) and copy env file.
2. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
3. Start local dev server:
   ```bash
   npm run dev
   ```
4. Visit `http://localhost:3000/careers` for the public page and `http://localhost:3000/admin/applicants` (requires `NEXT_PUBLIC_ADMIN_HINT` matching `ADMIN_API_TOKEN`).

### Deployment Checklist (Vercel + AWS RDS)

- Provision AWS resources with Terraform in `terraform/` (S3 bucket, Secrets Manager, RDS, IAM role).
- Store DB credentials, SendGrid key, and other secrets in AWS Secrets Manager or Vercel environment variables (never commit).
- Run `npx prisma migrate deploy` against the production database.
- Set environment variables in Vercel (or ECS task definition) matching `.env.example`.
- Configure reCAPTCHA keys and verify SendGrid sender identity.
- Rotate `ADMIN_API_TOKEN` regularly and distribute via secure vault.
- Add monitoring (Sentry/Log drains) and enable CloudWatch alarms for RDS.

### Deployment Checklist (Supabase Alternative)

- Create Supabase project and copy the Postgres connection string into `DATABASE_URL`.
- Use Supabase Storage instead of S3 by swapping the upload API (Supabase supports signed uploads natively).
- Supabase Auth can replace the `ADMIN_API_TOKEN` check for the admin dashboard.
- Costs remain minimal while preserving Prisma compatibility.

### Security & Compliance Notes

- The public form enforces reCAPTCHA v3, PDF-only uploads (≤5 MB), and shared-secret protection for presigned URLs.
- Resumes live in a private S3 bucket; only signed PUT/GET URLs are exposed and expire quickly.
- Admin API requires `ADMIN_API_TOKEN`; upgrade to JWT/SSO when ready.
- Use `DELETE /api/admin/:id` for GDPR deletion requests and remove the corresponding S3 object (future enhancement).
- Integrate Sentry (`@sentry/nextjs`) and ship structured logs to CloudWatch/Datadog.
- Replace in-memory rate limiting with Redis/Upstash for distributed environments.
- For automated resume parsing, hook `scoreResumeKeywords` into Textract + Bedrock or a lightweight LLM service.

### Automations

- **Email**: SendGrid notification per applicant (`utils/sendgrid.ts`).
- **Slack**: Webhook payload for `#hiring` announcements (`utils/slack.ts`).
- **n8n**: Trigger on status change to `INTERVIEW` -> create calendar invite or move to ATS.
- **Scoring**: `scoreResumeKeywords` stub ready for integration with keyword/LLM parsing pipelines.

## 🎤 Voice Bot Configuration

The SOYL website includes an AI-powered voice assistant that uses OpenAI's APIs for speech-to-text, conversational AI, and text-to-speech.

### Required Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `OPENAI_API_KEY` | **Yes** | Your OpenAI API key (starts with `sk-`) |

### Features

- **Speech-to-Text**: Transcribes audio using OpenAI Whisper API
- **Conversational AI**: Generates responses using GPT-4
- **Text-to-Speech**: Converts response to audio using OpenAI TTS API

### Getting Your OpenAI API Key

1. Sign up or log in to [OpenAI Platform](https://platform.openai.com/)
2. Navigate to **API Keys** section
3. Click **Create new secret key**
4. Copy the key (starts with `sk-`) and add it to your environment variables

### API Endpoint

The voice bot API is available at `/api/voice/chat` and handles:
- Audio transcription (Whisper)
- AI conversation (GPT-4)
- Speech synthesis (TTS)

See `src/components/chatbot/README.md` for complete voice bot documentation.

## 🤖 Chatbot (MCQ) — How to Edit

The SOYL website includes a MCQ-driven chatbot that helps visitors explore products, request pilots, and learn about careers. The conversation flow is defined in JSON format.

### Quick Edit Guide

1. **Edit the flow**: Open `src/components/chatbot/mcq-flows/default-flow.json`
2. **Add/modify nodes**: See `src/components/chatbot/README.md` for full documentation
3. **Node types**: `question`, `info`, `end`
4. **Test locally**: Run `npm run dev` and click the chatbot launcher (bottom-right)

**Example**: To add a new product feature node:

```json
"n_new_feature": {
  "type": "info",
  "text": "New feature description here",
  "choices": [
    { "id": "c_back", "text": "Back", "next": "n_product_overview" }
  ]
}
```

Then link it from another node by adding to `choices` array.

See `src/components/chatbot/README.md` for complete flow documentation, node types, action types, and security guidelines.

## 📊 Flowchart Visuals — How to Edit

The landing page includes an interactive flowchart showing SOYL's R&D journey and product stack. Node descriptions were adapted from the SOYL R&D document (SOYL R&D (2).pdf).

### Quick Edit Guide

1. **Edit nodes**: Open `src/components/Flowchart/flow-data.ts`
2. **Adjust positions**: Change `x` and `y` values (0.0 to 1.0, normalized)
3. **Update copy**: Edit `title`, `subtitle`, `description` fields
4. **Add nodes**: Add to `flow.nodes` array with unique `id`
5. **Add connections**: Add to `flow.edges` array

**Example**: Moving a node position:
```typescript
{
  id: "n_phase1",
  title: "Phase 1 — MVP",
  x: 0.15,  // 15% from left (0 = left, 1 = right)
  y: 0.35,  // 35% from top (0 = top, 1 = bottom)
}
```

See `src/components/Flowchart/README.md` for complete editing guide, node structure, and citation information.

## 📁 Project Structure

```
soyl-site/
├── public/              # Static assets
│   ├── images/         # Hero images, product visuals
│   ├── og/             # OpenGraph images
│   └── patterns/       # SVG patterns
├── prisma/             # Database schema
│   └── schema.prisma
├── src/
│   ├── app/            # Next.js app router pages
│   │   ├── _components/ # Shared page components
│   │   ├── api/        # API routes (chatbot logging)
│   │   ├── careers/    # Careers page
│   │   ├── custom-agents/ # Custom Agents page
│   │   ├── docs/       # Documentation
│   │   ├── enterprise/ # Enterprise page
│   │   ├── open-dashboard/ # Dashboard
│   │   ├── pricing/    # Pricing page
│   │   ├── privacy/    # Privacy policy
│   │   ├── resources/  # Resources & blog
│   │   ├── soyl-rd/    # R&D page
│   │   └── terms/      # Terms of service
│   ├── components/     # Reusable React components
│   │   ├── chatbot/    # MCQ chatbot system
│   │   ├── FeatureGrid/ # Feature grid components
│   │   ├── Flowchart/  # R&D flowchart visualization
│   │   └── ...
│   ├── lib/            # Utilities & config
│   │   ├── data/       # Static data (features, careers, testimonials)
│   │   ├── prisma.ts   # Prisma client
│   │   └── siteConfig.ts
│   ├── pages/          # Pages router (API routes & admin)
│   │   ├── api/        # API endpoints (applicants, upload, admin)
│   │   └── admin/      # Admin dashboard
│   ├── styles/         # Global styles
│   │   ├── tokens.css  # CSS variables
│   │   ├── animations.css
│   │   └── flowchart.css
│   └── utils/          # Utility functions
│       ├── adminAuth.ts
│       ├── rateLimit.ts
│       ├── resumeScorer.ts
│       ├── sendgrid.ts
│       └── slack.ts
├── terraform/          # Infrastructure as code
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
├── .github/workflows/  # CI/CD workflows
├── jest.config.js      # Jest configuration
├── next.config.js       # Next.js configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: Headless UI
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier
- **Git Hooks**: Husky + lint-staged

## 🎨 Design System

Our design system uses a tech-oriented color palette:

- **Background**: Very dark navy (`#0f1724`)
- **Accent**: Cyan tech (`#4dd8ff`)
- **Secondary**: Mint (`#9be7c4`)
- **Typography**: Inter (system fallback)

See `src/styles/tokens.css` for full CSS variables.

## 📝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on branch naming, pull request process, code style standards, and commit message format.

## 🚢 Deployment

### Deployment on Vercel

Vercel is the recommended deployment platform for this Next.js application. Follow these steps to deploy:

#### 1. Initial Setup

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click **Add New Project**
4. Import your GitHub repository
5. Set production branch to `main`
6. Vercel will automatically detect Next.js and configure build settings

#### 2. Adding Environment Variables

**Critical**: You must add all required environment variables before deploying.

1. In your Vercel project dashboard, navigate to **Settings** → **Environment Variables**
2. Add each variable one by one using the **Add** button
3. Select the appropriate environment scope:
   - **Production**: For production deployments
   - **Preview**: For preview deployments (pull requests)
   - **Development**: For local development (optional)

#### 3. Required Environment Variables

**For Voice Bot:**
- `OPENAI_API_KEY` - Your OpenAI API key (starts with `sk-`)

**For Careers System:**
- `DATABASE_URL` - PostgreSQL connection string
- `AWS_REGION` - AWS region (e.g., `us-east-1`)
- `RESUME_BUCKET` - S3 bucket name
- `S3_UPLOAD_ACCESS_KEY_ID` - AWS access key
- `S3_UPLOAD_SECRET_ACCESS_KEY` - AWS secret key
- `UPLOAD_API_SECRET` - Shared secret for upload API
- `ADMIN_API_TOKEN` - Admin dashboard token
- `SENDGRID_API_KEY` - SendGrid API key
- `SENDGRID_FROM_EMAIL` - Email sender address
- `HIRING_INBOX` - Hiring email address
- `RECAPTCHA_SECRET_KEY` - Google reCAPTCHA secret
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - Google reCAPTCHA site key
- `NEXT_PUBLIC_UPLOAD_PUBLIC_HINT` - Public hint for upload
- `NEXT_PUBLIC_ADMIN_HINT` - Admin hint token

**Optional:**
- `ADMIN_USERNAME` - Admin login username (defaults to 'admin')
- `ADMIN_PASSWORD` - Admin login password
- `SLACK_WEBHOOK_URL` - Slack webhook for notifications

#### 4. Database Setup

Before deploying, ensure your database is set up:

```bash
# Run migrations against production database
npx prisma migrate deploy
```

**Note**: Make sure `DATABASE_URL` is set in Vercel before running migrations.

#### 5. Build Configuration

Vercel automatically detects Next.js and uses these build settings:
- **Build Command**: `npm run build` (automatically set)
- **Output Directory**: `.next` (automatically set)
- **Install Command**: `npm install` (automatically set)

#### 6. Deploy

1. After adding all environment variables, go to **Deployments** tab
2. Click **Redeploy** on the latest deployment, or
3. Push a new commit to trigger automatic deployment

#### 7. Post-Deployment Checklist

- [ ] Verify all environment variables are set correctly
- [ ] Test voice bot functionality (requires `OPENAI_API_KEY`)
- [ ] Test careers form submission (requires all careers system variables)
- [ ] Verify database connection
- [ ] Check admin dashboard access
- [ ] Test email notifications (SendGrid)
- [ ] Verify reCAPTCHA is working

#### Environment-Specific Configuration

- **Production**: Set all required variables for production use
- **Preview**: Can use dummy values for testing, or separate test credentials
- **Development**: Use local `.env.local` file (never commit this)

#### Troubleshooting

**Build Failures:**
- Ensure all required environment variables are set
- Check that `DATABASE_URL` is valid and accessible
- Verify Prisma client generation succeeds

**Runtime Errors:**
- Check Vercel function logs in the dashboard
- Verify API keys are correct and have proper permissions
- Ensure database is accessible from Vercel's IP ranges

**Voice Bot Not Working:**
- Verify `OPENAI_API_KEY` is set and valid
- Check OpenAI API usage limits and billing
- Review function logs for API errors

The site is optimized for Vercel's edge network and serverless functions.

### Manual Build

```bash
npm run build
npm run start
```

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🤝 Support

- **Email**: hello@soyl.ai
- **Jobs**: jobs@soyl.ai
- **GitHub**: [soyl-ai](https://github.com/soyl-ai)

---

Built with ❤️ by the SOYL team

