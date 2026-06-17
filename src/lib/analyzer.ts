export interface ResumeAnalysisResult {
  score: number;
  keywordMatch: number;
  formatting: number;
  experience: number;
  skillsCoverage: number;
  education: number;
  foundKeywords: string[];
  missingKeywords: string[];
  missingSkillsHigh: string[];
  missingSkillsMedium: string[];
  suggestions: {
    category: 'Formatting' | 'Content' | 'Action Verbs';
    text: string;
    impact: 'High' | 'Medium' | 'Low';
  }[];
  detectedSkills?: string[];
  strengths?: string[];
  weaknesses?: string[];
}

export interface KeywordConfig {
  name: string;
  synonyms: string[];
  category: string;
  isPrimary?: boolean;
}

export const roleKeywords: Record<string, KeywordConfig[]> = {
  swe: [
    { name: 'React', synonyms: ['react.js', 'reactjs', 'react library'], category: 'Frontend', isPrimary: true },
    { name: 'Node.js', synonyms: ['nodejs', 'node.js', 'node js', 'expressjs', 'express.js', 'express'], category: 'Backend & DB', isPrimary: true },
    { name: 'JavaScript', synonyms: ['javascript', 'js', 'ecmascript', 'es6'], category: 'Languages', isPrimary: true },
    { name: 'TypeScript', synonyms: ['typescript', 'ts'], category: 'Languages', isPrimary: true },
    { name: 'HTML', synonyms: ['html5', 'html'], category: 'Frontend' },
    { name: 'CSS', synonyms: ['css3', 'css', 'sass', 'scss', 'tailwind'], category: 'Frontend' },
    { name: 'Git', synonyms: ['git', 'github', 'gitlab', 'version control'], category: 'Tools & Methods', isPrimary: true },
    { name: 'REST APIs', synonyms: ['rest api', 'restful api', 'rest apis', 'restful apis', 'web api', 'apis'], category: 'Backend & DB', isPrimary: true },
    { name: 'SQL', synonyms: ['sql', 'mysql', 'postgresql', 'postgres', 'sqlite', 'database', 'rdbms'], category: 'Backend & DB', isPrimary: true },
    { name: 'NoSQL', synonyms: ['nosql', 'mongodb', 'mongo', 'redis', 'cassandra', 'dynamodb'], category: 'Backend & DB' },
    { name: 'Docker', synonyms: ['docker', 'container', 'containers', 'containerization'], category: 'Tools & Methods' },
    { name: 'CI/CD', synonyms: ['ci/cd', 'continuous integration', 'continuous delivery', 'jenkins', 'github actions', 'circleci'], category: 'Tools & Methods' },
    { name: 'Kubernetes', synonyms: ['kubernetes', 'k8s', 'container orchestration'], category: 'Tools & Methods' },
    { name: 'System Design', synonyms: ['system design', 'software architecture', 'scalability', 'distributed systems'], category: 'Backend & DB', isPrimary: true },
    { name: 'GraphQL', synonyms: ['graphql', 'apollo client'], category: 'Backend & DB' },
    { name: 'Unit Testing', synonyms: ['unit testing', 'jest', 'mocha', 'cypress', 'testing'], category: 'Tools & Methods' },
    { name: 'Agile', synonyms: ['agile', 'scrum', 'kanban', 'sprints'], category: 'Tools & Methods' },
    { name: 'AWS', synonyms: ['aws', 'amazon web services', 'cloud computing', 'ec2', 's3'], category: 'Backend & DB', isPrimary: true },
    { name: 'Java', synonyms: ['java', 'spring boot', 'spring framework'], category: 'Languages' },
    { name: 'Python', synonyms: ['python', 'programming', 'scripting', 'py'], category: 'Languages' }
  ],
  frontend: [
    { name: 'React', synonyms: ['react.js', 'reactjs', 'react library'], category: 'Frameworks', isPrimary: true },
    { name: 'Vue.js', synonyms: ['vue', 'vuejs', 'vue.js'], category: 'Frameworks' },
    { name: 'Angular', synonyms: ['angularjs', 'angular.js', 'angular'], category: 'Frameworks' },
    { name: 'JavaScript', synonyms: ['javascript', 'js', 'ecmascript', 'es6'], category: 'Languages', isPrimary: true },
    { name: 'TypeScript', synonyms: ['typescript', 'ts'], category: 'Languages', isPrimary: true },
    { name: 'HTML5', synonyms: ['html5', 'html', 'xhtml'], category: 'Styling & Tools' },
    { name: 'CSS3', synonyms: ['css3', 'css', 'sass', 'scss', 'tailwind', 'bootstrap'], category: 'Styling & Tools', isPrimary: true },
    { name: 'Web Performance', synonyms: ['page speed', 'lighthouse', 'lazy loading', 'optimizing performance'], category: 'APIs & State' },
    { name: 'State Management', synonyms: ['redux', 'zustand', 'mobx', 'context api', 'recoil'], category: 'APIs & State', isPrimary: true },
    { name: 'Webpack', synonyms: ['webpack', 'vite', 'parcel', 'bundling', 'gulp'], category: 'Styling & Tools' },
    { name: 'Git', synonyms: ['git', 'github', 'gitlab', 'version control'], category: 'Styling & Tools', isPrimary: true },
    { name: 'REST APIs', synonyms: ['rest api', 'restful api', 'graphql', 'fetch api', 'axios', 'apis'], category: 'APIs & State', isPrimary: true }
  ],
  backend: [
    { name: 'Node.js', synonyms: ['nodejs', 'node.js', 'node js', 'expressjs', 'express.js', 'express'], category: 'Languages', isPrimary: true },
    { name: 'Python', synonyms: ['python', 'py', 'django', 'fastapi', 'flask'], category: 'Languages' },
    { name: 'Java', synonyms: ['java', 'spring boot', 'spring framework'], category: 'Languages' },
    { name: 'Go', synonyms: ['go', 'golang'], category: 'Languages' },
    { name: 'SQL', synonyms: ['sql', 'mysql', 'postgresql', 'postgres', 'sqlite', 'database', 'rdbms'], category: 'Databases', isPrimary: true },
    { name: 'NoSQL', synonyms: ['nosql', 'mongodb', 'mongo', 'redis', 'cassandra', 'dynamodb'], category: 'Databases', isPrimary: true },
    { name: 'System Design', synonyms: ['system design', 'software architecture', 'scalability', 'distributed systems'], category: 'Architecture', isPrimary: true },
    { name: 'REST APIs', synonyms: ['rest api', 'restful api', 'rest apis', 'web api', 'apis'], category: 'Architecture', isPrimary: true },
    { name: 'GraphQL', synonyms: ['graphql', 'apollo server'], category: 'Architecture' },
    { name: 'Docker', synonyms: ['docker', 'container', 'containers', 'containerization'], category: 'DevOps & Tools', isPrimary: true },
    { name: 'Kubernetes', synonyms: ['kubernetes', 'k8s', 'container orchestration'], category: 'DevOps & Tools' },
    { name: 'AWS', synonyms: ['aws', 'amazon web services', 'cloud computing', 'ec2', 's3', 'lambda'], category: 'DevOps & Tools', isPrimary: true },
    { name: 'CI/CD', synonyms: ['ci/cd', 'continuous integration', 'continuous delivery', 'jenkins', 'github actions'], category: 'DevOps & Tools' }
  ],
  fullstack: [
    { name: 'React', synonyms: ['react.js', 'reactjs', 'react library'], category: 'Frontend', isPrimary: true },
    { name: 'JavaScript', synonyms: ['javascript', 'js', 'ecmascript', 'es6'], category: 'Frontend', isPrimary: true },
    { name: 'TypeScript', synonyms: ['typescript', 'ts'], category: 'Frontend' },
    { name: 'HTML', synonyms: ['html5', 'html'], category: 'Frontend' },
    { name: 'CSS', synonyms: ['css3', 'css', 'sass', 'scss', 'tailwind'], category: 'Frontend' },
    { name: 'Node.js', synonyms: ['nodejs', 'node.js', 'expressjs', 'express'], category: 'Backend', isPrimary: true },
    { name: 'REST APIs', synonyms: ['rest api', 'restful api', 'graphql', 'apis'], category: 'Backend', isPrimary: true },
    { name: 'System Design', synonyms: ['system design', 'architecture', 'scalability'], category: 'Backend' },
    { name: 'SQL', synonyms: ['sql', 'mysql', 'postgresql', 'database'], category: 'Databases', isPrimary: true },
    { name: 'NoSQL', synonyms: ['nosql', 'mongodb', 'mongo', 'redis'], category: 'Databases' },
    { name: 'Git', synonyms: ['git', 'github', 'gitlab'], category: 'DevOps & Tools', isPrimary: true },
    { name: 'Docker', synonyms: ['docker', 'container'], category: 'DevOps & Tools' },
    { name: 'AWS', synonyms: ['aws', 'cloud computing'], category: 'DevOps & Tools' }
  ],
  ai: [
    { name: 'Python', synonyms: ['python', 'py'], category: 'Languages', isPrimary: true },
    { name: 'LLMs', synonyms: ['llm', 'llms', 'large language models', 'gpt', 'claude', 'gemini', 'openai', 'llama'], category: 'AI Core', isPrimary: true },
    { name: 'Prompt Engineering', synonyms: ['prompt engineering', 'prompts', 'system prompts'], category: 'AI Core' },
    { name: 'RAG', synonyms: ['rag', 'retrieval augmented generation', 'semantic search', 'vector search'], category: 'AI Core', isPrimary: true },
    { name: 'NLP', synonyms: ['nlp', 'natural language processing', 'text analysis', 'tokenization'], category: 'AI Core' },
    { name: 'LangChain', synonyms: ['langchain', 'llamaindex', 'agentic workflows', 'agents'], category: 'Frameworks', isPrimary: true },
    { name: 'Hugging Face', synonyms: ['hugging face', 'huggingface', 'transformers'], category: 'Frameworks' },
    { name: 'PyTorch', synonyms: ['pytorch', 'tensorflow', 'deep learning'], category: 'Frameworks' },
    { name: 'Vector Databases', synonyms: ['pinecone', 'chromadb', 'milvus', 'qdrant', 'vector database'], category: 'Cloud & Tools', isPrimary: true },
    { name: 'MLOps', synonyms: ['mlops', 'model serving', 'deployment', 'pipelines'], category: 'Cloud & Tools', isPrimary: true },
    { name: 'Git', synonyms: ['git', 'github', 'version control'], category: 'Cloud & Tools' }
  ],
  ml: [
    { name: 'Python', synonyms: ['python', 'py'], category: 'Languages', isPrimary: true },
    { name: 'Machine Learning', synonyms: ['machine learning', 'ml', 'predictive modeling', 'supervised learning', 'unsupervised learning'], category: 'ML Core', isPrimary: true },
    { name: 'Deep Learning', synonyms: ['deep learning', 'neural networks', 'cnn', 'rnn', 'transformers'], category: 'ML Core', isPrimary: true },
    { name: 'Statistics', synonyms: ['statistics', 'statistical analysis', 'probability', 'linear algebra', 'math'], category: 'ML Core' },
    { name: 'PyTorch', synonyms: ['pytorch', 'deep learning framework'], category: 'Frameworks', isPrimary: true },
    { name: 'TensorFlow', synonyms: ['tensorflow', 'keras'], category: 'Frameworks' },
    { name: 'Scikit-Learn', synonyms: ['scikit-learn', 'sklearn', 'pandas', 'numpy'], category: 'Frameworks', isPrimary: true },
    { name: 'MLOps', synonyms: ['mlops', 'mlflow', 'sagemaker', 'pipelines', 'model deployment'], category: 'MLOps & Infrastructure', isPrimary: true },
    { name: 'Big Data', synonyms: ['big data', 'spark', 'hadoop', 'pyspark'], category: 'MLOps & Infrastructure' },
    { name: 'Docker', synonyms: ['docker', 'containers', 'kubernetes'], category: 'MLOps & Infrastructure' }
  ],
  pm: [
    { name: 'Agile', synonyms: ['agile', 'scrum', 'kanban', 'sprints'], category: 'Execution', isPrimary: true },
    { name: 'Product Roadmap', synonyms: ['product roadmap', 'roadmap planning', 'product roadmapping', 'strategy planning'], category: 'Strategy', isPrimary: true },
    { name: 'Market Research', synonyms: ['market research', 'competitor analysis', 'market analysis', 'user research'], category: 'Strategy' },
    { name: 'User Interviews', synonyms: ['user interviews', 'customer discovery', 'customer feedback', 'user feedback'], category: 'Leadership', isPrimary: true },
    { name: 'A/B Testing', synonyms: ['a/b testing', 'ab testing', 'split testing', 'experimentation'], category: 'Analytics' },
    { name: 'User Stories', synonyms: ['user stories', 'product backlog', 'epic writing', 'backlog grooming'], category: 'Execution' },
    { name: 'PRDs', synonyms: ['prd', 'prds', 'product requirement document', 'product specifications', 'specifications'], category: 'Execution', isPrimary: true },
    { name: 'Jira', synonyms: ['jira', 'linear', 'trello', 'project management tool', 'confluence'], category: 'Execution' },
    { name: 'KPIs', synonyms: ['kpis', 'kpi', 'key performance indicators', 'metrics', 'analytics'], category: 'Analytics', isPrimary: true },
    { name: 'Mixpanel', synonyms: ['mixpanel', 'amplitude', 'google analytics', 'product analytics'], category: 'Analytics' },
    { name: 'Product Lifecycle', synonyms: ['product lifecycle', 'plc', 'product launch', 'go-to-market', 'gtm'], category: 'Strategy', isPrimary: true },
    { name: 'SQL', synonyms: ['sql', 'database queries', 'data extraction'], category: 'Analytics' },
    { name: 'Stakeholder Management', synonyms: ['stakeholder management', 'stakeholder communication', 'cross-functional collaboration', 'alignment'], category: 'Leadership', isPrimary: true },
    { name: 'Data-driven', synonyms: ['data-driven', 'data analysis', 'analytical mindset', 'metrics-driven'], category: 'Leadership' },
    { name: 'Wireframes', synonyms: ['wireframes', 'wireframing', 'mockups', 'figma'], category: 'Leadership' }
  ],
  ds: [
    { name: 'Python', synonyms: ['python', 'programming', 'scripting', 'py'], category: 'Languages', isPrimary: true },
    { name: 'SQL', synonyms: ['sql', 'mysql', 'postgresql', 'database'], category: 'Languages', isPrimary: true },
    { name: 'Machine Learning', synonyms: ['machine learning', 'ml', 'predictive modeling', 'supervised learning', 'unsupervised learning'], category: 'ML Core', isPrimary: true },
    { name: 'Pandas', synonyms: ['pandas', 'numpy', 'scipy', 'data manipulation'], category: 'Libraries' },
    { name: 'Git', synonyms: ['git', 'github', 'version control'], category: 'Ops & Cloud' },
    { name: 'R', synonyms: ['r programming', 'r language', 'r studio'], category: 'Languages' },
    { name: 'Statistics', synonyms: ['statistics', 'statistical analysis', 'probability', 'hypothesis testing', 'ab testing'], category: 'ML Core', isPrimary: true },
    { name: 'TensorFlow', synonyms: ['tensorflow', 'keras', 'deep learning framework'], category: 'Libraries' },
    { name: 'PyTorch', synonyms: ['pytorch', 'deep learning framework'], category: 'Libraries' },
    { name: 'Deep Learning', synonyms: ['deep learning', 'neural networks', 'cnn', 'rnn', 'transformers'], category: 'Libraries', isPrimary: true },
    { name: 'Scikit-Learn', synonyms: ['scikit-learn', 'sklearn', 'ml library'], category: 'Libraries', isPrimary: true },
    { name: 'Data Visualization', synonyms: ['data visualization', 'matplotlib', 'seaborn', 'plotly', 'dataviz'], category: 'Libraries' },
    { name: 'Big Data', synonyms: ['big data', 'spark', 'hadoop', 'pyspark', 'hive'], category: 'Ops & Cloud' },
    { name: 'AWS', synonyms: ['aws', 'gcp', 'azure', 'cloud computing'], category: 'Ops & Cloud' },
    { name: 'MLOps', synonyms: ['mlops', 'model deployment', 'mlflow', 'sagemaker', 'pipelines'], category: 'Ops & Cloud', isPrimary: true },
    { name: 'Feature Engineering', synonyms: ['feature engineering', 'data preprocessing', 'data cleaning', 'dimensionality reduction'], category: 'ML Core' }
  ],
  ux: [
    { name: 'Figma', synonyms: ['figma', 'sketch', 'adobe xd', 'design tool'], category: 'Tools', isPrimary: true },
    { name: 'UI/UX', synonyms: ['ui/ux', 'user interface', 'user experience', 'product design'], category: 'Design Process', isPrimary: true },
    { name: 'Wireframes', synonyms: ['wireframes', 'wireframing', 'mockups', 'low-fidelity', 'lo-fi'], category: 'Design Process' },
    { name: 'Prototyping', synonyms: ['prototyping', 'interactive prototypes', 'high-fidelity', 'hi-fi'], category: 'Design Process', isPrimary: true },
    { name: 'Adobe Creative Suite', synonyms: ['adobe creative suite', 'photoshop', 'illustrator', 'indesign'], category: 'Tools' },
    { name: 'User Research', synonyms: ['user research', 'ux research', 'user testing', 'personas', 'user interviews'], category: 'Research', isPrimary: true },
    { name: 'Usability Testing', synonyms: ['usability testing', 'heuristic evaluation', 'user testing', 'ux audit'], category: 'Research', isPrimary: true },
    { name: 'Information Architecture', synonyms: ['information architecture', 'sitemaps', 'card sorting', 'user flows'], category: 'Research' },
    { name: 'Accessibility', synonyms: ['accessibility', 'wcag', 'wcag 2.1', 'a11y', 'inclusive design'], category: 'Delivery' },
    { name: 'Design Systems', synonyms: ['design systems', 'component libraries', 'ui kits', 'style guides'], category: 'Tools', isPrimary: true },
    { name: 'Developer Handoff', synonyms: ['developer handoff', 'zeplin', 'design specs', 'handoff specs'], category: 'Delivery' }
  ],
  da: [
    { name: 'SQL', synonyms: ['sql', 'mysql', 'postgresql', 'database', 'queries', 't-sql', 'pl/sql'], category: 'Languages & DB', isPrimary: true },
    { name: 'Python', synonyms: ['python', 'r programming', 'py'], category: 'Languages & DB', isPrimary: true },
    { name: 'Excel', synonyms: ['excel', 'spreadsheets', 'google sheets', 'vlookup', 'pivot tables'], category: 'Analytics Tools', isPrimary: true },
    { name: 'Tableau', synonyms: ['tableau', 'data visualization tool'], category: 'Analytics Tools', isPrimary: true },
    { name: 'Power BI', synonyms: ['power bi', 'powerbi', 'bi tool', 'business intelligence tool'], category: 'Analytics Tools', isPrimary: true },
    { name: 'Data Analysis', synonyms: ['data analysis', 'data analytics', 'data auditing', 'quantitative analysis'], category: 'Methodologies', isPrimary: true },
    { name: 'Statistics', synonyms: ['statistics', 'statistical analysis', 'probability', 'descriptive statistics'], category: 'Methodologies' },
    { name: 'Pandas', synonyms: ['pandas', 'numpy', 'scipy'], category: 'Methodologies' },
    { name: 'Data Visualization', synonyms: ['data visualization', 'reporting', 'dataviz', 'dashboards', 'charts'], category: 'Business & Reporting', isPrimary: true },
    { name: 'ETL', synonyms: ['etl', 'data integration', 'extract transform load', 'data pipelines'], category: 'Methodologies' },
    { name: 'Data Warehousing', synonyms: ['data warehousing', 'data warehouse', 'snowflake', 'redshift', 'bigquery'], category: 'Languages & DB' },
    { name: 'Data Cleaning', synonyms: ['data cleaning', 'data preprocessing', 'data preparation', 'data wrangling'], category: 'Methodologies' },
    { name: 'Business Intelligence', synonyms: ['business intelligence', 'bi', 'reporting tools', 'dashboards'], category: 'Business & Reporting' },
    { name: 'KPIs', synonyms: ['kpis', 'kpi', 'metrics', 'key performance indicators'], category: 'Business & Reporting' }
  ]
};

