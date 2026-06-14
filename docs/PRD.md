# Product Requirements Document (PRD) - CareerDNA

## 1. Executive Summary & Vision
**CareerDNA** is an interactive, AI-powered career assessment and growth mapping platform. It acts as a digital career strategist that analyzes a user's core professional attributes (interests, personality, values, and current skills) to identify highly compatible career paths, uncover technical and soft skill gaps, generate actionable step-by-step milestones, and provide interactive AI mentoring.

The goal is to demystify career planning by replacing outdated, static career tests with a dynamic, living profile (their "Career DNA") that grows with the user.

---

## 2. Target Audience & Personas
- **The Student / Recent Graduate**: Looking to enter the job market but uncertain about their path or how to build a portfolio.
- **The Career Pivoters**: Experienced professionals feeling stuck, burnt out, or wanting to transition to a high-demand sector (e.g., tech, sustainability).
- **The Upskillers**: Workers looking to progress within their current industry by identifying skill gaps and acquiring specific certifications or credentials.

---

## 3. Core Features & Scope

### 3.1. Assessment Engine ("The DNA Decoder")
- **RIASEC Interest Inventory**: Standardized assessment mapping user preferences to Realistic, Investigative, Artistic, Social, Enterprising, and Conventional archetypes.
- **Work Values Questionnaire**: Evaluates the user's priorities (e.g., Work-Life Balance, Financial Reward, Autonomy, Status, Altruism).
- **Interests & Current Skills Assessment**: Custom interactive interface to check off existing skills (e.g., programming, writing, management) and state general professional interests.
- **Personality Type Alignment**: Short-form psychological modeling matching user traits to ideal work environments.

### 3.2. User Dashboard & Insights
- **DNA Visualization**: Dynamic, interactive visual chart (e.g., radar chart, DNA spiral visualization) depicting the user's profile composition.
- **Top Career Matches**: Curated list of occupations scored by alignment percentage.
- **Career Breakdown Page**: For each match, provide:
  - Role definition and typical day-to-day responsibilities.
  - Salary trends (entry, median, senior levels).
  - Job growth forecast (e.g., Bureau of Labor Statistics trends).
  - Academic, project, and certification requirements.

### 3.3. Skill Gap Analysis & Interactive Roadmap
- **Interactive Gap Comparison**: Visual sidebar or card contrasting the user's current skill profile against the profile required for a target career match.
- **Milestone Generator**: Generates a logical path to bridge the gap.
  - Phase 1: Fundamentals (Core Concepts, Reading Material)
  - Phase 2: Practical Skills & Projects (Hands-on creation)
  - Phase 3: Advanced Specializations & Certifications
- **Actionable Steps**: Each milestone offers specific recommended resources (free and paid courses, tutorials, books).
- **Progress Tracking**: Toggle switch to mark milestones as *Not Started*, *In Progress*, or *Completed*.

### 3.4. ATS Resume Analyzer
- **Resume Upload & Parsing**: Support for PDF/DOCX formats to extract text.
- **ATS Score**: Algorithmic assessment scoring the resume out of 100 based on ATS readability, structure, and keyword density.
- **Keyword Analysis**: Evaluates resume text for the presence, frequency, and placement of industry-relevant target keywords.
- **Resume Formatting Analysis**: Checks for parsing obstacles such as complex multi-column layouts, tables, headers/footers, and non-standard fonts.
- **Missing Skills Detection**: Cross-references the resume content against the user's target career path requirements to flag critical missing hard and soft skills.
- **Resume Improvement Suggestions**: Delivers targeted, actionable recommendations (e.g., phrasing adjustments, impact metric suggestions, section reordering).

### 3.5. AI Interview Preparation
- **Question Categories**: Generates customized lists of interview questions based on the target career role:
  - **HR Questions**: Foundational background, career motivations, and organizational alignment.
  - **Technical Questions**: Deep-dives into role-specific knowledge, tools, programming languages, and problem-solving scenarios.
  - **Behavioral Questions**: Standard STAR-method questions (Situation, Task, Action, Result) measuring soft skills and teamwork.
