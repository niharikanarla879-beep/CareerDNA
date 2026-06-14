# Folder Structure - CareerDNA

This document outlines the standard repository file and folder hierarchy for the CareerDNA project, built with Next.js (App Router), TypeScript, and Vanilla CSS.

---

## 1. Project Directory Tree

```
CareerDNA/
├── prisma/                    # Prisma Database schema and migration logs
│   ├── schema.prisma          # Database models definitions
│   └── migrations/            # SQL migration history
├── public/                    # Static assets
│   ├── images/                # App illustrations & illustrations
│   └── icons/                 # Custom SVG icons
├── src/
│   ├── app/                   # Next.js App Router (Pages, APIs, Layouts)
│   │   ├── layout.tsx         # Global layout with providers and fonts
│   │   ├── page.tsx           # Landing page
│   │   ├── login/             # Login flow routing
│   │   ├── register/          # Sign-up flow routing
│   │   ├── dashboard/         # Main workspace dashboard routing
│   │   ├── assessment/        # Assessment flow wizard routing
│   │   ├── roadmap/           # Skill development roadmap tracker
│   │   ├── resume/            # ATS Resume Analyzer portal
│   │   ├── interview/         # AI Mock Interview portal
│   │   ├── certifications/    # Certifications tracking portal
│   │   ├── projects/          # Projects tracking portal
│   │   ├── advisor/           # Chatbot mentor panel
│   │   ├── api/               # API endpoints (file upload, chat streams)
│   │   │   ├── chat/route.ts
│   │   │   ├── resume/route.ts
│   │   │   └── interview/route.ts
│   │   └── middleware.ts      # Authentication guard
│   ├── components/            # Reusable React UI Components (Modular structure)
│   │   ├── ui/                # Base UI design system tokens (buttons, cards, inputs)
│   │   ├── layout/            # Common layouts (Navbar, Sidebar, Footer)
│   │   ├── dashboard/         # Components specific to the overview dashboard
│   │   ├── assessment/        # Components specific to the RIASEC/Values wizard
│   │   ├── roadmap/           # Components specific to milestone tracking
│   │   ├── resume/            # Components specific to ATS evaluation & scores
│   │   ├── interview/         # Components specific to Mock Interview Mode
│   │   ├── certifications/    # Components specific to certs list & trackers
│   │   ├── projects/          # Components specific to project cards & metadata
│   │   └── advisor/           # Chat console elements
│   ├── styles/                # Global Design System styling
│   │   ├── variables.css      # Design tokens (colors, gradients, typography, spacing)
│   │   ├── global.css         # Baseline resets, standard element styling
│   │   └── modules/           # Module-specific CSS files
│   ├── lib/                   # System logic & helper services
│   │   ├── db.ts              # Global Prisma client singleton
│   │   ├── gemini.ts          # Google Gemini API configurations
│   │   ├── parser.ts          # PDF/Docx text parsing functions
│   │   ├── riasec.ts          # RIASEC mapping lookup database & algorithm
│   │   ├── scoreEngine.ts     # CareerDNA composite score calculator
│   │   └── utils.ts           # String manipulation, date formatters, validations
│   ├── types/                 # TypeScript typings
│   │   ├── index.ts           # Core shared types (User, Profile, Skill)
│   │   ├── assessment.ts      # Diagnostic types (RIASEC results structure)
│   │   └── interview.ts       # AI Mock Interview types
│   └── actions/               # Next.js Server Actions (DB transactions)
│       ├── auth.ts            # Sign-up and session routines
│       ├── profile.ts         # User profiles update & skills additions
│       ├── assessments.ts     # Save assessment logs & trigger engine
│       ├── interview.ts       # Start interview sessions & score answers
│       ├── projects.ts        # Create & rank portfolio projects
│       └── certifications.ts  # Add & check certificates
├── docs/                      # Architectural and requirements documentation
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── FOLDER_STRUCTURE.md
│   └── DEVELOPMENT_PLAN.md
├── .env.local                 # Local environment keys (Database URL, LLM API keys)
├── package.json               # Package configurations and script tools
├── tsconfig.json              # TypeScript definitions configuration
└── next.config.js             # Core Next.js execution parameters
```

---

## 2. Directory Guidelines

### 2.1. Styling Separation
To ensure clean code structure, each complex UI component folder inside `src/components` will feature a matching `.module.css` file where applicable.
- Avoid inline layout adjustments.
- Color palettes, padding steps, and animation curves are declared exclusively in `src/styles/variables.css` using CSS custom properties (variables) to permit easy theme swapping.

### 2.2. API Routes vs Server Actions
- **Server Actions** (`src/actions/`): Preferred for database writes, login/logout mechanisms, scoring modifications, projects/certifications uploads, and mutations triggered directly by client-side buttons.
- **Route Handlers** (`src/app/api/`): Utilized when streaming data payloads (like live AI chat responses or interactive interview transcripts) or handling file upload streams (multipart/form-data upload for resumes).

### 2.3. Type Safety
- All custom structures must be defined in `src/types/` rather than declared inline.
- Prisma-generated types should be imported from `@prisma/client` to represent schema records.