const roleVerbs: Record<string, string[]> = {
  swe: ['engineered', 'implemented', 'optimized', 'architected', 'streamlined', 'automated', 'scaled', 'debugged', 'refactored', 'deployed', 'integrated', 'developed', 'built'],
  frontend: ['designed', 'implemented', 'optimized', 'developed', 'engineered', 'built', 'styled', 'refactored', 'integrated', 'delivered'],
  backend: ['engineered', 'implemented', 'optimized', 'architected', 'streamlined', 'automated', 'scaled', 'deployed', 'integrated', 'built', 'secured', 'refactored'],
  fullstack: ['engineered', 'implemented', 'optimized', 'architected', 'streamlined', 'developed', 'built', 'deployed', 'integrated', 'designed', 'scaled'],
  ai: ['engineered', 'implemented', 'fine-tuned', 'prompted', 'optimized', 'deployed', 'trained', 'built', 'designed', 'integrated'],
  ml: ['modeled', 'trained', 'fine-tuned', 'predicted', 'engineered', 'implemented', 'optimized', 'deployed', 'visualized', 'architected'],
  pm: ['spearheaded', 'launched', 'orchestrated', 'drove', 'delivered', 'defined', 'managed', 'led', 'collaborated', 'championed', 'negotiated', 'steered', 'facilitated', 'coordinated'],
  ds: ['modeled', 'predicted', 'analyzed', 'mined', 'trained', 'validated', 'visualized', 'synthesized', 'extracted', 'engineered', 'forecasted', 'clustered', 'implemented'],
  ux: ['designed', 'prototyped', 'tested', 'researched', 'mapped', 'wireframed', 'conceptualized', 'conducted', 'validated', 'facilitated', 'collaborated', 'crafted', 'redesigned'],
  da: ['analyzed', 'reported', 'queried', 'visualized', 'extracted', 'cleaned', 'modeled', 'automated', 'interpreted', 'uncovered', 'dashboarded', 'audited', 'built']
};

