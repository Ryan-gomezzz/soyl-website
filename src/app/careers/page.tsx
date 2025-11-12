import type { Metadata } from 'next';
import ApplyForm from '@/components/ApplyForm';

type Role = {
  title: string;
  seniority: string;
  responsibilities: string[];
  skills: string[];
  culture: string;
};

export const metadata: Metadata = {
  title: 'SOYL Careers — Build Production-Ready Cognitive Agents',
  description:
    'Join SOYL to build cognitive agents, resilient infrastructure, and standout experiences. Explore open roles across ML, engineering, product, design, recruiting, and GTM.'
};

const roles: Role[] = [
  {
    title: 'Machine Learning Engineer (Agent/Cognitive Layer)',
    seniority: 'Senior / Mid',
    responsibilities: [
      'Design, train, and productionize LLM-based cognitive agents with strong observability',
      'Evolve retrieval pipelines, memory stores, and tooling APIs that power in-production agents',
      'Partner with product and backend teams to ship agent-led features safely and quickly'
    ],
    skills: [
      'Python, PyTorch or TensorFlow, LangChain/agent frameworks, RAG, RLHF/finetuning, AWS'
    ],
    culture: 'You balance rapid experimentation with thoughtful guardrails and love seeing agents deliver measurable outcomes.'
  },
  {
    title: 'ML Research Engineer (R&D)',
    seniority: 'Mid / Senior',
    responsibilities: [
      'Prototype novel agent architectures from fresh literature and validate performance lifts',
      'Design evaluation suites, benchmarks, and ablation studies to ship research with rigor',
      'Work closely with engineering to translate breakthroughs into production-ready systems'
    ],
    skills: ['Python, experimentation pipelines, metrics design, research-to-prod workflows'],
    culture: 'You go deep on research questions while keeping a tight loop with real-world deployment.'
  },
  {
    title: 'Backend Engineer',
    seniority: 'Mid / Senior',
    responsibilities: [
      'Build APIs orchestrating agents, data stores, and front-end experiences',
      'Own authentication, rate limiting, and orchestration between ML services and Postgres',
      'Instrument services for reliability with metrics, tracing, and alerting'
    ],
    skills: ['Node.js/TypeScript, Python (FastAPI), GraphQL/REST, PostgreSQL, Redis, cloud infrastructure'],
    culture: 'You love clean interfaces, dependable services, and empowering teammates with great tooling.'
  },
  {
    title: 'Frontend Engineer',
    seniority: 'Mid',
    responsibilities: [
      'Ship polished and accessible experiences in Next.js for careers, dashboards, and chat surfaces',
      'Collaborate with design on component libraries, state management, and rapid experiments',
      'Instrument product analytics to drive data-informed iteration cycles'
    ],
    skills: ['React (Next.js), TypeScript, component systems, Tailwind/CSS-in-JS, testing'],
    culture: 'You ship fast, uphold craft, and enjoy creating interfaces that tell complex AI stories simply.'
  },
  {
    title: 'DevOps / Platform Engineer',
    seniority: 'Mid / Senior',
    responsibilities: [
      'Automate infrastructure for agent workloads across ECS, Lambda, or EKS',
      'Own CI/CD pipelines, observability tooling, and incident response playbooks',
      'Optimize cloud spend while enforcing security and compliance guardrails'
    ],
    skills: ['AWS, Terraform, Docker/Kubernetes, Prometheus, Sentry, cost monitoring'],
    culture: 'You enjoy giving teams superpowers with scalable, safe, and affordable platforms.'
  },
  {
    title: 'Data Engineer / MLOps',
    seniority: 'Mid',
    responsibilities: [
      'Build ETL pipelines and feature stores powering model training and inference',
      'Manage data versioning, lineage, and monitoring for agent reliability',
      'Collaborate with ML teams to shorten feedback loops between data and deployed models'
    ],
    skills: ['ETL, Airflow, DVC, SQL, feature stores, observability'],
    culture: 'You pride yourself on trustworthy data foundations that unlock confident experimentation.'
  },
  {
    title: 'Product Manager (AI Products)',
    seniority: 'Mid / Senior',
    responsibilities: [
      'Drive discovery, roadmap, and prioritization for cognitive agent experiences',
      'Run user research and synthesize insights into crisp specs and measurable outcomes',
      'Align cross-functional execution across ML, engineering, design, and go-to-market'
    ],
    skills: ['Roadmapping, metrics, user research, storytelling, stakeholder management'],
    culture: 'You love turning customer insights and data into momentum across the org.'
  },
  {
    title: 'UX Designer',
    seniority: 'Mid',
    responsibilities: [
      'Design end-to-end applicant and recruiting workflows across web and conversational surfaces',
      'Prototype and test rapidly in Figma to iterate on flows and IA',
      'Partner with engineering to deliver accessible, inclusive experiences'
    ],
    skills: ['Interaction design, prototyping, Figma, usability testing, systems thinking'],
    culture: 'You believe craft and empathy coexist—and ship both at speed.'
  },
  {
    title: 'UI Designer',
    seniority: 'Junior / Mid',
    responsibilities: [
      'Craft visual systems and components for careers, marketing, and product surfaces',
      'Ship production-ready design assets and documentation for engineers',
      'Collaborate with brand to keep storytelling cohesive across touchpoints'
    ],
    skills: ['Figma, visual design, branding, component specs, motion basics'],
    culture: 'You bring bold, consistent visuals that elevate product narratives.'
  },
  {
    title: 'Talent Coordinator',
    seniority: 'Junior',
    responsibilities: [
      'Own interview scheduling, candidate communication, and ATS hygiene',
      'Screen inbound applicants and maintain service levels for responses',
      'Support recruiters with reporting and pipeline operations'
    ],
    skills: ['ATS management, communication, organization, stakeholder coordination'],
    culture: 'You lead with empathy and operational excellence to deliver standout candidate experiences.'
  },
  {
    title: 'Technical Recruiter',
    seniority: 'Mid',
    responsibilities: [
      'Source and close top-tier talent across ML, backend, and platform roles',
      'Run data-informed hiring funnels with structured interviews and feedback',
      'Consult with leadership on workforce planning and offer strategies'
    ],
    skills: ['Technical sourcing, pipeline management, negotiation, market intelligence'],
    culture: 'You are energized by building inclusive teams that raise the bar.'
  },
  {
    title: 'Sales / BD (Enterprise AI)',
    seniority: 'Mid / Senior',
    responsibilities: [
      'Build enterprise pipeline, guide pilots, and negotiate long-term agreements',
      'Collaborate with product marketing on repeatable customer narratives',
      'Create partnerships that align with the agent roadmap'
    ],
    skills: ['Enterprise sales, AI solution selling, contract negotiation, CRM rigor'],
    culture: 'You thrive translating cutting-edge tech into concrete business value.'
  },
  {
    title: 'Security Engineer',
    seniority: 'Mid / Senior',
    responsibilities: [
      'Design security controls across application, data, and cloud layers',
      'Run threat models, incident response drills, and third-party risk reviews',
      'Embed secure-by-default practices within engineering workflows'
    ],
    skills: ['AppSec, CloudSec, threat modeling, detection engineering, compliance'],
    culture: 'You balance agility with a strong security posture and education-first mindset.'
  },
  {
    title: 'QA Engineer',
    seniority: 'Mid',
    responsibilities: [
      'Build automated test suites covering agent workflows, APIs, and UI regressions',
      'Lead performance, load, and resilience testing for mission-critical paths',
      'Champion shift-left quality and observability practices across teams'
    ],
    skills: ['Test automation (Playwright/Cypress), CI/CD, performance testing, QA strategy'],
    culture: 'You see quality as everyone’s job and create systems that make it easy.'
  },
  {
    title: 'Documentation Engineer',
    seniority: 'Mid',
    responsibilities: [
      'Own internal and customer-facing documentation for agents, APIs, and integrations',
      'Produce samples, workshops, and enablement content for developers',
      'Collect feedback loops and influence product prioritization'
    ],
    skills: ['Technical writing, documentation tooling, developer advocacy, demo creation'],
    culture: 'You love clarifying complex systems and empowering builders worldwide.'
  }
];

