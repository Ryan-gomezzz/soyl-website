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