const roleMetrics: Record<string, string[]> = {
  swe: ['ms', 'latency', 'throughput', 'qps', 'rps', '%', 'percent', 'reduce', 'increase', 'efficiency', 'load', 'api', 'queries', 'database', 'cost', 'size', 'uptime', 'response times', 'scalability', 'performance'],
  frontend: ['%', 'percent', 'lighthouse', 'seo', 'page speed', 'performance', 'ms', 'seconds', 'lazy loading', 'bundle size', 'conversions', 'users'],
  backend: ['ms', 'latency', 'throughput', 'qps', 'rps', '%', 'percent', 'reduce', 'increase', 'efficiency', 'load', 'api', 'queries', 'database', 'cost', 'size', 'uptime'],
  fullstack: ['ms', 'latency', 'throughput', 'percent', '%', 'reduce', 'increase', 'load', 'api', 'queries', 'database', 'users', 'speed', 'lighthouse'],
  ai: ['%', 'accuracy', 'precision', 'recall', 'f1', 'latency', 'tokens', 'cost', 'dimension', 'parameters', 'dataset', 'retrieval', 'relevance'],
  ml: ['%', 'accuracy', 'precision', 'recall', 'f1', 'auc', 'roc', 'loss', 'dataset', 'gb', 'tb', 'million', 'records', 'speedup', 'x'],
  pm: ['%', 'percent', 'usd', 'revenue', 'sales', 'users', 'active', 'mau', 'dau', 'conversion', 'retention', 'churn', 'acquisition', 'growth', 'market share', 'roi', 'savings', 'timeline', 'months', 'weeks', 'milestones', 'roadmap'],
  ds: ['%', 'accuracy', 'f1', 'precision', 'recall', 'loss', 'auc', 'roc', 'dataset', 'gb', 'tb', 'million', 'records', 'rows', 'parameters', 'speedup', 'x', 'algorithm', 'model performance'],
  ux: ['%', 'conversion', 'usability', 'task completion', 'error rate', 'clicks', 'nps', 'sus', 'seconds', 'time on task', 'bounce rate', 'satisfaction', 'users', 'interviews', 'feedback', 'user journey'],
  da: ['%', 'dashboards', 'reports', 'automated', 'hours', 'accuracy', 'savings', 'efficiency', 'queries', 'volume', 'insights', 'stakeholders', 'trends', 'metrics', 'kpi']
};

