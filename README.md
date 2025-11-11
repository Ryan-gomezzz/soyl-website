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

| Variable | Notes |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (RDS, Render, or Supabase) |
| `AWS_REGION` | Region for S3/Secrets (e.g. `us-east-1`) |
| `RESUME_BUCKET` | Private S3 bucket for resumes |
| `S3_UPLOAD_ACCESS_KEY_ID` / `S3_UPLOAD_SECRET_ACCESS_KEY` | IAM user keys limited to the resume bucket |
| `UPLOAD_API_SECRET` | Shared secret for `/api/upload-url` |
| `ADMIN_API_TOKEN` | Secret token for admin API/UI access |
| `SENDGRID_API_KEY` / `SENDGRID_FROM_EMAIL` / `HIRING_INBOX` | Email notifications |
| `SLACK_WEBHOOK_URL` | Slack channel webhook (optional) |
| `RECAPTCHA_SECRET_KEY` / `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Google reCAPTCHA v3 keys |
| `NEXT_PUBLIC_UPLOAD_PUBLIC_HINT` | Client-side hint that must match server secret (e.g. hashed) |
| `NEXT_PUBLIC_ADMIN_HINT` | Token forwarded from admin UI to API |

#### Sample `.env.local`

```bash
DATABASE_URL="postgresql://username:password@host:5432/soyl_applicants?schema=public"

AWS_REGION="us-east-1"
RESUME_BUCKET="soyl-careers-resumes"
S3_UPLOAD_ACCESS_KEY_ID="aws_access_key_id"
S3_UPLOAD_SECRET_ACCESS_KEY="aws_secret_access_key"
UPLOAD_API_SECRET="super-shared-secret"

ADMIN_API_TOKEN="admin-dashboard-token"

SENDGRID_API_KEY="SG.xxxxxx"
SENDGRID_FROM_EMAIL="careers@soyl.ai"
HIRING_INBOX="hiring@soyl.ai"

SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."

RECAPTCHA_SECRET_KEY="recaptcha-secret-key"
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="recaptcha-site-key"

NEXT_PUBLIC_UPLOAD_PUBLIC_HINT="public-hint"
NEXT_PUBLIC_ADMIN_HINT="preview-admin-token"
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
├── src/
│   ├── app/            # Next.js app router pages
│   │   ├── _components/ # Shared components
│   │   ├── pricing/    # Pricing page
│   │   ├── docs/       # Documentation
│   │   ├── resources/  # Resources & blog
│   │   ├── careers/    # Careers page
│   │   ├── enterprise/ # Enterprise page
│   │   ├── custom-agents/ # Custom Agents page
│   │   ├── open-dashboard/ # Dashboard
│   │   └── soyl-rd/    # R&D page
│   ├── lib/            # Utilities & config
│   │   ├── data/       # Static data (features, careers)
│   │   └── siteConfig.ts
│   └── styles/         # Global styles
│       ├── tokens.css  # CSS variables
│       └── animations.css
├── .github/workflows/  # CI/CD workflows
└── jest.config.js      # Jest configuration
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

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on:

- Branch naming conventions
- Pull request process
- Code style standards
- Commit message format

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set production branch to `main`
4. Deploy automatically on push

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