- **Mock Interview Mode**: Interactive interface mimicking a live interview where users type or speak answers.
- **Interview Score**: Automated evaluation scoring the quality and structure of user responses.
- **Feedback Reports**: Detailed analysis of answers highlighting strengths, grammatical improvements, better action verbs, and model responses for each question.

### 3.6. Certifications Tracker
- **Certificate Management**: Interface for users to add certifications (e.g., AWS, PMP, Google UX) with fields for issuer, issue date, and credential URL/ID.
- **Certificate Score**: An evaluation metric indicating the industry-relevance and strength of each certification relative to the user's target career path.
- **Progress Tracking**: Tracks active certification preparation courses and milestones, updating completion status on the dashboard.

### 3.7. Projects Tracker
- **Project Registration**: Portal to log portfolio projects including descriptions and tech stacks.
- **Link Integration**: Input fields for GitHub repository links and hosted Live Demo URLs.
- **Project Strength Score**: Scoring component evaluating project impact, completeness, tech stack relevance, and GitHub activity (commits, readmes).

### 3.8. CareerDNA Score Engine
- **Final CareerDNA Score (out of 100)**: A consolidated score reflecting the user's general job readiness for their target role, calculated dynamically as a weighted composite of:
  - **Resume Score** (ATS score, formatting, keyword alignment)
  - **Skills Score** (Matches between declared/verified skills and target job requirements)
  - **Projects Score** (Portfolio strength, live links, codebase maturity)
  - **Certifications Score** (Relevance and validity of logged certificates)
  - **Interview Score** (Average score across mock interview sessions)

### 3.9. Job Match Engine
- **Job Match Percentage**: Comparison of the user's combined profile with real or template job descriptions.
- **Role Recommendations**: Custom suggestions recommending alternative roles or sub-specialties based on matching scores.
- **Strengths and Weaknesses Analysis**: Clear breakdown showing which aspects of their profile are assets (e.g., strong certifications, relevant projects) and which are liabilities (e.g., missing skills, low interview scores).

### 3.10. AI Career Counselor / Chatbot
- **Interactive Chat Interface**: Sleek, real-time messaging console.
- **Context-Aware Recommendations**: The chatbot knows the user's assessment profile, CareerDNA score, roadmaps, and resume data.
- **Key Capabilities**:
  - Leverages mock interview results to offer advice.
  - Answers specific domain questions (e.g., "What does a Product Manager do at a B2B SaaS startup vs. a consumer company?").
  - Offers advice on negotiating offers, building portfolios, or finding remote opportunities.

---

## 4. Non-Functional Requirements

### 4.1. Performance & Security
- **Under 2-second Page Loads**: Optimize styling and hydration times using Next.js Server Side Rendering (SSR) and Server Components.
- **Secure Authentication**: End-to-end user authentication with credentials and OAuth providers (Google, GitHub) using secure cookie handling.
- **Data Privacy & Encryption**: Password hashing (bcrypt/argon2), HTTPS communication, and secure handling of user-uploaded resumes (temporary memory stream processing or secure storage buckets with access tokens).

### 4.2. Usability & Aesthetics
- **Aesthetic Premium UI**: Immersive dark mode defaults, harmonized primary accent colors (e.g., electric indigo, emerald teal, slate purple), smooth hover micro-animations, glassmorphism layouts.
- **Responsive Web Design**: Seamless styling adjustments across desktop, tablet, and mobile layouts.
- **Accessibility (a11y)**: WCAG 2.1 AA compliant contrast ratios, appropriate semantic HTML structure, keyboard navigability, and clear focus states.

---

## 5. Success Metrics
- **Completion Rate**: percentage of onboarding users who complete all initial assessment blocks.
- **Engagement (Roadmap)**: Count of weekly milestone updates per active user.
- **AI Utility Score**: User satisfaction rating (thumbs up/down) on AI counselor answers and resume parsing feedback.
- **Platform Retention**: Monthly returning users visiting the dashboard to track goals or consult the AI adviser.