const roleNames: Record<string, string> = {
  swe: 'Software Engineer',
  frontend: 'Frontend Developer',
  backend: 'Backend Developer',
  fullstack: 'Full Stack Developer',
  da: 'Data Analyst',
  ds: 'Data Scientist',
  ai: 'AI Engineer',
  ml: 'Machine Learning Engineer',
  pm: 'Product Manager',
  ux: 'UX Designer'
};

// Helper function to match exact word or phrase reliably
function matchWordOrPhrase(text: string, term: string): boolean {
  if (/\s|[^a-zA-Z0-9]/.test(term)) {
    return text.includes(term.toLowerCase());
  }
  const escaped = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp('\\b' + escaped + '\\b', 'i');
  return regex.test(text);
}

export function analyzeResume(text: string, roleId: string): ResumeAnalysisResult {
  // Normalize input
  const normalizedText = text || '';
  const cleanText = normalizedText.trim();
  const lowerText = cleanText.toLowerCase();
  
  // Word count check
  const words = cleanText.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  const keywords = roleKeywords[roleId] || roleKeywords['swe'];

  // 1. Keyword analysis with synonym matching
  const foundKeywords: string[] = [];
  const missingKeywords: string[] = [];

  keywords.forEach(kwDef => {
    let isMatched = false;
    
    // Check main name
    const escapedName = kwDef.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const nameHasSpecial = /[-\/\\^$*+?.()|[\]{}]/.test(kwDef.name);
    
    if (nameHasSpecial) {
      isMatched = lowerText.includes(kwDef.name.toLowerCase());
    } else {
      const regex = new RegExp('\\b' + escapedName + '\\b', 'i');
      isMatched = regex.test(lowerText);
    }
    
    // Check synonyms
    if (!isMatched) {
      for (const syn of kwDef.synonyms) {
        const escapedSyn = syn.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const synHasSpecial = /[-\/\\^$*+?.()|[\]{}]/.test(syn);
        if (synHasSpecial) {
          if (lowerText.includes(syn.toLowerCase())) {
            isMatched = true;
            break;
          }
        } else {
          const regex = new RegExp('\\b' + escapedSyn + '\\b', 'i');
          if (regex.test(lowerText)) {
            isMatched = true;
            break;
          }
        }
      }
    }

    if (isMatched) {
      foundKeywords.push(kwDef.name);
    } else {
      missingKeywords.push(kwDef.name);
    }
  });

  // Calculate weighted match percentage (Primary keywords have higher weight)
  let keywordMatchPercent = 0;
  if (keywords.length > 0) {
    let totalWeight = 0;
    let matchedWeight = 0;
    keywords.forEach(kw => {
      const w = kw.isPrimary ? 1.5 : 1.0;
      totalWeight += w;
      if (foundKeywords.includes(kw.name)) {
        matchedWeight += w;
      }
    });
    keywordMatchPercent = Math.round((matchedWeight / totalWeight) * 100);
    if (foundKeywords.length > 0 && keywordMatchPercent === 0) {
      keywordMatchPercent = 1;
    }
  }

  // 1b. Automatically detect all global skills in the resume text
  const detectedSkills: string[] = [];
  const processedSkills = new Set<string>();

  Object.values(roleKeywords).flat().forEach(kwDef => {
    if (processedSkills.has(kwDef.name)) return;
    
    let isMatched = false;
    
    // Check main name
    const escapedName = kwDef.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const nameHasSpecial = /[-\/\\^$*+?.()|[\]{}]/.test(kwDef.name);
    
    if (nameHasSpecial) {
      isMatched = lowerText.includes(kwDef.name.toLowerCase());
    } else {
      const regex = new RegExp('\\b' + escapedName + '\\b', 'i');
      isMatched = regex.test(lowerText);
    }
    
    // Check synonyms
    if (!isMatched) {
      for (const syn of kwDef.synonyms) {
        const escapedSyn = syn.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const synHasSpecial = /[-\/\\^$*+?.()|[\]{}]/.test(syn);
        if (synHasSpecial) {
          if (lowerText.includes(syn.toLowerCase())) {
            isMatched = true;
            break;
          }
        } else {
          const regex = new RegExp('\\b' + escapedSyn + '\\b', 'i');
          if (regex.test(lowerText)) {
            isMatched = true;
            break;
          }
        }
      }
    }

    if (isMatched) {
      detectedSkills.push(kwDef.name);
      processedSkills.add(kwDef.name);
    }
  });

  // 2. Role-Aware Layout & Formatting Score (Start with 100)
  let formattingScore = 100;
  
  // Section heading checks
  const hasExperience = /(experience|employment|work history|career history|work background)/i.test(lowerText);
  const hasEducation = /(education|academic|university|degree|college)/i.test(lowerText);
  const hasSkills = /(skills|technologies|technical expertise|core competencies)/i.test(lowerText);
  const hasProjects = /(projects|portfolio|personal projects|key work|case studies)/i.test(lowerText);

  // General layout deductions
  if (!hasExperience) formattingScore = Math.max(10, formattingScore - 20);
  if (!hasEducation) formattingScore = Math.max(10, formattingScore - 15);
  if (!hasSkills) formattingScore = Math.max(10, formattingScore - 15);

  // Links presence checks
  const hasGithub = /github\.com\b/i.test(lowerText);
  const hasLinkedin = /linkedin\.com\b/i.test(lowerText);
  const hasPortfolio = /(behance\.net|dribbble\.com|figma\.com|portfolio|personal site|personal website|github\.io|gitlab\.io)/i.test(lowerText);
  const hasAnyLink = /https?:\/\/[^\s]+|www\.[^\s]+/i.test(lowerText) || hasGithub || hasLinkedin || hasPortfolio;

  // Role-specific layout rules & bounds checks
  if (roleId === 'swe' || roleId === 'frontend' || roleId === 'backend' || roleId === 'fullstack') {
    // Ideal range: 350 - 750 words
    if (wordCount < 350) {
      formattingScore = Math.max(10, formattingScore - 15);
    } else if (wordCount > 750) {
      formattingScore = Math.max(10, formattingScore - 10);
    }
    // Tech roles require Projects
    if (!hasProjects) {
      formattingScore = Math.max(10, formattingScore - 20);
    }
    // Tech roles require developer links (GitHub)
    if (!hasGithub) {
      formattingScore = Math.max(10, formattingScore - 15);
    }
  } else if (roleId === 'pm') {
    // Ideal range: 500 - 900 words
    if (wordCount < 500) {
      formattingScore = Math.max(10, formattingScore - 15);
    } else if (wordCount > 900) {
      formattingScore = Math.max(10, formattingScore - 10);
    }
    // PM needs certifications, leadership, or projects
    const hasPMLayoutAdditions = /(certification|certifications|pmp|csm|leadership|projects)/i.test(lowerText);
    if (!hasPMLayoutAdditions) {
      formattingScore = Math.max(10, formattingScore - 20);
    }
    // PM needs LinkedIn or general profile link
    if (!hasLinkedin && !hasAnyLink) {
      formattingScore = Math.max(10, formattingScore - 15);
    }
  } else if (roleId === 'ds' || roleId === 'ai' || roleId === 'ml') {
    // Ideal range: 400 - 800 words
    if (wordCount < 400) {
      formattingScore = Math.max(10, formattingScore - 15);
    } else if (wordCount > 800) {
      formattingScore = Math.max(10, formattingScore - 10);
    }
    // AI/DS/ML requires projects or publications
    const hasDSPublications = /(publications|research|projects)/i.test(lowerText);
    if (!hasDSPublications) {
      formattingScore = Math.max(10, formattingScore - 20);
    }
    // Requires links
    const hasDSLinks = hasGithub || /kaggle\.com/i.test(lowerText) || hasAnyLink;
    if (!hasDSLinks) {
      formattingScore = Math.max(10, formattingScore - 15);
    }
  } else if (roleId === 'ux') {
    // Ideal range: 300 - 650 words
    if (wordCount < 300) {
      formattingScore = Math.max(10, formattingScore - 15);
    } else if (wordCount > 650) {
      formattingScore = Math.max(10, formattingScore - 10);
    }
    // UX absolutely requires portfolio links
    if (!hasPortfolio) {
      formattingScore = Math.max(10, formattingScore - 25);
    }
    // UX requires Projects/Case studies
    if (!hasProjects) {
      formattingScore = Math.max(10, formattingScore - 20);
    }
  } else if (roleId === 'da') {
    // Ideal range: 400 - 800 words
    if (wordCount < 400) {
      formattingScore = Math.max(10, formattingScore - 15);
    } else if (wordCount > 800) {
      formattingScore = Math.max(10, formattingScore - 10);
    }
    // DA requires Projects
    if (!hasProjects) {
      formattingScore = Math.max(10, formattingScore - 20);
    }
    // DA requires general/portfolio link
    if (!hasAnyLink && !hasGithub) {
      formattingScore = Math.max(10, formattingScore - 15);
    }
  }

  // Safety net word count deduction
  if (wordCount < 15) {
    formattingScore = 5;
  } else if (wordCount < 50) {
    formattingScore = Math.max(10, formattingScore - 60);
  }

  // 3. Role-Aware Metrics & Impact Score (Experience score)
  let experienceScore = 0;
  
  if (wordCount >= 15) {
    const verbs = roleVerbs[roleId] || roleVerbs['swe'];
    const metrics = roleMetrics[roleId] || roleMetrics['swe'];

    // Timeline check (30 points)
    const yearMatches = lowerText.match(/\b(19\d{2}|20\d{2})\b/g) || [];
    const yearsScore = yearMatches.length > 0 ? 30 : 10;

    // Role-specific action verbs (35 points) - each unique verb matched adds 7 points (max 5 verbs)
    let verbMatches = 0;
    verbs.forEach(verb => {
      if (matchWordOrPhrase(lowerText, verb)) {
        verbMatches++;
      }
    });
    const verbsScore = Math.min(35, verbMatches * 7);

    // Role-specific metrics indicators (35 points) - each unique metric indicator matched adds 7 points (max 5)
    let metricsMatches = 0;
    metrics.forEach(metric => {
      if (lowerText.includes(metric.toLowerCase())) {
        metricsMatches++;
      }
    });
    const metricsScore = Math.min(35, metricsMatches * 7);

    experienceScore = yearsScore + verbsScore + metricsScore;
  } else {
    experienceScore = 5;
  }

  // 4. Role-Aware Core Skills Coverage Score
  let skillsCoverageScore = 0;
  if (wordCount >= 15 && keywords.length > 0) {
    // Group keywords by category
    const categoryMap: Record<string, { total: number; matched: number }> = {};
    keywords.forEach(kw => {
      if (!categoryMap[kw.category]) {
        categoryMap[kw.category] = { total: 0, matched: 0 };
      }
      categoryMap[kw.category].total++;
      if (foundKeywords.includes(kw.name)) {
        categoryMap[kw.category].matched++;
      }
    });

    const categories = Object.keys(categoryMap);
    if (categories.length > 0) {
      let sumPercentages = 0;
      categories.forEach(cat => {
        const stats = categoryMap[cat];
        const percent = stats.total > 0 ? (stats.matched / stats.total) * 100 : 0;
        sumPercentages += percent;
      });
      // Average matching rate across categories
      skillsCoverageScore = Math.round(sumPercentages / categories.length);
    }
    
    // Safety check: if keywords matched, score must be at least 1%
    if (foundKeywords.length > 0 && skillsCoverageScore === 0) {
      skillsCoverageScore = 1;
    }
  } else {
    skillsCoverageScore = 5;
  }

  // 4b. Education Score
  let educationScore = 15;
  if (wordCount >= 15) {
    if (hasEducation) educationScore += 55;
    const hasDegrees = /bachelor|master|phd|bs|ms|b\.s\.|m\.s\.|mba|doctorate|degree|computer science|engineering|major|studies/i.test(lowerText);
    if (hasDegrees) educationScore += 30;
    educationScore = Math.min(100, educationScore);
  }

  // Critical Missing Skills Penalties
  let criticalSkills: string[] = [];
  if (roleId === 'ai' || roleId === 'ml') {
    criticalSkills = ['TensorFlow', 'PyTorch', 'Scikit-Learn'];
  } else if (['swe', 'frontend', 'backend', 'fullstack'].includes(roleId)) {
    criticalSkills = ['React', 'Node.js', 'APIs', 'Git'];
  } else if (roleId === 'da') {
    criticalSkills = ['SQL', 'Excel', 'Tableau', 'Power BI'];
  }

  let criticalMatchedCount = 0;
  criticalSkills.forEach(skill => {
    let skillFound = false;
    if (matchWordOrPhrase(lowerText, skill)) {
      skillFound = true;
    } else {
      const config = roleKeywords[roleId]?.find(c => c.name.toLowerCase() === skill.toLowerCase()) ||
                     Object.values(roleKeywords).flat().find(c => c.name.toLowerCase() === skill.toLowerCase());
      if (config) {
        for (const syn of config.synonyms) {
          if (matchWordOrPhrase(lowerText, syn)) {
            skillFound = true;
            break;
          }
        }
      }
    }
    if (skillFound) {
      criticalMatchedCount++;
    }
  });

  const criticalMissingCount = criticalSkills.length - criticalMatchedCount;
  const penalty = criticalMissingCount * 12;

  // 5. Overall ATS Score (weighted: 40% keywords, 15% formatting, 15% experience, 20% skills, 10% education)
  let overallScore = Math.round(
    (keywordMatchPercent * 0.40) + 
    (skillsCoverageScore * 0.20) + 
    (experienceScore * 0.15) + 
    (formattingScore * 0.15) + 
    (educationScore * 0.10)
  );

  overallScore = Math.max(0, overallScore - penalty);

  // Guard against blank/empty/Hello World resumes
  if (wordCount < 10 || (foundKeywords.length === 0 && !hasExperience && !hasSkills)) {
    overallScore = Math.min(12, Math.max(2, wordCount));
    formattingScore = Math.min(10, formattingScore);
    experienceScore = Math.min(5, experienceScore);
    skillsCoverageScore = Math.min(5, skillsCoverageScore);
    educationScore = Math.min(5, educationScore);
  }

  // Clean bounds
  overallScore = Math.max(0, Math.min(100, overallScore));
  formattingScore = Math.max(0, Math.min(100, formattingScore));
  experienceScore = Math.max(0, Math.min(100, experienceScore));
  skillsCoverageScore = Math.max(0, Math.min(100, skillsCoverageScore));
  educationScore = Math.max(0, Math.min(100, educationScore));

  // 5b. Strengths & Weaknesses
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (wordCount >= 15 && criticalMissingCount > 0) {
    const missingList = criticalSkills.filter(s => {
      let skillFound = false;
      if (matchWordOrPhrase(lowerText, s)) {
        skillFound = true;
      } else {
        const config = roleKeywords[roleId]?.find(c => c.name.toLowerCase() === s.toLowerCase()) ||
                       Object.values(roleKeywords).flat().find(c => c.name.toLowerCase() === s.toLowerCase());
        if (config) {
          for (const syn of config.synonyms) {
            if (matchWordOrPhrase(lowerText, syn)) {
              skillFound = true;
              break;
            }
          }
        }
      }
      return !skillFound;
    });
    if (missingList.length > 0) {
      weaknesses.push(`Missing critical target skills: ${missingList.join(', ')}. ATS algorithms penalize roles lacking these key requirements.`);
    }
  }

  if (wordCount >= 15) {
    if (hasExperience) {
      strengths.push("Work experience section is present and structured chronologically.");
    } else {
      weaknesses.push("Missing a dedicated Work Experience section. ATS algorithms cannot index your career timeline.");
    }

    if (hasSkills) {
      strengths.push("Structured Skills/Competencies section is clearly defined.");
    } else {
      weaknesses.push("Missing a clear Technical Skills index. Resumes without skill logs are filtered out by automated searches.");
    }

    if (hasEducation) {
      strengths.push("Education history is clearly visible with degrees and institutions listed.");
    } else {
      weaknesses.push("Academic background / Education section was not found. Explicitly detail your college degrees.");
    }

    if (hasAnyLink) {
      strengths.push("Professional online profile links (e.g. GitHub or LinkedIn) are present.");
    } else {
      weaknesses.push("No professional links found. Add your LinkedIn profile and portfolio/code repository link.");
    }

    if (keywordMatchPercent >= 70) {
      strengths.push("Excellent keyword optimization with high density of target credentials.");
    } else if (keywordMatchPercent < 45) {
      weaknesses.push("Low keyword relevance. Integrate core skills from the target career profile.");
    }

    if (experienceScore >= 70) {
      strengths.push("Strong impact-focused experience bullet points using action verbs and metrics.");
    } else if (experienceScore < 50) {
      weaknesses.push("Bullet points are passive. Start experience bullets with strong action verbs and include metrics.");
    }

    if (wordCount >= 400 && wordCount <= 800) {
      strengths.push("Optimal word count (between 400 and 800 words), avoiding verbosity.");
    } else if (wordCount < 300) {
      weaknesses.push("Document word count is too low. Expand descriptions of your roles and projects.");
    } else if (wordCount > 950) {
      weaknesses.push("Document is overly verbose (exceeds 950 words). Condense bullet points to fit within 1-2 pages.");
    }
  } else {
    weaknesses.push("Insufficient text content to parse. Please upload a full professional resume.");
  }

  // 6. Gaps Categorization
  const missingSkillsHigh = missingKeywords.slice(0, 3);
  const missingSkillsMedium = missingKeywords.slice(3, 6);

  // 7. Suggestions Generation
  const suggestions: { category: 'Formatting' | 'Content' | 'Action Verbs'; text: string; impact: 'High' | 'Medium' | 'Low' }[] = [];
  const targetRoleName = roleNames[roleId] || 'target role';

  if (wordCount < 15) {
    suggestions.push({
      category: 'Content',
      text: 'The uploaded document appears to be empty or contains insufficient content. Please upload a complete professional resume containing your work history, skills, and education.',
      impact: 'High'
    });
  } else {
    // General section missing
    if (!hasExperience) {
      suggestions.push({
        category: 'Formatting',
        text: 'Missing "Work Experience" section. Create a dedicated section listing your professional history in reverse chronological order.',
        impact: 'High'
      });
    }
    if (!hasSkills) {
      suggestions.push({
        category: 'Formatting',
        text: 'Missing "Skills" section. Create a dedicated section listing your technical proficiencies, tools, and methodologies so recruiters and ATS bots can index them quickly.',
        impact: 'High'
      });
    }
    if (!hasEducation) {
      suggestions.push({
        category: 'Formatting',
        text: 'Missing "Education" section. Add your educational background, including degrees, school names, and graduation years.',
        impact: 'Medium'
      });
    }

    // Role-specific formatting suggestions
    if (roleId === 'swe' || roleId === 'frontend' || roleId === 'backend' || roleId === 'fullstack') {
      if (!hasProjects) {
        suggestions.push({
          category: 'Formatting',
          text: `Add a dedicated "Projects" section. As a ${targetRoleName}, projects demonstrating hands-on application of skills are critical for ATS ranking.`,
          impact: 'High'
        });
      }
      if (!hasGithub) {
        suggestions.push({
          category: 'Formatting',
          text: 'Missing developer profile link. Please add your GitHub, GitLab, or Bitbucket profile link to your resume headers.',
          impact: 'High'
        });
      }
    } else if (roleId === 'ux') {
      if (!hasPortfolio) {
        suggestions.push({
          category: 'Formatting',
          text: 'Missing professional design portfolio link. As a UX Designer, you must include a link to your Figma, Behance, Dribbble, or personal portfolio site.',
          impact: 'High'
        });
      }
      if (!hasProjects) {
        suggestions.push({
          category: 'Formatting',
          text: 'Add a dedicated "Case Studies" or "Projects" section to walk through your design process, user research findings, and wireframing iterations.',
          impact: 'High'
        });
      }
    } else if (roleId === 'ds' || roleId === 'ai' || roleId === 'ml') {
      if (!hasProjects) {
        suggestions.push({
          category: 'Formatting',
          text: `Add a "Projects" or "Publications" section to showcase machine learning models, statistical analyses, or AI builds.`,
          impact: 'High'
        });
      }
      const hasDSLinks = hasGithub || /kaggle\.com/i.test(lowerText) || hasAnyLink;
      if (!hasDSLinks) {
        suggestions.push({
          category: 'Formatting',
          text: 'Provide a link to your GitHub, Kaggle, or Hugging Face profile so recruiters can audit your codebase and modeling notebooks.',
          impact: 'Medium'
        });
      }
    } else if (roleId === 'da') {
      if (!hasProjects) {
        suggestions.push({
          category: 'Formatting',
          text: 'Include a "Projects" section showcasing data visualization, ETL pipelines, or dashboard builds.',
          impact: 'High'
        });
      }
    } else if (roleId === 'pm') {
      const hasPMLayoutAdditions = /(certification|certifications|pmp|csm|leadership|projects)/i.test(lowerText);
      if (!hasPMLayoutAdditions) {
        suggestions.push({
          category: 'Formatting',
          text: 'Add a "Certifications" or "Leadership & Projects" section. PM resumes rank higher when referencing methodologies like PMP or Agile/Scrum certifications.',
          impact: 'Medium'
        });
      }
    }

    // Role-specific action verbs suggestions
    let matchedVerbs = 0;
    const verbs = roleVerbs[roleId] || roleVerbs['swe'];
    verbs.forEach(v => {
      if (matchWordOrPhrase(lowerText, v)) matchedVerbs++;
    });

    if (matchedVerbs < 4) {
      const verbExamples = verbs.slice(0, 4).map(v => `"${v.charAt(0).toUpperCase() + v.slice(1)}"`).join(', ');
      suggestions.push({
        category: 'Action Verbs',
        text: `Use strong, role-aware action verbs. Since you are targeting a ${targetRoleName} role, start your bullet points with verbs like ${verbExamples} instead of generic or passive verbs.`,
        impact: 'Medium'
      });
    }

    // Role-specific metrics suggestions
    let matchedMetrics = 0;
    const metrics = roleMetrics[roleId] || roleMetrics['swe'];
    metrics.forEach(m => {
      if (lowerText.includes(m.toLowerCase())) matchedMetrics++;
    });

    if (matchedMetrics < 4) {
      const metricExamples = metrics.slice(2, 6).join(', ');
      suggestions.push({
        category: 'Content',
        text: `Quantify your impact using metrics relevant to a ${targetRoleName}. Try incorporating indicators like ${metricExamples} (e.g. "improved speed by 30%" or "increased active users by 15%").`,
        impact: 'High'
      });
    }
  }
  return {
    score: overallScore,
    keywordMatch: keywordMatchPercent,
    formatting: formattingScore,
    experience: experienceScore,
    skillsCoverage: skillsCoverageScore,
    education: educationScore,
    foundKeywords,
    missingKeywords,
    missingSkillsHigh,
    missingSkillsMedium,
    detectedSkills,
    strengths,
    weaknesses,
    suggestions: suggestions.length > 0 ? suggestions : [
      {
        category: 'Content',
        text: 'Excellent job! Your resume matches the structural and impact requirements of this target profile. Consider updating recent projects to stay relevant.',
        impact: 'Low'
      }
    ]
  };
}

