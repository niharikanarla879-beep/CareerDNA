'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useResume } from '@/lib/resume-context';
import { targetCareers } from '@/lib/constants';
import { 
  ArrowLeft, 
  Map, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  Briefcase, 
  BookOpen, 
  Calendar, 
  Check, 
  Clock, 
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface RoadmapMilestone {
  phase: string;
  title: string;
  duration: string;
  skills: string[];
  course: string;
  certification: string;
  project: string;
  goals: string[];
}

const roadmapTemplates: Record<string, Record<'foundational' | 'intermediate' | 'advanced', RoadmapMilestone[]>> = {
  swe: {
    foundational: [
      {
        phase: '30-day',
        title: 'Core Fundamentals & Syntax',
        duration: 'Weeks 1-4',
        skills: ['JavaScript syntax', 'ES6 features', 'HTML5 semantics', 'CSS Grid & Flexbox', 'Git basics'],
        course: 'JavaScript - The Complete Guide (Udemy)',
        certification: 'FreeCodeCamp Responsive Web Design',
        project: 'Personal landing page portfolio containing responsive layout panels.',
        goals: ['Master array methods and DOM manipulation', 'Version control code repository with Git']
      },
      {
        phase: '90-day',
        title: 'Frontend Frameworks & UI',
        duration: 'Weeks 5-12',
        skills: ['React core concepts', 'React hooks', 'API fetch operations', 'Tailwind styling'],
        course: 'React - The Complete Guide (Udemy)',
        certification: 'Meta Front-End Developer Certificate',
        project: 'Dynamic movie search board fetching API assets.',
        goals: ['Understand component states and props', 'Style clean interfaces using Tailwind']
      },
      {
        phase: '180-day',
        title: 'Full Stack Basics',
        duration: 'Weeks 13-24',
        skills: ['Node.js syntax', 'Express REST API models', 'MongoDB basic queries'],
        course: 'Node.js, Express & MongoDB Bootcamp',
        certification: 'MongoDB Certified Associate Developer',
        project: 'Structured user feedback dashboard showing CRUD database processes.',
        goals: ['Construct secure backend server pathways', 'Link schemas using databases']
      }
    ],
    intermediate: [
      {
        phase: '30-day',
        title: 'Advanced Frontend & State Management',
        duration: 'Weeks 1-4',
        skills: ['TypeScript typings', 'State management (Zustand/Redux)', 'React optimization'],
        course: 'Advanced React & TypeScript (Frontend Masters)',
        certification: 'Meta Advanced React Developer',
        project: 'SaaS task planner workspace with state persistence.',
        goals: ['Strongly type component interfaces', 'Optimize render patterns']
      },
      {
        phase: '90-day',
        title: 'Backend Systems & databases',
        duration: 'Weeks 5-12',
        skills: ['Node.js architecture', 'SQL indexing (PostgreSQL)', 'REST API security (JWT)'],
        course: 'SQL and Relational Databases (Udemy)',
        certification: 'PostgreSQL Associate Certification',
        project: 'E-commerce API with secure authentication, cart cache, and order logs.',
        goals: ['Perform complex database joins', 'Hash user passwords and secure endpoints']
      },
      {
        phase: '180-day',
        title: 'CI/CD & Simple Cloud Deployments',
        duration: 'Weeks 13-24',
        skills: ['Docker containers', 'GitHub Actions automation', 'AWS deployment (EC2)'],
        course: 'Docker and Kubernetes (Jonas Schmedtmann)',
        certification: 'AWS Certified Cloud Practitioner',
        project: 'Containerized API backend deployed to cloud instances behind a reverse proxy.',
        goals: ['Write automated test workflows', 'Publish code images to registries']
      }
    ],
    advanced: [
      {
        phase: '30-day',
        title: 'Microservices & High Scale Design',
        duration: 'Weeks 1-4',
        skills: ['System Design patterns', 'Microservices orchestration', 'GraphQL server paths'],
        course: 'Software Architecture and System Design (ByteByteGo)',
        certification: 'TOGAF Enterprise Architect Foundation',
        project: 'GraphQL backend mesh parsing distributed user data pools.',
        goals: ['Scale system throughput patterns', 'Understand network caches']
      },
      {
        phase: '90-day',
        title: 'Orchestration & Resilient Ops',
        duration: 'Weeks 5-12',
        skills: ['Kubernetes clusters', 'Redis message broker lines', 'Advanced caching'],
        course: 'DevOps: Kubernetes and Advanced AWS',
        certification: 'Certified Kubernetes Administrator (CKA)',
        project: 'High-availability chat server handling 10k+ concurrent WebSockets.',
        goals: ['Configure load balancers and node scaling', 'Implement system failure guards']
      },
      {
        phase: '180-day',
        title: 'Enterprise Architecture & Cloud Scale',
        duration: 'Weeks 13-24',
        skills: ['AWS serverless (Lambda)', 'Terraform Infrastructure-as-code', 'SOC2/GDPR compliance'],
        course: 'AWS DevOps Engineer - Professional (A Cloud Guru)',
        certification: 'AWS Certified Solutions Architect - Professional',
        project: 'Deploy multi-region cloud infrastructure using IaC templates.',
        goals: ['Write automated deployment templates', 'Audit systems for security criteria']
      }
    ]
  },
  frontend: {
    foundational: [
      {
        phase: '30-day',
        title: 'HTML5 Semantics & Responsive Layouts',
        duration: 'Weeks 1-4',
        skills: ['HTML5 semantic elements', 'CSS Grid', 'CSS Flexbox', 'Media Queries'],
        course: 'CSS - The Complete Guide (Udemy)',
        certification: 'FreeCodeCamp Responsive Web Design Certificate',
        project: 'Fully responsive personal developer portfolio website.',
        goals: ['Write clean, standard semantic structures', 'Establish desktop-to-mobile layouts']
      },
      {
        phase: '90-day',
        title: 'Core Javascript & DOM Manipulation',
        duration: 'Weeks 5-12',
        skills: ['JavaScript syntax', 'ES6 array methods', 'Async/Await fetch', 'DOM Event listeners'],
        course: 'Modern JavaScript from the Beginning (Udemy)',
        certification: 'W3Schools JavaScript Developer Certification',
        project: 'Interactive web-based dashboard consuming weather and holiday APIs.',
        goals: ['Fetch and render JSON data dynamically', 'Incorporate UI feedback states']
      },
      {
        phase: '180-day',
        title: 'Introduction to React Frameworks',
        duration: 'Weeks 13-24',
        skills: ['React JSX syntax', 'Component states & props', 'UseEffect lifecycle', 'Tailwind CSS'],
        course: 'React - The Complete Guide (Udemy)',
        certification: 'Meta Front-End Developer Certificate',
        project: 'SaaS style admin panel with customizable dynamic components.',
        goals: ['Deconstruct visual interfaces into React parts', 'Integrate state sync models']
      }
    ],
    intermediate: [
      {
        phase: '30-day',
        title: 'TypeScript for Frontend Developers',
        duration: 'Weeks 1-4',
        skills: ['TypeScript compilation', 'Interface contracts', 'Generic types', 'Type assertions'],
        course: 'TypeScript Masterclass (Frontend Masters)',
        certification: 'Meta Advanced React Course',
        project: 'Strongly-typed task organizer board persistable to LocalStorage.',
        goals: ['Enforce type safety across components', 'Integrate type interfaces for external APIs']
      },
      {
        phase: '90-day',
        title: 'Global State Systems & Routing',
        duration: 'Weeks 5-12',
        skills: ['Zustand management', 'Redux Toolkit structures', 'React Router configurations', 'Custom Hooks'],
        course: 'State Management in Modern React (Frontend Masters)',
        certification: 'Zustand Professional Developer',
        project: 'Collaborative task planner complete with filter indexes and dark mode toggles.',
        goals: ['Avoid prop drilling via global state modules', 'Create secured router boundaries']
      },
      {
        phase: '180-day',
        title: 'Web Performance & Core Web Vitals',
        duration: 'Weeks 13-24',
        skills: ['Lighthouse optimization', 'Lazy loading images', 'Next.js Image components', 'Asset compression'],
        course: 'Web Performance Optimization (Frontend Masters)',
        certification: 'Google UX Design Specialization',
        project: 'High-performance statically generated landing page.',
        goals: ['Achieve 95+ scores on Lighthouse performance reports', 'Audit bundle sizing and asset loading']
      }
    ],
    advanced: [
      {
        phase: '30-day',
        title: 'Design Systems & Storybook Cataloging',
        duration: 'Weeks 1-4',
        skills: ['Figma styles to code', 'Design Tokens', 'Storybook components cataloging', 'Accessibility (WCAG 2.1)'],
        course: 'Design Systems for Developers (Storybook)',
        certification: 'IAAP Web Accessibility Specialist (WAS)',
        project: 'Accessible UI component design system published to NPM registry.',
        goals: ['Publish reusable theme structures', 'Confirm keyboard and screen-reader accessibility']
      },
      {
        phase: '90-day',
        title: 'Next.js App Router & SSR Architectures',
        duration: 'Weeks 5-12',
        skills: ['Next.js App Router', 'Server Components vs Client Components', 'Static Site Generation', 'Incremental Static Regeneration'],
        course: 'Next.js Production Guide (Vercel)',
        certification: 'Vercel Next.js Developer Certification',
        project: 'SEO-optimized e-commerce shop page utilizing SSR and ISR caches.',
        goals: ['Implement backend route endpoints in Next.js', 'Cache network assets efficiently']
      },
      {
        phase: '180-day',
        title: 'Micro-Frontend Architectures & CI/CD Pipelines',
        duration: 'Weeks 13-24',
        skills: ['Webpack Module Federation', 'Dynamic sub-app loading', 'GitHub Actions script setups', 'AWS CloudFront deployment'],
        course: 'Microfrontends Architecture Course (Udemy)',
        certification: 'AWS Certified Cloud Practitioner',
        project: 'Enterprise web portal loading remote federated sub-application grids.',
        goals: ['Configure automated build/deploy script pipelines', 'Host dynamic bundles on cloud CDNs']
      }
    ]
  },
  backend: {
    foundational: [
      {
        phase: '30-day',
        title: 'Backend Logic & Programming Basics',
        duration: 'Weeks 1-4',
        skills: ['Python/Node.js algorithms', 'File I/O operations', 'Error handling', 'Git commands'],
        course: 'Backend Development Fundamentals (Coursera)',
        certification: 'FreeCodeCamp JS Algorithms and Data Structures',
        project: 'Local command line file parsing script.',
        goals: ['Maintain code versioning logs', 'Structure code to catch operational exceptions']
      },
      {
        phase: '90-day',
        title: 'REST API Construction Frameworks',
        duration: 'Weeks 5-12',
        skills: ['Express.js/FastAPI setups', 'HTTP Methods & status codes', 'Router parameters', 'API Testing'],
        course: 'Node.js or Python API Masterclass (Udemy)',
        certification: 'Postman API Foundations Student Certification',
        project: 'Backend booking portal API servicing standard CRUD patterns.',
        goals: ['Author clean API routes validating parameters', 'Produce comprehensive API documentation']
      },
      {
        phase: '180-day',
        title: 'Relational Database Integrations',
        duration: 'Weeks 13-24',
        skills: ['SQL syntax', 'Schema migrations', 'Relational database designs (PostgreSQL)', 'SQL Joins'],
        course: 'SQL and Relational Databases (Udemy)',
        certification: 'PostgreSQL Associate Certification',
        project: 'Social database service linking users, posts, and comments schemas.',
        goals: ['Write database queries utilizing joins', 'Construct and execute database migration scripts']
      }
    ],
    intermediate: [
      {
        phase: '30-day',
        title: 'Authentication, Authorization & Security',
        duration: 'Weeks 1-4',
        skills: ['JWT tokens generation', 'BCrypt password hashing', 'CORS configurations', 'Rate limiting'],
        course: 'Web Security Fundamentals (Pluralsight)',
        certification: 'Certified Secure Software Lifecycle Professional (CSSLP)',
        project: 'Micro-authentication server hosting user signups and authorization checks.',
        goals: ['Hash user credentials safely', 'Block unauthorized path access']
      },
      {
        phase: '90-day',
        title: 'Advanced Query Optimizations & Caching',
        duration: 'Weeks 5-12',
        skills: ['Redis cache integration', 'Database indexes creation', 'Query planners analysis', 'Transaction boundaries'],
        course: 'Redis University - Caching (Redis Lab)',
        certification: 'Redis Certified Developer',
        project: 'High-speed catalog server caching query requests inside Redis.',
        goals: ['Decrease API latencies under 100ms', 'Create optimal indexing tables']
      },
      {
        phase: '180-day',
        title: 'DevOps & Cloud Deployments',
        duration: 'Weeks 13-24',
        skills: ['Docker containers', 'CI/CD runner scripts (GitHub Actions)', 'AWS hosting (EC2/RDS)', 'Nginx configurations'],
        course: 'Docker and CI/CD Pipeline setups (Udemy)',
        certification: 'AWS Certified Cloud Practitioner',
        project: 'Dockerized multi-container app automatically deployable to cloud VMs.',
        goals: ['Build automated test runners', 'Create reliable infrastructure deployments']
      }
    ],
    advanced: [
      {
        phase: '30-day',
        title: 'System Architectures & Message Queues',
        duration: 'Weeks 1-4',
        skills: ['Microservices planning', 'RabbitMQ or Kafka messaging', 'GraphQL schemas', 'gRPC messaging'],
        course: 'Software Architecture and System Design (ByteByteGo)',
        certification: 'TOGAF Enterprise Architect Foundation',
        project: 'Distributed notification engine syncing systems via RabbitMQ.',
        goals: ['Deconstruct backend logic into decoupled nodes', 'Leverage message queues for async processes']
      },
      {
        phase: '90-day',
        title: 'Container Orchestration & Resilient Clustering',
        duration: 'Weeks 5-12',
        skills: ['Kubernetes configurations', 'Pod networking & configurations', 'Load balancers', 'Auto-scaling policies'],
        course: 'Kubernetes Hands-on (CKA Course)',
        certification: 'Certified Kubernetes Administrator (CKA)',
        project: 'Production-ready Kubernetes cluster managing automated pod scaling.',
        goals: ['Deploy node instances across clusters', 'Create self-healing system endpoints']
      },
      {
        phase: '180-day',
        title: 'Cloud Infrastructure-as-code & Serverless',
        duration: 'Weeks 13-24',
        skills: ['Terraform scripts', 'AWS Lambda serverless', 'API Gateway integrations', 'SOC2 auditing'],
        course: 'AWS DevOps Engineer - Professional (A Cloud Guru)',
        certification: 'AWS Certified Solutions Architect - Professional',
        project: 'Serverless backend infrastructure orchestrated using Terraform.',
        goals: ['Deploy multi-region cloud services automatically', 'Audit cloud setups for security compliance']
      }
    ]
  },
  fullstack: {
    foundational: [
      {
        phase: '30-day',
        title: 'Full Stack Basics & Version Control',
        duration: 'Weeks 1-4',
        skills: ['HTML5/CSS3 layouts', 'Git command logs', 'Basic JavaScript', 'Bootstrap layouts'],
        course: 'The Complete Web Developer Course (Udemy)',
        certification: 'FreeCodeCamp Responsive Web Design',
        project: 'Webpage linking static layout panels with simple script loops.',
        goals: ['Track code edits via Git repositories', 'Create responsive mobile-first layouts']
      },
      {
        phase: '90-day',
        title: 'Frontend Frameworks & Express API',
        duration: 'Weeks 5-12',
        skills: ['React components state', 'Express API setup', 'HTTP requests', 'MongoDB schemas'],
        course: 'Full Stack React & Node.js Bootcamp (Udemy)',
        certification: 'Meta Front-End Developer Certificate',
        project: 'Structured todo portal saving listings to a backend database.',
        goals: ['Coordinate API requests across frontend layouts', 'Store records in databases']
      },
      {
        phase: '180-day',
        title: 'Relational Database Integration & CRUD',
        duration: 'Weeks 13-24',
        skills: ['PostgreSQL syntax', 'SQL database connections', 'Full-stack authentication', 'Tailwind CSS styling'],
        course: 'SQL Database Integrations (Udemy)',
        certification: 'PostgreSQL Associate Certification',
        project: 'Blog application where users write, review, and bookmark articles.',
        goals: ['Execute structured table join queries', 'Authenticate user requests safely']
      }
    ],
    intermediate: [
      {
        phase: '30-day',
        title: 'TypeScript & Type-Safe Operations',
        duration: 'Weeks 1-4',
        skills: ['TypeScript configuration', 'Component static types', 'API response typing', 'Form validation'],
        course: 'React & TypeScript Masterclass (Frontend Masters)',
        certification: 'Meta Advanced React Certification',
        project: 'SaaS dashboard utilizing strict TypeScript rules.',
        goals: ['Verify type validity across build steps', 'Filter parameter types inside inputs']
      },
      {
        phase: '90-day',
        title: 'Global States, Security & APIs',
        duration: 'Weeks 5-12',
        skills: ['Redux Toolkit / Zustand', 'JWT authorization', 'Password salting', 'Rate limits configuration'],
        course: 'SaaS Software Security & State (Coursera)',
        certification: 'Certified Secure Software Developer',
        project: 'Real-time messaging application storing encryption hashes in databases.',
        goals: ['Manage application state globally without prop drilling', 'Hash passwords and secure endpoints']
      },
      {
        phase: '180-day',
        title: 'App Containerization & Cloud Launch',
        duration: 'Weeks 13-24',
        skills: ['Docker image creation', 'CI/CD action runners', 'AWS server hosting (EC2)', 'Nginx gateway setups'],
        course: 'Docker and AWS Deployment paths (Udemy)',
        certification: 'AWS Certified Cloud Practitioner',
        project: 'Containerized application launched on AWS EC2 behind a reverse proxy.',
        goals: ['Write automated test pipelines', 'Build and register Docker images']
      }
    ],
    advanced: [
      {
        phase: '30-day',
        title: 'Distributed System Designs & GraphQL',
        duration: 'Weeks 1-4',
        skills: ['GraphQL server setups', 'Apollo client caching', 'Redis caching arrays', 'Websockets routing'],
        course: 'System Design and GraphQL Integration (ByteByteGo)',
        certification: 'AWS Certified Solutions Architect - Associate',
        project: 'GraphQL API routing data from Postgres and Redis nodes.',
        goals: ['Establish low-latency WebSocket interfaces', 'Configure cache layers']
      },
      {
        phase: '90-day',
        title: 'Next.js App Architectures & Serverless',
        duration: 'Weeks 5-12',
        skills: ['Next.js App Router', 'Server Actions', 'AWS Lambda serverless', 'Database pooling'],
        course: 'Next.js Masterclass (Vercel)',
        certification: 'Vercel Certified Next.js Developer',
        project: 'Next.js web portal with instant page loads and serverless logic.',
        goals: ['Deploy Next.js App Router structures', 'Implement server-rendered caching']
      },
      {
        phase: '180-day',
        title: 'Infrastructure-as-Code & Advanced DevOps',
        duration: 'Weeks 13-24',
        skills: ['Terraform scripts', 'Kubernetes clusters', 'SOC2 auditing rules', 'Performance diagnostics'],
        course: 'Infrastructure-as-code & AWS Ops (A Cloud Guru)',
        certification: 'AWS Certified Solutions Architect - Professional',
        project: 'Multi-stage production infrastructure deployment configured in Terraform.',
        goals: ['Orchestrate high-scale load balancing rules', 'Complete system security audits']
      }
    ]
  },
  ai: {
    foundational: [
      {
        phase: '30-day',
        title: 'Python Core & Natural Language Basics',
        duration: 'Weeks 1-4',
        skills: ['Python coding syntax', 'Regex text scanning', 'JSON data cleaning', 'Git command versioning'],
        course: 'Python for AI & Development (Coursera)',
        certification: 'Python Institute Certified Associate (PCEP)',
        project: 'Text analysis parser extracting semantic categories from documentation.',
        goals: ['Extract vocabulary frequencies from text logs', 'Run data checks using Git branches']
      },
      {
        phase: '90-day',
        title: 'LLMs Integration & API Mechanics',
        duration: 'Weeks 5-12',
        skills: ['OpenAI / Anthropic APIs', 'Prompt engineering styles', 'Token budget calculations', 'System parameters (temperature)'],
        course: 'Prompt Engineering for Developers (DeepLearning.AI)',
        certification: 'Google Cloud - Generative AI Fundamentals',
        project: 'Context-aware customer service email responder interface.',
        goals: ['Design robust prompt templates for classification', 'Manage API rate boundaries']
      },
      {
        phase: '180-day',
        title: 'RAG Basics & Vector Indexes',
        duration: 'Weeks 13-24',
        skills: ['Embeddings generation APIs', 'Vector database queries (Pinecone)', 'Text chunking strategies', 'Semantic search'],
        course: 'Semantic Search & RAG Systems (Coursera)',
        certification: 'Pinecone Vector Database Certification',
        project: 'Semantic Q&A search interface scanning local repository directories.',
        goals: ['Store text chunk embeddings in vector databases', 'Retrieve context matching search queries']
      }
    ],
    intermediate: [
      {
        phase: '30-day',
        title: 'LangChain & Agentic Workflows',
        duration: 'Weeks 1-4',
        skills: ['LangChain chains', 'LlamaIndex pipelines', 'Agentic tool configurations', 'Stateful agent loops'],
        course: 'LangChain Masterclass: Build AI Agents (Udemy)',
        certification: 'LangChain Developer Certificate',
        project: 'Autonomous research assistant scanning files and outputting structured tables.',
        goals: ['Create state loops enabling agents to correct errors', 'Inject external tools into model prompts']
      },
      {
        phase: '90-day',
        title: 'Open Source Models & Hugging Face',
        duration: 'Weeks 5-12',
        skills: ['Hugging Face Hub tools', 'Transformers APIs', 'PyTorch fundamentals', 'Model quantization (GGUF/GPTQ)'],
        course: 'Hugging Face NLP Course (Hugging Face)',
        certification: 'NVIDIA Deep Learning Institute Certificate',
        project: 'Classification model hosted locally processing text segments.',
        goals: ['Quantize large models to fit local machines', 'Load open source models via PyTorch APIs']
      },
      {
        phase: '180-day',
        title: 'Advanced RAG & Metadata Filtering',
        duration: 'Weeks 13-24',
        skills: ['Hybrid Search methods', 'Reranking algorithms (Cohere)', 'Metadata database schemas', 'Parent document retrieval'],
        course: 'Advanced RAG Systems (DeepLearning.AI)',
        certification: 'ChromaDB Core Developer Certificate',
        project: 'Enterprise document search routing filters based on user categories.',
        goals: ['Configure metadata filters inside vector databases', 'Rerank context items to increase accuracy']
      }
    ],
    advanced: [
      {
        phase: '30-day',
        title: 'Model Fine-Tuning & Custom Data Training',
        duration: 'Weeks 1-4',
        skills: ['LoRA & QLoRA configurations', 'Supervised Fine-Tuning (SFT)', 'Dataset preparation formats', 'PEFT libraries'],
        course: 'Fine-Tuning LLMs (DeepLearning.AI)',
        certification: 'Google Cloud Professional Machine Learning Engineer',
        project: 'Custom classification assistant trained on proprietary datasets.',
        goals: ['Format domain-specific datasets for model training', 'Evaluate model performance changes']
      },
      {
        phase: '90-day',
        title: 'GenAI MLOps & Production Deployments',
        duration: 'Weeks 5-12',
        skills: ['vLLM inference acceleration', 'Triton Server deployments', 'Docker containerized models', 'Latency metrics logging'],
        course: 'MLOps for Generative AI (Coursera)',
        certification: 'AWS Certified Machine Learning - Specialty',
        project: 'High-throughput, low-latency AI inference backend API.',
        goals: ['Optimize inference latencies using model servers', 'Monitor system load metrics']
      },
      {
        phase: '180-day',
        title: 'Multi-Agent Architectures & Stateful Graphs',
        duration: 'Weeks 13-24',
        skills: ['LangGraph workflows', 'State charts configuration', 'Autogen frameworks', 'Safety guardrails'],
        course: 'Stateful Agent Networks (DeepLearning.AI)',
        certification: 'OpenAI Developer Associate Certificate',
        project: 'Stateful multi-agent system executing product builds and error auditing.',
        goals: ['Coordinate multi-agent operations via state graphs', 'Build automated loops checks']
      }
    ]
  },
  ml: {
    foundational: [
      {
        phase: '30-day',
        title: 'Math Foundations & Python Analytics',
        duration: 'Weeks 1-4',
        skills: ['Linear algebra', 'NumPy operations', 'Pandas dataframes', 'Matplotlib graphs'],
        course: 'Mathematics for Machine Learning (Coursera)',
        certification: 'IBM Data Science Professional Certificate',
        project: 'Exploratory data analysis report parsing retail transaction records.',
        goals: ['Clean data values and process missing inputs', 'Plot correlations across variables']
      },
      {
        phase: '90-day',
        title: 'Supervised Learning & Classifiers',
        duration: 'Weeks 5-12',
        skills: ['Linear/Logistic Regressions', 'Decision Trees algorithms', 'Scikit-Learn modeling', 'Model evaluations (F1-score)'],
        course: 'Machine Learning Specialization (Andrew Ng)',
        certification: 'Stanford Online Machine Learning Certificate',
        project: 'Classification model predicting customer subscription churn.',
        goals: ['Fit classifier models using Scikit-Learn APIs', 'Split records into train/test sets']
      },
      {
        phase: '180-day',
        title: 'Unsupervised Learning & Feature Engineering',
        duration: 'Weeks 13-24',
        skills: ['K-Means clustering', 'PCA dimension reductions', 'Feature scaling metrics', 'One-hot encoding'],
        course: 'Feature Engineering Masterclass (Udemy)',
        certification: 'Google Cloud - ML Fundamentals',
        project: 'Customer segmentation database mapping group categories.',
        goals: ['Reduce features dimension using PCA', 'Cluster data rows using K-Means']
      }
    ],
    intermediate: [
      {
        phase: '30-day',
        title: 'Deep Learning Core & Neural Networks',
        duration: 'Weeks 1-4',
        skills: ['Neural networks layers', 'Backpropagation calculations', 'PyTorch fundamentals', 'TensorFlow structures'],
        course: 'Deep Learning Specialization (Coursera)',
        certification: 'PyTorch Certified Developer',
        project: 'Convolutional neural network classifying image datasets.',
        goals: ['Code forward/backward training passes in PyTorch', 'Configure weight updates']
      },
      {
        phase: '90-day',
        title: 'Natural Language & Sequential Models',
        duration: 'Weeks 5-12',
        skills: ['RNNs & LSTM networks', 'Word embeddings (Word2Vec)', 'Attention mechanisms', 'Transformers basics'],
        course: 'Natural Language Processing Specialization (Coursera)',
        certification: 'NVIDIA Deep Learning Specialist Certificate',
        project: 'LSTM model forecasting sequential sensor anomalies.',
        goals: ['Process text datasets for neural nets', 'Configure sequential attention layers']
      },
      {
        phase: '180-day',
        title: 'MLOps Pipelines & Versioning',
        duration: 'Weeks 13-24',
        skills: ['MLflow tracking', 'DVC data version control', 'Docker containerized environments', 'Pipeline automation (Airflow)'],
        course: 'MLOps: Pipeline Automation (Coursera)',
        certification: 'Databricks Machine Learning Associate',
        project: 'Automated data retraining workflow triggering on new inputs.',
        goals: ['Track model hyperparameters using MLflow', 'Maintain datasets logs using DVC']
      }
    ],
    advanced: [
      {
        phase: '30-day',
        title: 'Large Language Model Fine-Tuning',
        duration: 'Weeks 1-4',
        skills: ['PEFT LoRA parameters', 'Dataset tokenizations', 'Training convergence audits', 'Hugging Face API integrations'],
        course: 'Fine-Tuning Open Source LLMs (DeepLearning.AI)',
        certification: 'AWS Certified Machine Learning - Specialty',
        project: 'Private assistant model fine-tuned on custom support transcripts.',
        goals: ['Configure training losses tracking graphs', 'Minimize GPU memory footprint']
      },
      {
        phase: '90-day',
        title: 'High Performance Inference & Serving',
        duration: 'Weeks 5-12',
        skills: ['Triton Server systems', 'ONNX model exports', 'GPU memory optimizations (CUDA)', 'API integrations'],
        course: 'High Performance ML Architectures (Udemy)',
        certification: 'Databricks Machine Learning Professional',
        project: 'Low-latency prediction microservice handling concurrent inputs.',
        goals: ['Export PyTorch models to ONNX representations', 'Establish concurrency endpoints']
      },
      {
        phase: '180-day',
        title: 'Kubernetes for ML & Auto-scaling',
        duration: 'Weeks 13-24',
        skills: ['Kubeflow setups', 'Kubernetes pod allocations', 'Auto-scaling inference configurations', 'System alerts'],
        course: 'Kubeflow & ML Infrastructure (A Cloud Guru)',
        certification: 'Certified Kubernetes Administrator (CKA)',
        project: 'Scalable model inference cluster deployed to production servers.',
        goals: ['Coordinate multi-pod scale boundaries', 'Monitor container metrics']
      }
    ]
  },
  pm: {
    foundational: [
      {
        phase: '30-day',
        title: 'Product Management Basics & Agile Core',
        duration: 'Weeks 1-4',
        skills: ['Product Lifecycle stages', 'Agile methodologies', 'Jira sprint setups', 'Scrum ceremonies'],
        course: 'Product Management 101 (Udemy)',
        certification: 'Professional Scrum Product Owner I (PSPO I)',
        project: 'Feature roadmap planning sheet outlining sprint estimations.',
        goals: ['Manage and prioritize product backlog items', 'Construct Jira boards with epics']
      },
      {
        phase: '90-day',
        title: 'User Discovery & Interviews',
        duration: 'Weeks 5-12',
        skills: ['User discovery techniques', 'Story mapping layouts', 'Persona configurations', 'Competitor analysis'],
        course: 'User Research & Discovery (Coursera)',
        certification: 'Agile Product Manager Certificate (APM)',
        project: 'Customer discovery report casing user interview answers.',
        goals: ['Conduct user interviews and synthesize insights', 'Map feature proposals against persona profiles']
      },
      {
        phase: '180-day',
        title: 'PRDs & Feature Scopes',
        duration: 'Weeks 13-24',
        skills: ['Product Requirement Documents (PRDs)', 'User acceptance criteria', 'Feature mockups', 'Figma basics'],
        course: 'Product Specifications and Launches (Udemy)',
        certification: 'Pragmatic Institute Certified (Level I)',
        project: 'Complete Product Requirement Document (PRD) detailing a feature release.',
        goals: ['Document engineering instructions for development teams', 'Outline design constraints and user stories']
      }
    ],
    intermediate: [
      {
        phase: '30-day',
        title: 'Product Strategy & Roadmapping',
        duration: 'Weeks 1-4',
        skills: ['North Star metrics', 'Strategic prioritization (RICE)', 'Product roadmapping tools', 'Market strategy'],
        course: 'Product Strategy (Reforge)',
        certification: 'Product School Product Manager Certificate',
        project: '1-year product roadmap diagram linking milestones to company metrics.',
        goals: ['Apply RICE prioritization rules to feature lists', 'Present strategic direction to mock stakeholders']
      },
      {
        phase: '90-day',
        title: 'Data-driven PM & SQL Analytics',
        duration: 'Weeks 5-12',
        skills: ['SQL syntax basics', 'Amplitude / Mixpanel dashboarding', 'A/B testing guidelines', 'Funnel analysis'],
        course: 'Data Analytics for Product Managers (Udemy)',
        certification: 'Amplitude Certified Product Analyst',
        project: 'Conversion funnel report detecting client sign-off blockers.',
        goals: ['Write basic SQL queries extracting cohort records', 'Interpret A/B test results and statistical significance']
      },
      {
        phase: '180-day',
        title: 'Stakeholder Alignment & GTM Strategy',
        duration: 'Weeks 13-24',
        skills: ['Go-to-market strategies', 'Sales enablement materials', 'Conflict resolution', 'Cross-functional alignment'],
        course: 'Product Marketing & GTM (Pragmatic Institute)',
        certification: 'Pragmatic Certified Product Executive',
        project: 'GTM strategy deck presenting launch timelines and training outlines.',
        goals: ['Formulate alignment paths with marketing and support teams', 'Map messaging channels to user groups']
      }
    ],
    advanced: [
      {
        phase: '30-day',
        title: 'Growth Hacking & Funnel Optimizations',
        duration: 'Weeks 1-4',
        skills: ['Conversion rate optimizations', 'Referral loops', 'Retention modeling', 'Cohort diagnostics'],
        course: 'Growth Series (Reforge)',
        certification: 'Growth Product Management (Product School)',
        project: 'Experimentation pipeline document tracking sign-up gains.',
        goals: ['Design viral feedback elements in user interfaces', 'Diagnose drop-off spots across checkout funnels']
      },
      {
        phase: '90-day',
        title: 'Technical PM & API Products',
        duration: 'Weeks 5-12',
        skills: ['API architectures', 'System integrations flowcharts', 'Technical debt management', 'Database schemas basics'],
        course: 'Technical PM Boot Camp (Product School)',
        certification: 'Technical Product Manager Certification',
        project: 'Developer platform API request schemas and documentation.',
        goals: ['Author developer requirements for integrations', 'Evaluate technical complexities with architects']
      },
      {
        phase: '180-day',
        title: 'Product Portfolio & Leadership',
        duration: 'Weeks 13-24',
        skills: ['Product line budgeting', 'Organizational planning', 'Product operations', 'KPI dashboards'],
        course: 'Executive Product Leadership (Pragmatic Institute)',
        certification: 'Pragmatic Certified Executive',
        project: 'Strategic investment report allocation of engineering capital.',
        goals: ['Structure resource configurations across product teams', 'Establish cross-line KPIs']
      }
    ]
  },
  ds: {
    foundational: [
      {
        phase: '30-day',
        title: 'Python Core & Relational SQL',
        duration: 'Weeks 1-4',
        skills: ['Python data structures', 'SQL database queries', 'Data cleaning scripts', 'Git branches logs'],
        course: 'Python & SQL for Data Science (Coursera)',
        certification: 'IBM Data Science Professional Certificate',
        project: 'ETL workflow script query clean records database.',
        goals: ['Write queries selecting entries with group metrics', 'Track script iterations using Git']
      },
      {
        phase: '90-day',
        title: 'Data Wrangling & Libraries Core',
        duration: 'Weeks 5-12',
        skills: ['Pandas syntax', 'NumPy operations', 'Seaborn visualizations', 'Exploratory data analysis'],
        course: 'Data Analysis with Python (Coursera)',
        certification: 'Google Data Analytics Professional Certificate',
        project: 'Exploratory analysis report on market transaction datasets.',
        goals: ['Clean data rows and calculate missing values', 'Render graphs showing trends']
      },
      {
        phase: '180-day',
        title: 'Statistics Core & A/B Testing',
        duration: 'Weeks 13-24',
        skills: ['Probability rules', 'Hypothesis testing', 'A/B test splits', 'Confidence interval bounds'],
        course: 'Statistical Inference Paths (Coursera)',
        certification: 'Duke University Statistics Specialist',
        project: 'Statistical audit analysis verifying experiment results.',
        goals: ['Determine statistical significance of test splits', 'Construct clear statistical reviews']
      }
    ],
    intermediate: [
      {
        phase: '30-day',
        title: 'Machine Learning Core Algorithms',
        duration: 'Weeks 1-4',
        skills: ['Scikit-Learn modeling', 'Linear/Logistic Regression', 'Decision trees Classifier', 'Cross validation'],
        course: 'Machine Learning with Python (Stanford)',
        certification: 'Stanford Online ML Certification',
        project: 'Classification model predicting employee turnover index.',
        goals: ['Evaluate performance using F1-scores', 'Apply regularization to models']
      },
      {
        phase: '90-day',
        title: 'Deep Learning Fundamentals',
        duration: 'Weeks 5-12',
        skills: ['Neural Networks layers', 'PyTorch operations', 'Convolutional layers', 'Model checkpointing'],
        course: 'Deep Learning Specialization (Coursera)',
        certification: 'PyTorch Associate Certification',
        project: 'Neural net classification processing image datasets.',
        goals: ['Write neural network training loops in PyTorch', 'Plot model loss convergence']
      },
      {
        phase: '180-day',
        title: 'Big Data Tools & Distributed Queries',
        duration: 'Weeks 13-24',
        skills: ['PySpark schemas', 'Hadoop database queries', 'Data pipelines creation', 'Data lakes basics'],
        course: 'Big Data Specialization (Coursera)',
        certification: 'Databricks Certified Associate Developer',
        project: 'Distributed PySpark script parsing high-volume web logs.',
        goals: ['Query big data stores using PySpark tables', 'Build data cleaning stages']
      }
    ],
    advanced: [
      {
        phase: '30-day',
        title: 'Advanced Natural Language Processing',
        duration: 'Weeks 1-4',
        skills: ['Transformers models', 'Word tokenizers', 'Hugging Face API usage', 'Text embeddings'],
        course: 'Advanced NLP Workflows (Coursera)',
        certification: 'Google Cloud Professional Data Engineer',
        project: 'Semantic index engine grouping customer feedback logs.',
        goals: ['Fine-tune pre-trained models on document sets', 'Construct semantic search inputs']
      },
      {
        phase: '90-day',
        title: 'Model Deployment & APIs integration',
        duration: 'Weeks 5-12',
        skills: ['FastAPI server structures', 'Docker containerized setups', 'Cloud API deployments', 'Model serialization'],
        course: 'MLOps: Model Deployments (Coursera)',
        certification: 'AWS Certified Machine Learning - Specialty',
        project: 'Dockerized ML endpoint predicting query values.',
        goals: ['Serialize models using joblib or ONNX formats', 'Expose predictions via FastAPI endpoints']
      },
      {
        phase: '180-day',
        title: 'ML Pipelines & Automations',
        duration: 'Weeks 13-24',
        skills: ['Apache Airflow orchestration', 'MLflow metric logging', 'Model drift diagnostics', 'CI/CD pipeline updates'],
        course: 'MLOps: Production Systems (A Cloud Guru)',
        certification: 'Databricks Machine Learning Professional',
        project: 'End-to-end retraining pipeline deployed to cloud endpoints.',
        goals: ['Orchestrate retraining pipelines using Apache Airflow', 'Audit database quality limits']
      }
    ]
  },
  ux: {
    foundational: [
      {
        phase: '30-day',
        title: 'Design Principles & Figma Core',
        duration: 'Weeks 1-4',
        skills: ['Figma tools usage', 'Vector geometries', 'Typography systems', 'Low-fidelity layouts'],
        course: 'Figma UI/UX Masterclass (Udemy)',
        certification: 'Google UX Design Professional Certificate',
        project: 'Low-fidelity wireframe screens mapping checkout flow.',
        goals: ['Draft sitemaps and initial structures', 'Apply layout constraints in Figma']
      },
      {
        phase: '90-day',
        title: 'UX Research & Persona Methods',
        duration: 'Weeks 5-12',
        skills: ['User interview setups', 'User journey mapping', 'Persona setups', 'Competitor audits'],
        course: 'User Experience Research (Coursera)',
        certification: 'Interaction Design Foundation (IxDF) Certification',
        project: 'Research report compiling user behaviors and pain points.',
        goals: ['Synthesize user interviews into personas', 'Document journey checkpoints']
      },
      {
        phase: '180-day',
        title: 'High-Fidelity UI Design & Prototyping',
        duration: 'Weeks 13-24',
        skills: ['High-fidelity templates', 'Figma interactive components', 'Color theory hierarchies', 'CSS layout structures'],
        course: 'UI Design Fundamentals (Udemy)',
        certification: 'IxDF Certified User Experience Specialist',
        project: 'High-fidelity mobile application interactive design catalog.',
        goals: ['Create interactive animations in prototypes', 'Apply accessibility checks to designs']
      }
    ],
    intermediate: [
      {
        phase: '30-day',
        title: 'Design Systems & Libraries Core',
        duration: 'Weeks 1-4',
        skills: ['Figma component libraries', 'Design tokens basics', 'Theme grids setups', 'Responsive layout systems'],
        course: 'Component Libraries & Token setups (Figma)',
        certification: 'IxDF Design Systems Specialist',
        project: 'Custom UI component kit styled in light and dark layouts.',
        goals: ['Construct component sets with auto-layout', 'Build system styles catalog']
      },
      {
        phase: '90-day',
        title: 'Usability Testing & Feedback Audits',
        duration: 'Weeks 5-12',
        skills: ['Usability testing scripts', 'Heuristic reviews', 'NPS / SUS metric calculations', 'User session auditing'],
        course: 'Usability Testing Methodologies (Nielsen Norman Group)',
        certification: 'Nielsen Norman Group UX Certification',
        project: 'Usability review document detailing component bugs.',
        goals: ['Draft testing scripts for user reviews', 'Evaluate accessibility issues']
      },
      {
        phase: '180-day',
        title: 'Information Architecture & Layout flows',
        duration: 'Weeks 13-24',
        skills: ['User flows charts', 'Card sorting analysis', 'Navigation schemas', 'Responsive grid setups'],
        course: 'Information Architecture paths (NN/g)',
        certification: 'NN/g IA Specialization Badge',
        project: 'Restructuring layouts architecture diagram of a system.',
        goals: ['Conduct card sorting exercises to map structures', 'Configure main nav hierarchies']
      }
    ],
    advanced: [
      {
        phase: '30-day',
        title: 'Design Token Configurations & Storybook Handoff',
        duration: 'Weeks 1-4',
        skills: ['Storybook component links', 'Design Tokens export', 'Developer handoff specs', 'HTML/CSS structures'],
        course: 'Advanced Design System Workflows (NN/g)',
        certification: 'NN/g Design System Specialist Certificate',
        project: 'Design token JSON outputs mapping themes to developer branches.',
        goals: ['Publish theme parameters for developers', 'Audit asset compatibility in Storybook']
      },
      {
        phase: '90-day',
        title: 'Product Design & Core Business Goals',
        duration: 'Weeks 5-12',
        skills: ['Business metrics checks', 'KPI alignments', 'Conversion funnel audits', 'A/B test setups'],
        course: 'Product Design Strategy (Reforge)',
        certification: 'Reforge Product Design Specialist Certificate',
        project: 'Strategic interface redesign proposal checking checkout metrics.',
        goals: ['Align product layouts with business metrics', 'Formulate test hypotheses']
      },
      {
        phase: '180-day',
        title: 'Advanced Developer Collaboration & Handoff',
        duration: 'Weeks 13-24',
        skills: ['Zeplin handoff files', 'CSS stylesheet conversions', 'Design specifications guides', 'UI animations specs'],
        course: 'UX/UI Engineering (Interaction Design Foundation)',
        certification: 'IxDF Certified Senior UX Practitioner',
        project: 'Complete design specs portfolio pack ready for build.',
        goals: ['Write detailed hover, focus, and error guidelines', 'Perform visual alignment reviews']
      }
    ]
  },
  da: {
    foundational: [
      {
        phase: '30-day',
        title: 'Spreadsheets & Core Formulas',
        duration: 'Weeks 1-4',
        skills: ['Excel Pivot Tables', 'VLOOKUP/INDEX-MATCH', 'Logical formulas', 'Chart configurations'],
        course: 'Excel for Data Analysis (Udemy)',
        certification: 'Microsoft Excel Specialist Certification',
        project: 'Sales dashboard spreadsheet checking performance indicators.',
        goals: ['Clean data columns and calculate metrics', 'Plot metrics trend graphs']
      },
      {
        phase: '90-day',
        title: 'SQL database Queries & Filters',
        duration: 'Weeks 5-12',
        skills: ['SQL SELECT statements', 'Table JOINs syntax', 'Data aggregations queries', 'Subqueries'],
        course: 'SQL for Analytics (Coursera)',
        certification: 'Google Data Analytics Certificate',
        project: 'SQL query scripts extracting metric records.',
        goals: ['Join relational database tables', 'Calculate group stats using SQL filters']
      },
      {
        phase: '180-day',
        title: 'BI Tools & Visual Dashboards',
        duration: 'Weeks 13-24',
        skills: ['Tableau visualizations', 'Power BI connections', 'Visual layout design', 'Interactive filters'],
        course: 'Tableau Fundamentals Course (Tableau)',
        certification: 'Tableau Desktop Specialist Certification',
        project: 'Interactive Business intelligence dashboard tracking KPIs.',
        goals: ['Connect data files to BI systems', 'Build interactive filtering boards']
      }
    ],
    intermediate: [
      {
        phase: '30-day',
        title: 'Python for Data Analysis',
        duration: 'Weeks 1-4',
        skills: ['Python coding basic', 'Pandas dataframes', 'Matplotlib plots', 'Data import scripts'],
        course: 'Python Data Analysis Masterclass (Coursera)',
        certification: 'IBM Data Analyst Certification',
        project: 'Pandas Jupyter notebook parsing store log records.',
        goals: ['Load CSV files and index data arrays', 'Plot statistics trends using Matplotlib']
      },
      {
        phase: '90-day',
        title: 'Advanced SQL & ETL Processes',
        duration: 'Weeks 5-12',
        skills: ['SQL Window functions', 'Common Table Expressions (CTEs)', 'ETL pipelines setups', 'Data warehouses basics'],
        course: 'Advanced SQL Analytics (Udemy)',
        certification: 'Microsoft Certified: Power BI Data Analyst Associate',
        project: 'ETL workflow mapping dataset tables into warehouses.',
        goals: ['Write complex SQL statements utilizing window functions', 'Set up automated ETL script pipelines']
      },
      {
        phase: '180-day',
        title: 'Business Performance Metrics & Analytics',
        duration: 'Weeks 13-24',
        skills: ['KPI definition models', 'Cohort retention analysis', 'Margin tracking', 'Funnel drop-off metrics'],
        course: 'Business Analytics specialization (Coursera)',
        certification: 'Google Advanced Data Analytics Certificate',
        project: 'Cohort retention report tracking customer margin indexes.',
        goals: ['Analyze subscription cohort changes', 'Present metrics recommendations']
      }
    ],
    advanced: [
      {
        phase: '30-day',
        title: 'Practical Statistics & Predictions',
        duration: 'Weeks 1-4',
        skills: ['Correlation diagnostics', 'Hypothesis testing rules', 'Linear regression models', 'Probability analysis'],
        course: 'Practical Statistics for Data Analysts (Udemy)',
        certification: 'SAS Certified Statistical Business Analyst',
        project: 'Regression analysis model testing store metrics relations.',
        goals: ['Verify statistical parameters inside test outcomes', 'Construct correlation matrices']
      },
      {
        phase: '90-day',
        title: 'Report Automation & Script Scheduling',
        duration: 'Weeks 5-12',
        skills: ['Python scripting automations', 'Cron job schedules', 'Email API integrations', 'Data sync scripts'],
        course: 'Automation in Modern Analytics (Coursera)',
        certification: 'Google Cloud Certified Data Analyst',
        project: 'Automated script emailing PDF metrics reports daily.',
        goals: ['Write scripts sending emails with analytics files', 'Schedule script triggers using cron rules']
      },
      {
        phase: '180-day',
        title: 'Cloud Warehouses & High Scale SQL',
        duration: 'Weeks 13-24',
        skills: ['Snowflake warehouse operations', 'Google BigQuery setups', 'Query diagnostics', 'Schema optimizations'],
        course: 'Cloud Data Warehousing Paths (Udemy)',
        certification: 'SnowPro Core Certification',
        project: 'Snowflake analytics catalog optimizing high-volume queries.',
        goals: ['Tune slow SQL queries inside cloud warehouses', 'Model schemas for high scale analytics']
      }
    ]
  }
};


export default function Roadmaps() {
  const { user } = useAuth();
  const { latestResume, targetCareerId, setTargetCareerId, roadmapProgress, toggleRoadmapStep } = useResume();
  const completedSteps = roadmapProgress;
  const toggleStep = toggleRoadmapStep;
  const [activeRoadmap, setActiveRoadmap] = useState<RoadmapMilestone[]>([]);

  const targetCareer = targetCareerId || 'swe';
  const resumeScore = latestResume ? latestResume.result.score : 0;

  const roadmapDifficulty = useMemo(() => {
    if (resumeScore >= 80) return 'advanced';
    if (resumeScore >= 50) return 'intermediate';
    return 'foundational';
  }, [resumeScore]);

  // Regenerate/load roadmap milestones whenever targetCareer or difficulty changes
  useEffect(() => {
    const templates = roadmapTemplates[targetCareer] || roadmapTemplates['swe'];
    const activeTemplates = templates[roadmapDifficulty];

    setActiveRoadmap(activeTemplates);

    // Save active roadmap overview safely under history list
    if (user) {
      try {
        const historyRaw = localStorage.getItem(`careerdna_roadmaps_history_${user.id}`);
        let history = [];
        if (historyRaw) {
          const parsed = JSON.parse(historyRaw);
          if (Array.isArray(parsed)) {
            history = parsed;
          }
        }
        const isDuplicate = history.some((item: any) => item.roleId === targetCareer && item.difficulty === roadmapDifficulty);
        
        if (!isDuplicate) {
          const newItem = {
            timestamp: new Date().toISOString(),
            roleId: targetCareer,
            difficulty: roadmapDifficulty,
            milestones: activeTemplates
          };
          localStorage.setItem(`careerdna_roadmaps_history_${user.id}`, JSON.stringify([newItem, ...history]));
        }
      } catch (e) {
        console.error('Error saving roadmap history safely:', e);
      }
    }
  }, [targetCareer, roadmapDifficulty, user]);

  const handleCareerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTargetCareerId(e.target.value);
  };

  if (!user) return null;

  if (!latestResume) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-smooth font-semibold mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Map className="h-6 w-6 text-indigo-400" /> Learning Roadmaps
            </h1>
          </div>
        </div>

        <div className="glass-panel border-indigo-500/10 rounded-3xl p-8 text-center max-w-lg mx-auto my-12 space-y-6 flex flex-col items-center justify-center min-h-[300px]">
          <div className="h-16 w-16 rounded-2xl bg-indigo-500/5 border border-indigo-500/15 flex items-center justify-center text-indigo-400 shadow-lg">
            <AlertTriangle className="h-8 w-8 text-amber-400" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white text-lg">No Active Resume Found</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              Please upload a resume first in the ATS Resume Analyzer to formulate a customized roadmap progression path.
            </p>
          </div>
          <Link
            href="/dashboard/resume-analyzer"
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/15 transition-smooth"
          >
            Go to Resume Analyzer
          </Link>
        </div>
      </div>
    );
  }

  // Calculate completion stats
  const totalSteps = activeRoadmap.length * 3; // 3 core parts per phase: Course, Cert, Project
  let completedCount = 0;
  activeRoadmap.forEach((m, idx) => {
    if (completedSteps[`${targetCareer}_${roadmapDifficulty}_${idx}_course`]) completedCount++;
    if (completedSteps[`${targetCareer}_${roadmapDifficulty}_${idx}_cert`]) completedCount++;
    if (completedSteps[`${targetCareer}_${roadmapDifficulty}_${idx}_project`]) completedCount++;
  });
  const completionPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header breadcrumb bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-smooth font-semibold mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Map className="h-6 w-6 text-indigo-400" /> Learning Roadmaps
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Personalized learning paths tailored to your current resume score of <strong className="text-indigo-400">{resumeScore}%</strong>.
          </p>
        </div>

        {/* Selected target role */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950/60 p-2 border border-slate-900 rounded-xl text-xs">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider pl-1 shrink-0">Difficulty</span>
            <span className="px-2 py-0.5 rounded font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wide">
              {roadmapDifficulty}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/60 p-2 border border-slate-900 rounded-xl text-xs">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider pl-1 shrink-0">Target Profile</span>
            <select 
              value={targetCareer}
              onChange={handleCareerChange}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs font-bold text-white outline-none cursor-pointer focus:border-indigo-500 transition-smooth"
            >
              {targetCareers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
        {/* ROADMAP TIMELINE TIMINGS */}
        <div className="lg:col-span-8 space-y-8">
          {activeRoadmap.map((m, idx) => (
            <div key={idx} className="relative flex gap-6">
              {/* Timeline dot bar */}
              <div className="flex flex-col items-center shrink-0">
                <div className="h-8 w-8 rounded-full bg-slate-950 border-2 border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400 shadow-md">
                  {idx + 1}
                </div>
                {idx < activeRoadmap.length - 1 && (
                  <div className="w-0.5 bg-gradient-to-b from-indigo-500/30 to-indigo-500/5 flex-1 my-2" />
                )}
              </div>

              {/* Roadmap Milestone Details */}
              <div className="glass-panel border-slate-900 rounded-3xl p-6 space-y-4 flex-1">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block font-mono">
                      {m.phase} — {m.duration}
                    </span>
                    <h3 className="font-bold text-white text-base mt-0.5">{m.title}</h3>
                  </div>
                  
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-900 border border-slate-800 text-slate-400 uppercase tracking-wide">
                    {completedCount >= (idx + 1) * 3 ? 'Completed' : 'In Progress'}
                  </span>
                </div>

                {/* Subtasks checklist */}
                <div className="space-y-3 pt-2">
                  {/* Step 1: Course */}
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-900 hover:border-slate-800 transition-smooth">
                    <button 
                      type="button"
                      onClick={() => toggleStep(`${targetCareer}_${roadmapDifficulty}_${idx}_course`)}
                      className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-smooth cursor-pointer ${
                        completedSteps[`${targetCareer}_${roadmapDifficulty}_${idx}_course`]
                          ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                          : 'border-slate-800 hover:border-indigo-500/60'
                      }`}
                    >
                      {completedSteps[`${targetCareer}_${roadmapDifficulty}_${idx}_course`] && <Check className="h-3 w-3 stroke-[3]" />}
                    </button>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" /> Tutorial / Course
                      </span>
                      <p className="text-xs font-bold text-slate-200 truncate">{m.course}</p>
                    </div>
                  </div>

                  {/* Step 2: Certification */}
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-900 hover:border-slate-800 transition-smooth">
                    <button 
                      type="button"
                      onClick={() => toggleStep(`${targetCareer}_${roadmapDifficulty}_${idx}_cert`)}
                      className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-smooth cursor-pointer ${
                        completedSteps[`${targetCareer}_${roadmapDifficulty}_${idx}_cert`]
                          ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                          : 'border-slate-800 hover:border-indigo-500/60'
                      }`}
                    >
                      {completedSteps[`${targetCareer}_${roadmapDifficulty}_${idx}_cert`] && <Check className="h-3 w-3 stroke-[3]" />}
                    </button>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Award className="h-3.5 w-3.5" /> Certification Objective
                      </span>
                      <p className="text-xs font-bold text-slate-200 truncate">{m.certification}</p>
                    </div>
                  </div>

                  {/* Step 3: Project */}
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-900 hover:border-slate-800 transition-smooth">
                    <button 
                      type="button"
                      onClick={() => toggleStep(`${targetCareer}_${roadmapDifficulty}_${idx}_project`)}
                      className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-smooth cursor-pointer ${
                        completedSteps[`${targetCareer}_${roadmapDifficulty}_${idx}_project`]
                          ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                          : 'border-slate-800 hover:border-indigo-500/60'
                      }`}
                    >
                      {completedSteps[`${targetCareer}_${roadmapDifficulty}_${idx}_project`] && <Check className="h-3 w-3 stroke-[3]" />}
                    </button>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5" /> Hands-on Project
                      </span>
                      <p className="text-xs font-bold text-slate-200 leading-normal">{m.project}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ROADMAP PROGRESS METRICS SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
          {/* Progress gauge */}
          <div className="glass-panel border-slate-900 rounded-3xl p-6 flex flex-col items-center text-center space-y-4">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Roadmap Progress</span>
            
            <div className="relative h-28 w-28 flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-full h-full stroke-slate-800 fill-none stroke-[2.5]">
                {/* Background path */}
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                {/* Completion path */}
                <path 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  className="stroke-indigo-500 stroke-[2.5] transition-all duration-1000"
                  strokeDasharray={`${completionPercent}, 100`}
                />
              </svg>
              <span className="absolute text-xl font-extrabold text-white">{completionPercent}%</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed px-2">
              Mark courses, certifications, and portfolio projects as complete to build out your profile strength.
            </p>
          </div>

          {/* Profile Insights panel */}
          <div className="glass-panel border-slate-900 bg-slate-950/40 rounded-3xl p-6 space-y-4">
            <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-indigo-400" /> Progression Track
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              We personalize this progression blueprint. By mastering these competencies, you systematically address skills requirements identified in your target profile matching matrices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