export default function CareersPage() {
  return (
    <main className="bg-bg text-text">
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-24 md:pt-32">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-accent/80 mb-2">Open Roles</p>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl text-text">Build Production-Ready Cognitive Agents</h1>
          <p className="mt-4 text-lg text-muted">
            We are assembling a multidisciplinary team to ship trustworthy, high-impact AI agents. Explore the roles below and
            apply to build with us.
          </p>
        </header>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {roles.map((role) => (
            <article
              key={role.title}
              className="flex flex-col rounded-xl border border-white/10 bg-panel/50 p-6 shadow-lg transition hover:border-accent/50 glass"
            >
              <header>
                <h2 className="text-2xl font-semibold text-text">{role.title}</h2>
                <p className="mt-1 text-sm font-medium text-accent">{role.seniority}</p>
              </header>
              <div className="mt-4 space-y-4 text-sm text-muted">
                    <div>
                  <h3 className="font-semibold uppercase tracking-wide text-text/70">Responsibilities</h3>
                  <ul className="mt-2 space-y-2">
                    {role.responsibilities.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-accent">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  </div>
                  <div>
                  <h3 className="font-semibold uppercase tracking-wide text-text/70">Required skills</h3>
                  <ul className="mt-2 space-y-2">
                    {role.skills.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-accent">•</span>
                        <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              <p className="mt-4 text-sm text-muted">{role.culture}</p>
              <a
                href="#apply"
                className="mt-6 inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-semibold text-bg transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg"
              >
                Apply for this role
              </a>
            </article>
          ))}
        </div>
      </section>
      <section id="apply" className="bg-panel/30 py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-3xl font-semibold text-text">Ready to apply?</h2>
          <p className="mt-3 text-center text-muted">
            Submit your application below. We review every submission and will reach out within 72 hours.
          </p>
          <div className="mt-8">
            <ApplyForm roles={roles.map((role) => role.title)} />
      </div>
    </div>
      </section>
    </main>
  );
}