export interface ResumeValidationResult {
  isValid: boolean;
  confidence: number;
  isDetected: 'Yes' | 'No';
  resumeType: 'Student Resume' | 'Experienced Resume' | 'Academic CV' | 'Fresher Resume';
  missingSections: string[];
  warning?: string;
  checks: {
    hasName: boolean;
    hasEmail: boolean;
    hasPhone: boolean;
    hasSkills: boolean;
    hasEducation: boolean;
    hasExperience: boolean;
    hasLinkedIn: boolean;
    hasCertifications: boolean;
  };
}

export function validateResume(text: string): ResumeValidationResult {
  const normalizedText = (text || '').trim();
  const lowerText = normalizedText.toLowerCase();
  
  const words = normalizedText.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  // 1. Basic check indicators
  const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(lowerText);
  
  const hasPhone = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(lowerText) || 
                   /\b\d{10}\b/.test(lowerText) ||
                   /\+?\d[\d -]{8,12}\d/.test(lowerText);

  const hasLinkedIn = /linkedin\.com/i.test(lowerText);
  
  const hasCertifications = /(certificat(e|ion|ed)s?|credentials?|pmp|csm|certified)/i.test(lowerText) || 
                            /(projects|portfolio|personal projects)/i.test(lowerText);

  const hasSkills = /(skills|technologies|technical expertise|core competencies|proficiencies|languages)/i.test(lowerText);
  
  const hasEducation = /(education|academic|university|degree|college|qualifications)/i.test(lowerText);
  
  const hasExperience = /(experience|employment|work history|career history|work background|work experience)/i.test(lowerText);

  // Name presence check: Look at first 4 lines of text.
  const lines = normalizedText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  let hasName = false;
  const headerSectionPattern = /^(experience|education|skills|projects|certifications|summary|objective|contact|phone|email|linkedin|github)/i;
  for (let i = 0; i < Math.min(4, lines.length); i++) {
    const line = lines[i];
    if (headerSectionPattern.test(line)) continue;
    const lineWords = line.split(/\s+/);
    if (lineWords.length >= 2 && lineWords.length <= 4) {
      const isNamePattern = lineWords.every(word => /^[A-Z][A-Za-z]*$/.test(word));
      if (isNamePattern) {
        hasName = true;
        break;
      }
    }
  }
  // Fallback: if there is no line matching this, but first line is short and has no email or symbols, we assume it's a name
  if (!hasName && lines.length > 0) {
    const firstLine = lines[0];
    if (firstLine.length > 3 && firstLine.length < 35 && !firstLine.includes('@') && !firstLine.includes('/') && !headerSectionPattern.test(firstLine)) {
      hasName = true;
    }
  }

  // 2. Base Confidence Calculation
  let confidence = 0;
  if (hasEmail) confidence += 15;
  if (hasPhone) confidence += 15;
  if (hasSkills) confidence += 15;
  if (hasEducation) confidence += 15;
  if (hasExperience) confidence += 15;
  if (hasName) confidence += 10;
  if (hasCertifications) confidence += 10;
  if (hasLinkedIn) confidence += 5;

  // 3. Resume Keywords Check
  const resumeKeywords = ['experience', 'work experience', 'education', 'skills', 'technical skills', 'projects', 'certifications', 'achievements', 'internship', 'responsibilities', 'technologies', 'professional summary', 'career objective', 'profile'];
  let resumeKeywordCount = 0;
  resumeKeywords.forEach(kw => {
    if (lowerText.includes(kw)) resumeKeywordCount++;
  });
  if (resumeKeywordCount < 3) {
    confidence -= 30;
  }

  // 4. Negative Document checks (Research papers and Invoices)
  const researchKeywords = ['abstract', 'references', 'bibliography', 'literature review', 'methodology', 'research paper', 'journal', 'publication', 'conclusion'];
  const invoiceKeywords = ['invoice', 'bill number', 'gst', 'tax', 'amount due', 'subtotal', 'invoice date'];
  
  let researchMatchCount = 0;
  researchKeywords.forEach(kw => {
    if (lowerText.includes(kw)) researchMatchCount++;
  });

  let invoiceMatchCount = 0;
  invoiceKeywords.forEach(kw => {
    if (lowerText.includes(kw)) invoiceMatchCount++;
  });

  if (researchMatchCount >= 2 || invoiceMatchCount >= 1) {
    confidence -= 40;
  }

  // 5. Long non-resume document safety gate
  if (normalizedText.length > 3000 && !hasEmail && !hasPhone && !hasSkills) {
    confidence = 0;
  }

  // 6. Blank / short file checks
  if (wordCount < 10 || normalizedText.length < 50) {
    confidence = 0;
  }

  // Clean bounds clamp
  confidence = Math.max(0, Math.min(100, confidence));

  // 7. Resume Type Classification
  let resumeType: 'Student Resume' | 'Experienced Resume' | 'Academic CV' | 'Fresher Resume' = 'Fresher Resume';
  
  const academicIndicators = ['publication', 'publications', 'research', 'journal', 'teaching', 'curriculum vitae', 'thesis'];
  let academicMatches = 0;
  academicIndicators.forEach(ind => {
    if (lowerText.includes(ind)) academicMatches++;
  });
  
  const studentIndicators = ['gpa', 'intern', 'internship', 'student', 'university', 'club', 'extracurricular'];
  let studentMatches = 0;
  studentIndicators.forEach(ind => {
    if (lowerText.includes(ind)) studentMatches++;
  });

  const hasYears = /\b(19\d{2}|20\d{2})\b/.test(lowerText);
  const expIndicators = ['senior', 'lead', 'manager', 'years experience', 'years of experience', 'accomplished', 'directed'];
  let expMatches = 0;
  expIndicators.forEach(ind => {
    if (lowerText.includes(ind)) expMatches++;
  });

  if (academicMatches >= 2) {
    resumeType = 'Academic CV';
  } else if (studentMatches >= 2) {
    resumeType = 'Student Resume';
  } else if (hasExperience && (hasYears || expMatches >= 1)) {
    resumeType = 'Experienced Resume';
  }

  const missingSections: string[] = [];
  if (!hasName) missingSections.push('Name');
  if (!hasEmail) missingSections.push('Email Address');
  if (!hasPhone) missingSections.push('Phone Number');
  if (!hasSkills) missingSections.push('Skills Section');
  if (!hasEducation) missingSections.push('Education Section');
  if (!hasExperience) missingSections.push('Experience Section');
  if (!hasLinkedIn) missingSections.push('LinkedIn Profile');
  if (!hasCertifications) missingSections.push('Certifications/Projects');

  const isDetected = confidence >= 50 ? 'Yes' : 'No';
  const isValid = confidence >= 50;

  let warning: string | undefined = undefined;
  if (confidence < 50) {
    warning = 'This document does not appear to be a valid resume.';
  } else if (confidence >= 50 && confidence <= 70) {
    warning = 'This document may be incomplete or poorly structured.';
  }

  return {
    isValid,
    confidence,
    isDetected,
    resumeType,
    missingSections,
    warning,
    checks: {
      hasName,
      hasEmail,
      hasPhone,
      hasSkills,
      hasEducation,
      hasExperience,
      hasLinkedIn,
      hasCertifications
    }
  };
}

