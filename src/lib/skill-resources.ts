export interface LearningResource {
  title: string;
  provider: 'YouTube' | 'Coursera' | 'Udemy' | 'freeCodeCamp' | 'Roadmap.sh' | 'GeeksforGeeks' | 'Official Documentation';
  url: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  qualityScore: number; // e.g. 4.8
  isFree: boolean;
  duration?: string;
}

export interface SkillPathway {
  whyItMatters: string;
  priorityScore: number;
  estimatedHours: number;
  readinessImpact: number;
  beginnerProject: string;
  intermediateProject: string;
  advancedProject: string;
  resources: LearningResource[];
}

export const comprehensiveSkillPathways: Record<string, SkillPathway> = {
  'React': {
    whyItMatters: 'React is the dominant frontend framework powering single-page applications. It handles visual interfaces and dynamic client state.',
    priorityScore: 95,
    estimatedHours: 40,
    readinessImpact: 12,
    beginnerProject: 'Interactive Todo list with filter tabs and local storage backups.',
    intermediateProject: 'SaaS Dashboard showcasing responsive grid tiles, custom SVG maps, and state updates.',
    advancedProject: 'Collaboration canvas editor workspace utilizing websockets and optimistic state models.',
    resources: [
      { title: 'React Tutorial for Beginners', provider: 'YouTube', url: 'https://www.youtube.com/watch?v=SqcY0GlE17s', difficulty: 'Beginner', qualityScore: 4.8, isFree: true, duration: '2 Hours' },
      { title: 'Front-End Developer Professional Certificate (Meta)', provider: 'Coursera', url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer', difficulty: 'Intermediate', qualityScore: 4.7, isFree: false, duration: '3 Months' },
      { title: 'React - The Complete Guide', provider: 'Udemy', url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/', difficulty: 'Intermediate', qualityScore: 4.8, isFree: false, duration: '40 Hours' },
      { title: 'Learn React - Full Course for Beginners', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/news/free-react-course-2024/', difficulty: 'Beginner', qualityScore: 4.9, isFree: true, duration: '11 Hours' },
      { title: 'React Roadmap Guide', provider: 'Roadmap.sh', url: 'https://roadmap.sh/react', difficulty: 'Beginner', qualityScore: 4.9, isFree: true, duration: 'Self-paced' },
      { title: 'ReactJS Tutorials Checklist', provider: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/reactjs-tutorials/', difficulty: 'Beginner', qualityScore: 4.5, isFree: true, duration: 'Self-paced' },
      { title: 'Official React Documentation', provider: 'Official Documentation', url: 'https://react.dev', difficulty: 'Advanced', qualityScore: 5.0, isFree: true, duration: 'Self-paced' }
    ]
  },
  'Node.js': {
    whyItMatters: 'Node.js enables JavaScript execution on servers. It powers backend REST APIs, web socket networks, and database query streams.',
    priorityScore: 92,
    estimatedHours: 45,
    readinessImpact: 10,
    beginnerProject: 'CLI script managing local JSON database operations.',
    intermediateProject: 'E-commerce API with rate limits, token security, and schema validations.',
    advancedProject: 'Microservices gateway with JWT auth proxying to localized service nodes.',
    resources: [
      { title: 'Node.js Tutorial for Beginners', provider: 'YouTube', url: 'https://www.youtube.com/watch?v=TlB_eWDSMt4', difficulty: 'Beginner', qualityScore: 4.8, isFree: true, duration: '1 Hour' },
      { title: 'Server-side Development with NodeJS', provider: 'Coursera', url: 'https://www.coursera.org/learn/server-side-nodejs', difficulty: 'Intermediate', qualityScore: 4.6, isFree: false, duration: '20 Hours' },
      { title: 'Node.js, Express, MongoDB Bootcamp', provider: 'Udemy', url: 'https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/', difficulty: 'Intermediate', qualityScore: 4.8, isFree: false, duration: '42 Hours' },
      { title: 'Learn Node.js and Express - Course', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/news/free-node-js-course/', difficulty: 'Beginner', qualityScore: 4.7, isFree: true, duration: '8 Hours' },
      { title: 'Backend Developer Roadmap', provider: 'Roadmap.sh', url: 'https://roadmap.sh/backend', difficulty: 'Beginner', qualityScore: 4.9, isFree: true, duration: 'Self-paced' },
      { title: 'Node.js Tutorial Guide', provider: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/nodejs/', difficulty: 'Beginner', qualityScore: 4.4, isFree: true, duration: 'Self-paced' },
      { title: 'Official Node.js Docs', provider: 'Official Documentation', url: 'https://nodejs.org/en/docs/', difficulty: 'Advanced', qualityScore: 4.9, isFree: true, duration: 'Self-paced' }
    ]
  },
  'TypeScript': {
    whyItMatters: 'TypeScript adds typed definitions to JavaScript, eliminating compile bugs, standardizing parameters, and aiding team refactors.',
    priorityScore: 88,
    estimatedHours: 25,
    readinessImpact: 8,
    beginnerProject: 'Typed mathematical algorithms and validation check libraries.',
    intermediateProject: 'Strictly-typed state manager for task boards.',
    advancedProject: 'ORM schema compiler generating typed queries for PostgreSQL.',
    resources: [
      { title: 'TypeScript Tutorial for Beginners', provider: 'YouTube', url: 'https://www.youtube.com/watch?v=d56mG7DezGs', difficulty: 'Beginner', qualityScore: 4.8, isFree: true, duration: '1.5 Hours' },
      { title: 'TypeScript for Web Development', provider: 'Coursera', url: 'https://www.coursera.org/projects/typescript-web-development', difficulty: 'Intermediate', qualityScore: 4.5, isFree: false, duration: '2 Hours' },
      { title: 'Understanding TypeScript', provider: 'Udemy', url: 'https://www.udemy.com/course/understanding-typescript/', difficulty: 'Intermediate', qualityScore: 4.7, isFree: false, duration: '15 Hours' },
      { title: 'TypeScript Course for Beginners', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/news/learn-typescript-complete-course/', difficulty: 'Beginner', qualityScore: 4.8, isFree: true, duration: '4 Hours' },
      { title: 'TypeScript Roadmap Guide', provider: 'Roadmap.sh', url: 'https://roadmap.sh/typescript', difficulty: 'Beginner', qualityScore: 4.9, isFree: true, duration: 'Self-paced' },
      { title: 'TypeScript Tutorial Index', provider: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/typescript/', difficulty: 'Beginner', qualityScore: 4.4, isFree: true, duration: 'Self-paced' },
      { title: 'Official TypeScript Handbook', provider: 'Official Documentation', url: 'https://www.typescriptlang.org/docs/', difficulty: 'Advanced', qualityScore: 5.0, isFree: true, duration: 'Self-paced' }
    ]
  },
  'SQL': {
    whyItMatters: 'SQL is the global language for querying databases. Essential for retrieving company metrics, joins, and indexing schemas.',
    priorityScore: 90,
    estimatedHours: 30,
    readinessImpact: 10,
    beginnerProject: 'Local SQLite database managing employee directories.',
    intermediateProject: 'Complex store queries implementing joins, aggregates, and subqueries.',
    advancedProject: 'Optimized index table structuring resolving 1M+ query bottlenecks.',
    resources: [
      { title: 'SQL Tutorial for Beginners', provider: 'YouTube', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', difficulty: 'Beginner', qualityScore: 4.8, isFree: true, duration: '4 Hours' },
      { title: 'SQL for Data Science (UC Davis)', provider: 'Coursera', url: 'https://www.coursera.org/learn/sql-for-data-science', difficulty: 'Beginner', qualityScore: 4.6, isFree: false, duration: '14 Hours' },
      { title: 'The Complete SQL Bootcamp', provider: 'Udemy', url: 'https://www.udemy.com/course/the-complete-sql-bootcamp/', difficulty: 'Intermediate', qualityScore: 4.7, isFree: false, duration: '9 Hours' },
      { title: 'SQL and Databases - Complete Course', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/news/sql-and-databases-full-course/', difficulty: 'Beginner', qualityScore: 4.8, isFree: true, duration: '4 Hours' },
      { title: 'PostgreSQL Roadmap Guide', provider: 'Roadmap.sh', url: 'https://roadmap.sh/postgresql', difficulty: 'Beginner', qualityScore: 4.8, isFree: true, duration: 'Self-paced' },
      { title: 'SQL Tutorial Handbook', provider: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/sql-tutorial/', difficulty: 'Beginner', qualityScore: 4.5, isFree: true, duration: 'Self-paced' },
      { title: 'PostgreSQL Official Docs', provider: 'Official Documentation', url: 'https://www.postgresql.org/docs/', difficulty: 'Advanced', qualityScore: 4.9, isFree: true, duration: 'Self-paced' }
    ]
  },
  'AWS': {
    whyItMatters: 'Amazon Web Services is the largest cloud provider. Required for deploying SaaS servers, databases, and microservices.',
    priorityScore: 85,
    estimatedHours: 50,
    readinessImpact: 10,
    beginnerProject: 'Host a static portfolio page on S3 behind CloudFront.',
    intermediateProject: 'Deploy an Express backend on EC2 with RDS database layers.',
    advancedProject: 'Serverless backend stack on Lambda using API Gateway and DynamoDB.',
    resources: [
      { title: 'AWS Certified Cloud Practitioner Course', provider: 'YouTube', url: 'https://www.youtube.com/watch?v=SOTamWGuqXs', difficulty: 'Beginner', qualityScore: 4.8, isFree: true, duration: '13 Hours' },
      { title: 'AWS Cloud Solutions Architect Specialization', provider: 'Coursera', url: 'https://www.coursera.org/specializations/aws-cloud-solutions-architect', difficulty: 'Intermediate', qualityScore: 4.7, isFree: false, duration: '4 Months' },
      { title: 'AWS Certified Solutions Architect Associate', provider: 'Udemy', url: 'https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/', difficulty: 'Intermediate', qualityScore: 4.8, isFree: false, duration: '27 Hours' },
      { title: 'AWS Solutions Architect SAA-C03 Course', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/news/aws-certified-solutions-architect-associate-study-course/', difficulty: 'Intermediate', qualityScore: 4.9, isFree: true, duration: '30 Hours' },
      { title: 'AWS Cloud Roadmap', provider: 'Roadmap.sh', url: 'https://roadmap.sh/aws', difficulty: 'Beginner', qualityScore: 4.9, isFree: true, duration: 'Self-paced' },
      { title: 'AWS Tutorial Guide', provider: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/aws-tutorial/', difficulty: 'Beginner', qualityScore: 4.5, isFree: true, duration: 'Self-paced' },
      { title: 'Official AWS Documentation', provider: 'Official Documentation', url: 'https://docs.aws.amazon.com/', difficulty: 'Advanced', qualityScore: 5.0, isFree: true, duration: 'Self-paced' }
    ]
  },
  'Docker': {
    whyItMatters: 'Docker containerizes code blocks so applications deploy identically across developer sandboxes and live cloud hosts.',
    priorityScore: 80,
    estimatedHours: 20,
    readinessImpact: 8,
    beginnerProject: 'Containerize a basic Node.js backend using a Dockerfile.',
    intermediateProject: 'Multi-container network compiling web nodes and database assets with Docker Compose.',
    advancedProject: 'Production compose setup featuring load balancers, database replica slots, and config vaults.',
    resources: [
      { title: 'Docker Tutorial for Beginners', provider: 'YouTube', url: 'https://www.youtube.com/watch?v=pTFZFxd4hOI', difficulty: 'Beginner', qualityScore: 4.8, isFree: true, duration: '2 Hours' },
      { title: 'Docker for Beginners (Guided Project)', provider: 'Coursera', url: 'https://www.coursera.org/projects/docker-beginners', difficulty: 'Beginner', qualityScore: 4.5, isFree: false, duration: '2 Hours' },
      { title: 'Docker and Kubernetes: The Complete Guide', provider: 'Udemy', url: 'https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/', difficulty: 'Intermediate', qualityScore: 4.8, isFree: false, duration: '22 Hours' },
      { title: 'Docker Course for Beginners', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/news/learn-docker-complete-course/', difficulty: 'Beginner', qualityScore: 4.7, isFree: true, duration: '4 Hours' },
      { title: 'Docker Roadmap Checklist', provider: 'Roadmap.sh', url: 'https://roadmap.sh/docker', difficulty: 'Beginner', qualityScore: 4.8, isFree: true, duration: 'Self-paced' },
      { title: 'Docker Tutorial Index', provider: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/docker/', difficulty: 'Beginner', qualityScore: 4.4, isFree: true, duration: 'Self-paced' },
      { title: 'Official Docker Reference Docs', provider: 'Official Documentation', url: 'https://docs.docker.com/', difficulty: 'Advanced', qualityScore: 4.9, isFree: true, duration: 'Self-paced' }
    ]
  },
  'System Design': {
    whyItMatters: 'System Design covers the architecture of scalable distributed systems. Needed to build robust databases and prevent latency outages.',
    priorityScore: 90,
    estimatedHours: 60,
    readinessImpact: 14,
    beginnerProject: 'Design diagram schema mapping three-tier web application servers.',
    intermediateProject: 'Architect a chat system layout supporting 10,000 active users with load balancers.',
    advancedProject: 'Design a distributed video streaming platform handling millions of daily uploads and cache distributions.',
    resources: [
      { title: 'System Design for Beginners', provider: 'YouTube', url: 'https://www.youtube.com/watch?v=i53Gi_K397I', difficulty: 'Beginner', qualityScore: 4.9, isFree: true, duration: '1 Hour' },
      { title: 'Software Design and Architecture', provider: 'Coursera', url: 'https://www.coursera.org/specializations/software-design-architecture', difficulty: 'Intermediate', qualityScore: 4.6, isFree: false, duration: '4 Months' },
      { title: 'Pragmatic System Design', provider: 'Udemy', url: 'https://www.udemy.com/course/pragmatic-system-design/', difficulty: 'Intermediate', qualityScore: 4.7, isFree: false, duration: '10 Hours' },
      { title: 'System Design Course for Developers', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/news/systems-design-course/', difficulty: 'Intermediate', qualityScore: 4.8, isFree: true, duration: '5 Hours' },
      { title: 'System Design Roadmap', provider: 'Roadmap.sh', url: 'https://roadmap.sh/system-design', difficulty: 'Advanced', qualityScore: 4.9, isFree: true, duration: 'Self-paced' },
      { title: 'System Design Tutorial Guide', provider: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/system-design-tutorial/', difficulty: 'Intermediate', qualityScore: 4.5, isFree: true, duration: 'Self-paced' },
      { title: 'System Design Primer Repository', provider: 'Official Documentation', url: 'https://github.com/donnemartin/system-design-primer', difficulty: 'Advanced', qualityScore: 5.0, isFree: true, duration: 'Self-paced' }
    ]
  },
  'Python': {
    whyItMatters: 'Python is the core language for Data Science, Machine Learning, and AI. Its syntax is clean and optimized for data libraries.',
    priorityScore: 95,
    estimatedHours: 30,
    readinessImpact: 12,
    beginnerProject: 'CLI math calculators and structured text parsing scripts.',
    intermediateProject: 'Local directory file manager storing parsed data inside SQL tables.',
    advancedProject: 'REST API wrapper service compiling custom machine learning model classifications.',
    resources: [
      { title: 'Python Tutorial for Beginners', provider: 'YouTube', url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc', difficulty: 'Beginner', qualityScore: 4.8, isFree: true, duration: '6 Hours' },
      { title: 'Python for Everybody Specialization', provider: 'Coursera', url: 'https://www.coursera.org/specializations/python', difficulty: 'Beginner', qualityScore: 4.8, isFree: false, duration: '3 Months' },
      { title: '100 Days of Code: Complete Python Bootcamp', provider: 'Udemy', url: 'https://www.udemy.com/course/100-days-of-code/', difficulty: 'Intermediate', qualityScore: 4.7, isFree: false, duration: '100 Hours' },
      { title: 'Learn Python - Full Course for Beginners', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/news/learn-python-full-course/', difficulty: 'Beginner', qualityScore: 4.8, isFree: true, duration: '4 Hours' },
      { title: 'Python Developer Roadmap', provider: 'Roadmap.sh', url: 'https://roadmap.sh/python', difficulty: 'Beginner', qualityScore: 4.9, isFree: true, duration: 'Self-paced' },
      { title: 'Python Programming Language Guide', provider: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/python-programming-language/', difficulty: 'Beginner', qualityScore: 4.5, isFree: true, duration: 'Self-paced' },
      { title: 'Official Python Documentation', provider: 'Official Documentation', url: 'https://docs.python.org/3/', difficulty: 'Advanced', qualityScore: 4.9, isFree: true, duration: 'Self-paced' }
    ]
  },
  'LLMs': {
    whyItMatters: 'Large Language Models power AI agents. Crucial to understand fine-tuning, embeddings, and prompt structures.',
    priorityScore: 90,
    estimatedHours: 35,
    readinessImpact: 10,
    beginnerProject: 'API interface wrapper calling OpenAI model checkpoints.',
    intermediateProject: 'Prompt testing sandbox evaluating accuracy variations across models.',
    advancedProject: 'Fine-tuned LLM classifier deploying custom dataset criteria.',
    resources: [
      { title: 'Generative AI with Large Language Models Course', provider: 'YouTube', url: 'https://www.youtube.com/watch?v=U3dGsnE7l3c', difficulty: 'Beginner', qualityScore: 4.7, isFree: true, duration: '2 Hours' },
      { title: 'Generative AI with LLMs', provider: 'Coursera', url: 'https://www.coursera.org/learn/generative-ai-with-llms', difficulty: 'Intermediate', qualityScore: 4.8, isFree: false, duration: '30 Hours' },
      { title: 'Generative AI & LLM Bootcamp', provider: 'Udemy', url: 'https://www.udemy.com/course/generative-ai-llm-bootcamp/', difficulty: 'Intermediate', qualityScore: 4.6, isFree: false, duration: '12 Hours' },
      { title: 'LangChain and LLM Course for Beginners', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/news/langchain-llms-course/', difficulty: 'Beginner', qualityScore: 4.8, isFree: true, duration: '3 Hours' },
      { title: 'AI Engineer Roadmap', provider: 'Roadmap.sh', url: 'https://roadmap.sh/ai-engineer', difficulty: 'Advanced', qualityScore: 4.9, isFree: true, duration: 'Self-paced' },
      { title: 'Large Language Models (LLM) Reference', provider: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/large-language-models-llms/', difficulty: 'Intermediate', qualityScore: 4.5, isFree: true, duration: 'Self-paced' },
      { title: 'HuggingFace Transformers Docs', provider: 'Official Documentation', url: 'https://huggingface.co/docs/transformers/index', difficulty: 'Advanced', qualityScore: 4.9, isFree: true, duration: 'Self-paced' }
    ]
  },
  'Figma': {
    whyItMatters: 'Figma is the industry standard UI/UX design tool. Essential for wireframing, collaborative prototyping, and design system component building.',
    priorityScore: 92,
    estimatedHours: 25,
    readinessImpact: 12,
    beginnerProject: 'Basic mockup screens mapping profile headers.',
    intermediateProject: 'High-fidelity mobile UI checkout screens using Figma auto-layouts and components.',
    advancedProject: 'Interactive prototype mapping responsive sidebar grids with dark/light themes.',
    resources: [
      { title: 'Figma UI/UX Design Tutorial', provider: 'YouTube', url: 'https://www.youtube.com/watch?v=c9Wg6RY_TgpU', difficulty: 'Beginner', qualityScore: 4.8, isFree: true, duration: '3.5 Hours' },
      { title: 'Google UX Design Professional Certificate', provider: 'Coursera', url: 'https://www.coursera.org/professional-certificates/google-ux-design', difficulty: 'Intermediate', qualityScore: 4.8, isFree: false, duration: '4 Months' },
      { title: 'Figma UI/UX Masterclass', provider: 'Udemy', url: 'https://www.udemy.com/course/figma-uiux-masterclass/', difficulty: 'Intermediate', qualityScore: 4.7, isFree: false, duration: '18 Hours' },
      { title: 'Learn Figma for Beginners Course', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/news/learn-figma-full-course/', difficulty: 'Beginner', qualityScore: 4.7, isFree: true, duration: '6 Hours' },
      { title: 'UX Design Roadmap Guide', provider: 'Roadmap.sh', url: 'https://roadmap.sh/ux', difficulty: 'Beginner', qualityScore: 4.8, isFree: true, duration: 'Self-paced' },
      { title: 'Figma Interface Design Reference', provider: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/figma/', difficulty: 'Beginner', qualityScore: 4.4, isFree: true, duration: 'Self-paced' },
      { title: 'Official Figma Help Center', provider: 'Official Documentation', url: 'https://help.figma.com/hc/en-us', difficulty: 'Advanced', qualityScore: 4.8, isFree: true, duration: 'Self-paced' }
    ]
  },
  'Tableau': {
    whyItMatters: 'Tableau is the leading data visualization software. Ideal for compiling business analytics dashboards, parsing metrics, and presenting to stakeholders.',
    priorityScore: 90,
    estimatedHours: 25,
    readinessImpact: 7,
    beginnerProject: 'Simple sales trend bar chart utilizing public csv databases.',
    intermediateProject: 'Dynamic company health dashboard containing map distributions and data filters.',
    advancedProject: 'Automated executive scorecard dashboard synced with SQL servers.',
    resources: [
      { title: 'Tableau for Beginners Full Course', provider: 'YouTube', url: 'https://www.youtube.com/watch?v=TPRl914GIPo', difficulty: 'Beginner', qualityScore: 4.8, isFree: true, duration: '3 Hours' },
      { title: 'Data Visualization with Tableau Specialization', provider: 'Coursera', url: 'https://www.coursera.org/specializations/data-visualization-tableau', difficulty: 'Intermediate', qualityScore: 4.7, isFree: false, duration: '2 Months' },
      { title: 'Tableau Certified Associate Developer', provider: 'Udemy', url: 'https://www.udemy.com/course/tableau10/', difficulty: 'Intermediate', qualityScore: 4.8, isFree: false, duration: '11 Hours' },
      { title: 'Tableau Course for Data Analysts', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/news/learn-tableau-for-data-visualization-full-course/', difficulty: 'Beginner', qualityScore: 4.8, isFree: true, duration: '5 Hours' },
      { title: 'BI Tool Roadmap', provider: 'Roadmap.sh', url: 'https://roadmap.sh', difficulty: 'Beginner', qualityScore: 4.5, isFree: true, duration: 'Self-paced' },
      { title: 'Tableau Data Visualization Reference', provider: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/tableau-data-visualization/', difficulty: 'Beginner', qualityScore: 4.4, isFree: true, duration: 'Self-paced' },
      { title: 'Official Tableau E-Learning Docs', provider: 'Official Documentation', url: 'https://help.tableau.com/current/pro/desktop/en-us/default.htm', difficulty: 'Advanced', qualityScore: 4.9, isFree: true, duration: 'Self-paced' }
    ]
  }
};

export function generatePathwayForSkill(skillName: string): SkillPathway {
  // Check if predefined
  const standardizedName = Object.keys(comprehensiveSkillPathways).find(
    k => k.toLowerCase() === skillName.toLowerCase()
  );
  if (standardizedName) {
    return comprehensiveSkillPathways[standardizedName];
  }

  // Generate dynamic pathway
  const escapedName = encodeURIComponent(skillName);
  const hourFactor = Math.abs(skillName.length * 3) % 25;
  const estimatedHours = 15 + hourFactor;
  const priorityScore = 70 + (skillName.length % 25);
  const readinessImpact = 5 + (skillName.length % 8);

  return {
    whyItMatters: `Mastering ${skillName} addresses a key technical skill gap required for your target career role. It enhances query performance, application robustness, and stack compatibility.`,
    priorityScore,
    estimatedHours,
    readinessImpact,
    beginnerProject: `Create a simple local module or syntax wrapper demonstrating core ${skillName} operations.`,
    intermediateProject: `Build an integration app utilizing ${skillName} configurations, automated logs, and standard APIs.`,
    advancedProject: `Architect a highly scalable distributed dashboard utilizing ${skillName} performance tuning and robust failure guards.`,
    resources: [
      {
        title: `Learn ${skillName} - Ultimate Tutorial Series`,
        provider: 'YouTube',
        url: `https://www.youtube.com/results?search_query=learn+${escapedName}`,
        difficulty: 'Beginner',
        qualityScore: 4.6,
        isFree: true,
        duration: '3 Hours'
      },
      {
        title: `${skillName} Specialization Tracks`,
        provider: 'Coursera',
        url: `https://www.coursera.org/search?query=${escapedName}`,
        difficulty: 'Intermediate',
        qualityScore: 4.7,
        isFree: false,
        duration: '1 Month'
      },
      {
        title: `Complete ${skillName} Bootcamp: Zero to Hero`,
        provider: 'Udemy',
        url: `https://www.udemy.com/courses/search/?q=${escapedName}`,
        difficulty: 'Intermediate',
        qualityScore: 4.8,
        isFree: false,
        duration: '15 Hours'
      },
      {
        title: `${skillName} Handbooks & Interactive Code Sandbox`,
        provider: 'freeCodeCamp',
        url: `https://www.freecodecamp.org/news/search?query=${escapedName}`,
        difficulty: 'Beginner',
        qualityScore: 4.7,
        isFree: true,
        duration: '4 Hours'
      },
      {
        title: `${skillName} Industry Best-Practices Roadmap`,
        provider: 'Roadmap.sh',
        url: `https://roadmap.sh`,
        difficulty: 'Beginner',
        qualityScore: 4.8,
        isFree: true,
        duration: 'Self-paced'
      },
      {
        title: `${skillName} Coding Cheatsheets & Guides`,
        provider: 'GeeksforGeeks',
        url: `https://www.geeksforgeeks.org/search/?q=${escapedName}`,
        difficulty: 'Beginner',
        qualityScore: 4.4,
        isFree: true,
        duration: 'Self-paced'
      },
      {
        title: `${skillName} Official Reference Manuals & Documentation`,
        provider: 'Official Documentation',
        url: `https://www.google.com/search?q=${escapedName}+official+documentation`,
        difficulty: 'Advanced',
        qualityScore: 4.9,
        isFree: true,
        duration: 'Self-paced'
      }
    ]
  };
}
