export interface QuestionDef {
  id: string;
  question: string;
  idealAnswerKeys: string[];
  suggestedAnswer: string;
}

export const interviewQuestionsDb: Record<
  string,
  Record<'technical' | 'hr' | 'scenario', Record<'beginner' | 'intermediate' | 'advanced', QuestionDef[]>>
> = {
  swe: {
    technical: {
      beginner: [
        {
          id: 'swe-t-b1',
          question: 'Explain the difference between let, const, and var in JavaScript.',
          idealAnswerKeys: ['scope', 'hoisting', 'reassignment', 'block scope', 'global scope'],
          suggestedAnswer: 'var is function-scoped and hoisted. let and const are block-scoped. let allows reassignment, whereas const does not.'
        },
        {
          id: 'swe-t-b2',
          question: 'What is a REST API and what are the standard HTTP methods?',
          idealAnswerKeys: ['stateless', 'GET', 'POST', 'PUT', 'DELETE', 'client-server'],
          suggestedAnswer: 'REST APIs are stateless client-server systems using HTTP verbs. GET retrieves, POST creates, PUT replaces, and DELETE removes resources.'
        }
      ],
      intermediate: [
        {
          id: 'swe-t-i1',
          question: 'Explain how the virtual DOM works in React and how it optimizes UI updates.',
          idealAnswerKeys: ['reconciliation', 'diffing algorithm', 'DOM updates', 'render tree', 'memory'],
          suggestedAnswer: 'React maintains a Virtual DOM in memory. State changes trigger a new Virtual DOM which is diffed against the old one, batching minimal updates to the real DOM.'
        },
        {
          id: 'swe-t-i2',
          question: 'What are database indexes, and when should you avoid creating them?',
          idealAnswerKeys: ['performance', 'read speeds', 'write operations', 'storage space', 'B-tree'],
          suggestedAnswer: 'Indexes speed up read queries but degrade write performances because index lookup trees must rebuild during updates.'
        }
      ],
      advanced: [
        {
          id: 'swe-t-a1',
          question: 'How do you design a system to handle high concurrency and write-heavy workloads (e.g., millions of logs per second)?',
          idealAnswerKeys: ['message queue', 'load balancer', 'horizontal scaling', 'database sharding', 'caching', 'Redis', 'Kafka'],
          suggestedAnswer: 'Employ load balancers, route writes to message queues (Kafka) to buffer, horizontally scale processors, cache reads (Redis), and shard databases.'
        },
        {
          id: 'swe-t-a2',
          question: 'Explain the event loop in Node.js and how it handles asynchronous execution without blocking.',
          idealAnswerKeys: ['single-threaded', 'call stack', 'callback queue', 'libuv', 'non-blocking', 'thread pool'],
          suggestedAnswer: 'Node.js event loop delegates blocking operations to OS or thread pools, registers callbacks in the callback queue, and executes them when the call stack clears.'
        }
      ]
    },
    hr: {
      beginner: [
        {
          id: 'swe-h-b1',
          question: 'Tell me about a time you had to work with a teammate whose coding style differed from yours.',
          idealAnswerKeys: ['empathy', 'communication', 'collaboration', 'linter', 'standards'],
          suggestedAnswer: 'Focus on establishing linting/coding rules, checking team guidelines, and communicating constructively to maintain system consistency.'
        },
        {
          id: 'swe-h-b2',
          question: 'Why are you pursuing a career in Software Engineering?',
          idealAnswerKeys: ['problem solving', 'impact', 'passion', 'curiosity'],
          suggestedAnswer: 'Share your enthusiasm for building systems, translating user requirements into features, and continuous learning.'
        }
      ],
      intermediate: [
        {
          id: 'swe-h-i1',
          question: 'Tell me about a challenging project you engineered and how you managed project scopes.',
          idealAnswerKeys: ['star method', 'scope creep', 'prioritization', 'results'],
          suggestedAnswer: 'Describe project targets, outline your prioritization decisions when new scopes were requested, and detail metrics-driven outcomes.'
        },
        {
          id: 'swe-h-i2',
          question: 'How do you handle a situation where a developer strongly disagrees with your code review comments?',
          idealAnswerKeys: ['communication', 'respect', 'pair programming', 'standards'],
          suggestedAnswer: 'Have a direct conversation, discuss architectural trade-offs, and reach a consensus based on project patterns.'
        }
      ],
      advanced: [
        {
          id: 'swe-h-a1',
          question: 'How do you lead teams through major system migrations without causing operational downtime?',
          idealAnswerKeys: ['migration plan', 'communication', 'rollback plan', 'shadow runs', 'risk mitigation'],
          suggestedAnswer: 'Establish database double-writes, execute dry runs, prepare detailed rollback options, and coordinate steps with support channels.'
        },
        {
          id: 'swe-h-a2',
          question: 'How do you balance shipping customer features quickly against accumulating technical debt?',
          idealAnswerKeys: ['refactoring', 'tech debt', 'trade-offs', 'business value'],
          suggestedAnswer: 'Evaluate feature values, document technical debt tasks, and secure dedicated engineering capacity in upcoming sprints to address them.'
        }
      ]
    },
    scenario: {
      beginner: [
        {
          id: 'swe-s-b1',
          question: 'Scenario: You notice a typo in a production landing page text. What steps do you take?',
          idealAnswerKeys: ['pull request', 'branch', 'hotfix', 'deploy'],
          suggestedAnswer: 'Create a local hotfix branch, modify the typo, run tests, open a pull request for reviews, and deploy to production.'
        },
        {
          id: 'swe-s-b2',
          question: 'Scenario: A unit test is failing on your local machine but passing in CI. How do you troubleshoot?',
          idealAnswerKeys: ['environment', 'node version', 'cache', 'database'],
          suggestedAnswer: 'Inspect local environment variables, node versions, and local database states to isolate caching or environment mismatches.'
        }
      ],
      intermediate: [
        {
          id: 'swe-s-i1',
          question: 'Scenario: A critical service crash occurs in production. Walk me through your diagnostics protocol.',
          idealAnswerKeys: ['logs analysis', 'rollback first', 'root cause', 'post-mortem'],
          suggestedAnswer: 'Prioritize system recovery by rolling back the recent release, check logs (Datadog/Elastic), address the bug, and write a post-mortem.'
        },
        {
          id: 'swe-s-i2',
          question: 'Scenario: A third-party API your system depends on suddenly stops responding. How do you handle this?',
          idealAnswerKeys: ['circuit breaker', 'fallback', 'logging', 'retry policy'],
          suggestedAnswer: 'Enable circuit breakers, serve cached fallbacks to users, log failures, and schedule automatic exponential back-off retries.'
        }
      ],
      advanced: [
        {
          id: 'swe-s-a1',
          question: 'Scenario: A security audit discovers a zero-day vulnerability in one of your core framework dependencies. How do you respond?',
          idealAnswerKeys: ['vulnerability', 'dependency check', 'patch', 'regression test', 'deploy'],
          suggestedAnswer: 'Isolate affected nodes, download updated security patches, run automated tests to check for breaking changes, and deploy updates immediately.'
        },
        {
          id: 'swe-s-a2',
          question: 'Scenario: You are designing a payment service and need to ensure transactions are processed exactly once. How do you achieve this?',
          idealAnswerKeys: ['idempotency', 'unique key', 'database transaction', 'retry handling'],
          suggestedAnswer: 'Implement idempotency tokens in API headers, log requests in a unique transaction table, and use database constraints to reject duplicate IDs.'
        }
      ]
    }
  },
  frontend: {
    technical: {
      beginner: [
        {
          id: 'fe-t-b1',
          question: 'Explain the CSS Box Model and how box-sizing impacts visual sizing.',
          idealAnswerKeys: ['content', 'padding', 'border', 'margin', 'box-sizing', 'border-box'],
          suggestedAnswer: 'The Box Model consists of content, padding, border, and margin. By default, padding and border are added to width. Setting box-sizing: border-box includes them within the specified width.'
        },
        {
          id: 'fe-t-b2',
          question: 'Explain event delegation in JavaScript and why it is useful.',
          idealAnswerKeys: ['bubbling', 'event listener', 'parent', 'performance', 'target'],
          suggestedAnswer: 'Event delegation places a single event listener on a parent element, leveraging event bubbling to catch events from child nodes. It optimizes performance and handles dynamically added children.'
        }
      ],
      intermediate: [
        {
          id: 'fe-t-i1',
          question: 'Contrast React Hooks (like useEffect) with older Class component lifecycles.',
          idealAnswerKeys: ['functional', 'side effects', 'componentdidmount', 'cleanup', 'dependency array'],
          suggestedAnswer: 'React Hooks allow functional components to manage state and side effects. useEffect replaces componentDidMount, componentDidUpdate, and componentWillUnmount, managing execution via dependency arrays.'
        },
        {
          id: 'fe-t-i2',
          question: 'What are Core Web Vitals, and how do you optimize Largest Contentful Paint (LCP)?',
          idealAnswerKeys: ['lcp', 'performance', 'caching', 'image optimization', 'lazy loading', 'render blocking'],
          suggestedAnswer: 'Core Web Vitals measure user experience benchmarks. To optimize LCP (loading speed), compress images, use modern formats (WebP), defer non-critical JS/CSS, and implement CDN caching.'
        }
      ],
      advanced: [
        {
          id: 'fe-t-a1',
          question: 'What is Micro-Frontend Module Federation, and how does it share state and assets?',
          idealAnswerKeys: ['webpack', 'module federation', 'remote entry', 'shared dependencies', 'state sync'],
          suggestedAnswer: 'Module Federation allows runtime loading of independent build packages. A host loads remote entry bundles dynamically, sharing common dependencies (like React) and communicating state via custom events or store interfaces.'
        },
        {
          id: 'fe-t-a2',
          question: 'How would you structure a modern bundler configuration (e.g., Vite/Webpack) to optimize bundle splitting?',
          idealAnswerKeys: ['code splitting', 'tree shaking', 'dynamic import', 'chunks', 'vendors'],
          suggestedAnswer: 'Use dynamic imports for route splitting, enable tree-shaking by enforcing ES modules, separate vendor dependencies into isolated cacheable chunks, and minify assets.'
        }
      ]
    },
    hr: {
      beginner: [
        {
          id: 'fe-h-b1',
          question: 'Why are you passionate about Frontend Development compared to Backend?',
          idealAnswerKeys: ['ui/ux', 'visual impact', 'user interaction', 'accessibility'],
          suggestedAnswer: 'Passionate about translating user interfaces into smooth responsive websites, direct interaction impacts, and building accessible layouts.'
        },
        {
          id: 'fe-h-b2',
          question: 'How do you handle testing your frontend code for mobile responsiveness?',
          idealAnswerKeys: ['chrome devtools', 'media queries', 'device testing', 'breakpoints'],
          suggestedAnswer: 'Use Chrome DevTools responsive models, test on real physical tablets/phones, and write flexible CSS breakpoints.'
        }
      ],
      intermediate: [
        {
          id: 'fe-h-i1',
          question: 'How do you coordinate with backend engineers to agree on API response schemas?',
          idealAnswerKeys: ['contracts', 'json', 'mocking', 'documentation', 'swagger'],
          suggestedAnswer: 'Align on API data structures before coding, write shared JSON schemas, mock responses for frontend testing, and document via Swagger/Postman.'
        },
        {
          id: 'fe-h-i2',
          question: 'Tell me about a time a client or design partner requested changes that clashed with performance budgets.',
          idealAnswerKeys: ['negotiate', 'performance impact', 'alternatives', 'trade-offs'],
          suggestedAnswer: 'Outline how heavy visual assets impact loading speeds, benchmark metrics, suggest compressed file alternatives, and agree on balance.'
        }
      ],
      advanced: [
        {
          id: 'fe-h-a1',
          question: 'How do you evangelize accessibility (a11y) standards across a product engineering organization?',
          idealAnswerKeys: ['wcag', 'audit tool', 'education', 'reusable components', 'eslint'],
          suggestedAnswer: 'Integrate automated accessibility checks (axe-core) in CI/CD, create accessible design system patterns, write ESLint rules, and run training sessions.'
        },
        {
          id: 'fe-h-a2',
          question: 'How do you lead a frontend engineering team through migrating a massive legacy application to a modern framework?',
          idealAnswerKeys: ['strangler pattern', 'step-by-step', 'design system', 'testing regressions'],
          suggestedAnswer: 'Employ the strangler pattern to rebuild sub-modules incrementally, set up shared state gateways, and ensure thorough regression testing.'
        }
      ]
    },
    scenario: {
      beginner: [
        {
          id: 'fe-s-b1',
          question: 'Scenario: A styling file is not applying overrides to a child component. How do you inspect this?',
          idealAnswerKeys: ['devtools inspect', 'css specificity', 'classname mismatch', 'cascade'],
          suggestedAnswer: 'Open browser DevTools inspection, audit active class cascades, check CSS specificity scores, and verify class names match.'
        },
        {
          id: 'fe-s-b2',
          question: 'Scenario: A form text field experiences lag when typing. How do you diagnose and fix?',
          idealAnswerKeys: ['state updates', 'debouncing', 'uncontrolled input', 're-renders'],
          suggestedAnswer: 'Avoid re-rendering the whole page during keystrokes, use uncontrolled elements or debounced handlers, and keep form state localized.'
        }
      ],
      intermediate: [
        {
          id: 'fe-s-i1',
          question: 'Scenario: Users report layout shifts (CLS issues) during dynamic page content loads. How do you resolve?',
          idealAnswerKeys: ['cumulative layout shift', 'height placeholders', 'aspect ratio', 'skeleton screens'],
          suggestedAnswer: 'Configure explicit width/height dimensions on images, add min-height skeleton blocks for lazy content, and avoid inserting nodes above active viewports.'
        },
        {
          id: 'fe-s-i2',
          question: 'Scenario: A user clicks a search button twice quickly, triggering racing API fetches. How do you fix?',
          idealAnswerKeys: ['abortcontroller', 'debouncing', 'loading state', 'race condition'],
          suggestedAnswer: 'Disable buttons during active loading cycles, debounce handlers, or use AbortController to cancel previous requests.'
        }
      ],
      advanced: [
        {
          id: 'fe-s-a1',
          question: 'Scenario: Your Next.js bundle sizes exceed thresholds, slowing mobile loads. Walk through diagnostics and fixes.',
          idealAnswerKeys: ['bundle analyzer', 'dynamic import', 'tree shaking', 'lazy loading'],
          suggestedAnswer: 'Run @next/bundle-analyzer to detect heavy node libraries, switch to lightweight packages, split routes via dynamic imports, and lazy-load components.'
        },
        {
          id: 'fe-s-a2',
          question: 'Scenario: Collaborative state sync breaks between browser tabs. How do you debug?',
          idealAnswerKeys: ['broadcastchannel', 'localstorage event', 'websockets', 'state updates'],
          suggestedAnswer: 'Inspect WebSocket channels or LocalStorage event listeners, configure BroadcastChannel APIs for tab communication, and log synchronization logs.'
        }
      ]
    }
  },
  backend: {
    technical: {
      beginner: [
        {
          id: 'be-t-b1',
          question: 'Contrast Relational SQL databases against Non-Relational NoSQL databases.',
          idealAnswerKeys: ['schemas', 'joins', 'transactions', 'scalability', 'key-value', 'documents'],
          suggestedAnswer: 'SQL databases are schema-bound, support ACID properties and JOINs. NoSQL databases are schema-less, document or key-value scoped, and scale out horizontally.'
        },
        {
          id: 'be-t-b2',
          question: 'What do standard HTTP status codes in the 200, 400, and 500 ranges signify?',
          idealAnswerKeys: ['success', 'client error', 'server error', '404', '500'],
          suggestedAnswer: '200s indicate successful operations. 400s signify client errors (e.g. invalid request body). 500s represent internal server errors.'
        }
      ],
      intermediate: [
        {
          id: 'be-t-i1',
          question: 'Explain database indexes and the impact of B-Trees on query performance.',
          idealAnswerKeys: ['binary search', 'reads', 'writes', 'index nodes', 'page sizes'],
          suggestedAnswer: 'Indexes structure lookups as balanced trees (B-Trees) to perform logarithmic binary search reads. They slow down writes since the index structures recalculate.'
        },
        {
          id: 'be-t-i2',
          question: 'Explain JWT authentication and how to handle stateless session authorizations safely.',
          idealAnswerKeys: ['jwt signature', 'payload', 'secret key', 'refresh tokens', 'expiry'],
          suggestedAnswer: 'JWTs store user parameters in a signed string verified by a server secret key. Issue short-lived access tokens alongside database refresh tokens.'
        }
      ],
      advanced: [
        {
          id: 'be-t-a1',
          question: 'How do you engineer a system to handle high concurrency and write-heavy workloads (e.g. log ingestion)?',
          idealAnswerKeys: ['message broker', 'write ahead', 'batch inserts', 'horizontal scalability', 'kafka', 'redis'],
          suggestedAnswer: 'Employ load balancers, ingest logs to a broker (Kafka/RabbitMQ) to buffer traffic, and perform bulk asynchronous database writes.'
        },
        {
          id: 'be-t-a2',
          question: 'Contrast process threading models against Node.js async event loops.',
          idealAnswerKeys: ['libuv', 'thread per request', 'blocking i/o', 'context switching', 'single thread'],
          suggestedAnswer: 'Thread models spin up OS threads per request, blocking on I/O. Node.js processes events asynchronously on a single main thread, offloading database operations.'
        }
      ]
    },
    hr: {
      beginner: [
        {
          id: 'be-h-b1',
          question: 'Why are you pursuing backend engineering over frontend?',
          idealAnswerKeys: ['data flow', 'system architecture', 'logic', 'performance'],
          suggestedAnswer: 'Enjoy building database architectures, mapping security checks, managing server networks, and focusing on logic workflows.'
        },
        {
          id: 'be-h-b2',
          question: 'How do you coordinate with database admins when writing queries?',
          idealAnswerKeys: ['communication', 'schema verification', 'benchmarks', 'review'],
          suggestedAnswer: 'Verify schema configurations beforehand, request query optimizations reviews, and coordinate migration schedules.'
        }
      ],
      intermediate: [
        {
          id: 'be-h-i1',
          question: 'How do you handle refusing an API feature request due to security concerns?',
          idealAnswerKeys: ['explain threat', 'compromise', 'auth verification', 'alternatives'],
          suggestedAnswer: 'Highlight security risks (SQL injection/data leaks), present secure alternative API shapes, and align with feature needs.'
        },
        {
          id: 'be-h-i2',
          question: 'Tell me about a database schema migration that went wrong and how you recovered.',
          idealAnswerKeys: ['backup', 'rollback script', 'staging check', 'post-mortem'],
          suggestedAnswer: 'Triggered backups, ran rollback scripts to recover tables, updated validation models, and ran checks on staging environment.'
        }
      ],
      advanced: [
        {
          id: 'be-h-a1',
          question: 'How do you coordinate engineers during a critical database outage?',
          idealAnswerKeys: ['incident command', 'status updates', 'isolation', 'restoration', 'communication'],
          suggestedAnswer: 'Assign an incident commander, delegate database isolation and restore tasks, keep customer managers updated, and conduct post-mortems.'
        },
        {
          id: 'be-h-a2',
          question: 'How do you design architectural roadmaps for moving from monolithic systems to microservices?',
          idealAnswerKeys: ['decoupling', 'bounded context', 'database split', 'apis', 'strangler pattern'],
          suggestedAnswer: 'Identify domain boundaries (bounded contexts), create API schemas, extract functions using the strangler pattern, and split databases.'
        }
      ]
    },
    scenario: {
      beginner: [
        {
          id: 'be-s-b1',
          question: 'Scenario: Your API returns a 500 status code when missing input fields. How do you handle?',
          idealAnswerKeys: ['input validation', '400 bad request', 'middleware', 'try-catch'],
          suggestedAnswer: 'Configure request validation middleware to intercept empty parameters, return a 400 Bad Request, and avoid unhandled exceptions.'
        },
        {
          id: 'be-s-b2',
          question: 'Scenario: A local database connection times out during development. How do you diagnose?',
          idealAnswerKeys: ['connection string', 'port check', 'service status', 'network path'],
          suggestedAnswer: 'Verify database service status, check port listeners, audit connection strings, and confirm credentials.'
        }
      ],
      intermediate: [
        {
          id: 'be-s-i1',
          question: 'Scenario: A memory leak crashes your backend process every 6 hours under load. How do you troubleshoot?',
          idealAnswerKeys: ['heap snapshot', 'profile logs', 'global arrays', 'node inspect', 'garbage collection'],
          suggestedAnswer: 'Take heap snapshots using node-inspect, profile memory limits under mock loads, audit global caching leaks, and verify cleanup listeners.'
        },
        {
          id: 'be-s-i2',
          question: 'Scenario: Slow SQL JOIN queries block backend response times. How do you optimize?',
          idealAnswerKeys: ['explain query', 'indexes', 'cte refactoring', 'denormalization', 'caching'],
          suggestedAnswer: 'Execute EXPLAIN queries to identify slow scanning sequences, create indexes on join keys, and implement cache stores.'
        }
      ],
      advanced: [
        {
          id: 'be-s-a1',
          question: 'Scenario: Sudden DDoS traffic overwhelms database connection limits. How do you mitigate immediately?',
          idealAnswerKeys: ['rate limit', 'connection pool', 'ip ban', 'gateway rules', 'cache read'],
          suggestedAnswer: 'Increase database connection pools, limit client requests via gateways (Cloudflare/Nginx), serve cached views, and block malicious IPs.'
        },
        {
          id: 'be-s-a2',
          question: 'Scenario: A payment gateway integration triggers double charge logs. How do you fix?',
          idealAnswerKeys: ['idempotency key', 'database transaction', 'unique constraint', 'charge validation'],
          suggestedAnswer: 'Enforce payment request idempotency keys, log charge requests inside unique tables, and execute steps in ACID database transactions.'
        }
      ]
    }
  },
  fullstack: {
    technical: {
      beginner: [
        {
          id: 'fs-t-b1',
          question: 'Explain client-server architectures and how browser layout interacts with backend routers.',
          idealAnswerKeys: ['client-server', 'http request', 'json payloads', 'routing', 'dom'],
          suggestedAnswer: 'Clients request resources via HTTP. The backend router processes requests, queries databases, and sends back JSON datasets. The client parses data to update DOM structures.'
        },
        {
          id: 'fs-t-b2',
          question: 'Contrast client LocalStorage against Session Cookies.',
          idealAnswerKeys: ['storage limits', 'session expiry', 'http headers', 'security tags'],
          suggestedAnswer: 'LocalStorage holds up to 5MB, persisting across browser restarts. Cookies hold up to 4KB, auto-expire, and can be sent automatically via HTTP headers.'
        }
      ],
      intermediate: [
        {
          id: 'fs-t-i1',
          question: 'What is CORS, and how do you resolve cross-origin request blockers?',
          idealAnswerKeys: ['cors headers', 'origins whitelist', 'preflight OPTIONS', 'middleware'],
          suggestedAnswer: 'CORS prevents browsers from calling APIs hosted on different domains. Fix by configuring backend middleware to append Access-Control-Allow-Origin headers whitelisting the client.'
        },
        {
          id: 'fs-t-i2',
          question: 'Explain the Model-View-Controller (MVC) design pattern.',
          idealAnswerKeys: ['model db', 'view template', 'controller logic', 'separation of concerns'],
          suggestedAnswer: 'MVC separates concerns. Models declare database configurations, Views render templates/UIs, and Controllers map business logic routing.'
        }
      ],
      advanced: [
        {
          id: 'fs-t-a1',
          question: 'Contrast Server-Side Rendering (SSR) against Static Site Generation (SSG) in frameworks like Next.js.',
          idealAnswerKeys: ['ssr runtime', 'ssg compile', 'incremental build', 'seo', 'hydration'],
          suggestedAnswer: 'SSR renders HTML page models at runtime per request, ensuring dynamic data loads. SSG compiles static HTML files during project build stages, maximizing loading speeds and SEO.'
        },
        {
          id: 'fs-t-a2',
          question: 'How do you sync database records across multi-region horizontally scaled nodes?',
          idealAnswerKeys: ['replication lag', 'read replicas', 'eventual consistency', 'write scaling'],
          suggestedAnswer: 'Deploy read replicas across regions, routing writes to a master node. Acknowledge eventual replication lag or utilize distributed databases.'
        }
      ]
    },
    hr: {
      beginner: [
        {
          id: 'fs-h-b1',
          question: 'Why do you prefer a Full Stack role instead of dedicating focus to Frontend or Backend?',
          idealAnswerKeys: ['broad view', 'end-to-end features', 'flexibility', 'integration speed'],
          suggestedAnswer: 'Enjoy building end-to-end features, mapping data schemas, designing UI templates, and resolving integration challenges directly.'
        },
        {
          id: 'fs-h-b2',
          question: 'How do you organize your work day when switching between backend and frontend tasks?',
          idealAnswerKeys: ['prioritization', 'context switching', 'time blocking', 'task organization'],
          suggestedAnswer: 'Group related tasks into dedicated time blocks, complete API definitions before coding frontend UI, and track tasks via agile boards.'
        }
      ],
      intermediate: [
        {
          id: 'fs-h-i1',
          question: 'How do you explain technical database schema compromises to product managers?',
          idealAnswerKeys: ['non-technical language', 'trade-offs', 'timeline impact', 'scalability limits'],
          suggestedAnswer: 'Explain constraints in simple terms (e.g. data load speeds), present development timeline trade-offs, and suggest simplified data templates.'
        },
        {
          id: 'fs-h-i2',
          question: 'Tell me about a time you had to meet a tight deadline for a feature launch.',
          idealAnswerKeys: ['mvp scope', 'daily checkins', 'focusing efforts', 'delivering outcomes'],
          suggestedAnswer: 'Focused efforts on core MVP features, deferred low-priority scopes, wrote automated tests for critical lines, and met launch dates.'
        }
      ],
      advanced: [
        {
          id: 'fs-h-a1',
          question: 'How do you architect a new SaaS application stack from scratch?',
          idealAnswerKeys: ['stack criteria', 'scalability requirements', 'framework selections', 'infra planning'],
          suggestedAnswer: 'Evaluate operational parameters, plan database scale patterns (Postgres/Redis), choose developer-friendly frameworks (Next.js/Node), and set up automated deployments.'
        },
        {
          id: 'fs-h-a2',
          question: 'How do you lead developer teams through transitioning major framework code bases?',
          idealAnswerKeys: ['communication', 'migration sprints', 'testing coverage', 'documentation updates'],
          suggestedAnswer: 'Map out milestone sprints, set up migration guides, write integration test matrices, and refactor legacy sections step-by-step.'
        }
      ]
    },
    scenario: {
      beginner: [
        {
          id: 'fs-s-b1',
          question: 'Scenario: Frontend states are out of sync with backend database records. How do you troubleshoot?',
          idealAnswerKeys: ['polling', 'state management', 'api response refresh', 'network logs'],
          suggestedAnswer: 'Verify fetch logs in network tabs, ensure backend responses match, and trigger frontend state re-fetches after mutations.'
        },
        {
          id: 'fs-s-b2',
          question: 'Scenario: User input values trigger database constraint errors on the backend. How do you resolve?',
          idealAnswerKeys: ['schema matching', 'form validation', 'error boundaries', 'logs audit'],
          suggestedAnswer: 'Implement matching form validations on the client, clean parameters before DB query calls, and log exception types.'
        }
      ],
      intermediate: [
        {
          id: 'fs-s-i1',
          question: 'Scenario: Client fetch requests fail due to CORS blockers. How do you resolve?',
          idealAnswerKeys: ['cors middleware', 'allowed headers', 'whitelist origins', 'gateway setups'],
          suggestedAnswer: 'Enable CORS middleware on the server, configure whitelist arrays for the client origin, and verify CORS headers.'
        },
        {
          id: 'fs-s-i2',
          question: 'Scenario: Heavy image uploads stall client pages and crash server memory. How do you optimize?',
          idealAnswerKeys: ['s3 presigned urls', 'image compression client side', 'async worker', 'storage service'],
          suggestedAnswer: 'Compress image bundles on the client, request S3 pre-signed URLs to bypass the backend server, and upload files directly to cloud storage.'
        }
      ],
      advanced: [
        {
          id: 'fs-s-a1',
          question: 'Scenario: Session authorization status drops during pages navigation in multi-node environments. How do you resolve?',
          idealAnswerKeys: ['sticky sessions', 'redis session store', 'stateless jwt', 'db checks'],
          suggestedAnswer: 'Transition to stateless JWT tokens whitelisted in Redis, or configure a centralized session database accessible by all nodes.'
        },
        {
          id: 'fs-s-a2',
          question: 'Scenario: Dual-write operations trigger inconsistencies across search indexes and databases. How do you fix?',
          idealAnswerKeys: ['outbox pattern', 'event queue', 'transaction boundary', 'reconciliations'],
          suggestedAnswer: 'Implement the transactional outbox pattern, write events to an outbox table, and publish them to elasticsearch indexers using broker tasks.'
        }
      ]
    }
  },
  ai: {
    technical: {
      beginner: [
        {
          id: 'ai-t-b1',
          question: 'Contrast zero-shot, one-shot, and few-shot prompt engineering techniques.',
          idealAnswerKeys: ['prompting', 'examples', 'few-shot', 'zero-shot', 'llm context'],
          suggestedAnswer: 'Zero-shot asks LLMs to execute tasks without examples. One-shot provides a single input-output example. Few-shot lists multiple examples to guide output formats.'
        },
        {
          id: 'ai-t-b2',
          question: 'How do LLM tokens influence model costs and context limits?',
          idealAnswerKeys: ['tokens definition', 'pricing metrics', 'context window', 'payload cuts'],
          suggestedAnswer: 'Tokens are semantic word fragments. Models charge per million input/output tokens. Exceeding context windows causes model truncation errors.'
        }
      ],
      intermediate: [
        {
          id: 'ai-t-i1',
          question: 'Explain Retrieval Augmented Generation (RAG) and why it is useful.',
          idealAnswerKeys: ['context injection', 'hallucinations', 'semantic vectors', 'document chunks'],
          suggestedAnswer: 'RAG retrieves relevant information chunks from document vector stores and injects them into model prompts. This mitigates hallucinations and integrates internal files.'
        },
        {
          id: 'ai-t-i2',
          question: 'Explain vector database indexes and semantic distance queries.',
          idealAnswerKeys: ['cosine similarity', 'embeddings vectors', 'dimension weights', 'nearest neighbors'],
          suggestedAnswer: 'Vector databases index high-dimensional embeddings. Semantic searches use metrics like cosine similarity to locate nearest neighbor vectors.'
        }
      ],
      advanced: [
        {
          id: 'ai-t-a1',
          question: 'Explain agentic tool calling and loop execution structures.',
          idealAnswerKeys: ['function schema', 'agent loops', 'stop conditions', 'json parsing', 'validation'],
          suggestedAnswer: 'Models output function schemas (tool calls) matching input questions. The agent code runs the tools, feeds parameters back to the LLM, and repeats until target goals are reached.'
        },
        {
          id: 'ai-t-a2',
          question: 'How do stateful graph agent networks (like LangGraph) differ from linear chains?',
          idealAnswerKeys: ['langgraph states', 'graph cycles', 'routing decisions', 'conditional edges', 'loops'],
          suggestedAnswer: 'Linear chains execute steps sequentially. Stateful graph networks route tasks dynamically using conditional edges and loop gates.'
        }
      ]
    },
    hr: {
      beginner: [
        {
          id: 'ai-h-b1',
          question: 'Why are you specializing in AI Engineering over standard software engineering?',
          idealAnswerKeys: ['generative systems', 'ai products', 'problem solving', 'innovation'],
          suggestedAnswer: 'Fascinated by agentic systems, conversational interfaces, semantic search tools, and automating work via LLM logic.'
        },
        {
          id: 'ai-h-b2',
          question: 'How do you explain model response latency delays to non-technical users?',
          idealAnswerKeys: ['token generation', 'network bounds', 'streaming output', 'simple terms'],
          suggestedAnswer: 'Explain that the AI compiles responses word-by-word (tokenization), and implement streaming outputs to show progress.'
        }
      ],
      intermediate: [
        {
          id: 'ai-h-i1',
          question: 'How do you address AI safety, content validation, and bias risks in consumer features?',
          idealAnswerKeys: ['guardrails', 'content filters', 'jailbreak prompts', 'evaluators'],
          suggestedAnswer: 'Set up system prompts restricting topic scopes, deploy content evaluation checkers, and audit jailbreak tests.'
        },
        {
          id: 'ai-h-i2',
          question: 'Tell me about a time you resolved a major LLM hallucination issue.',
          idealAnswerKeys: ['rag context', 'strict parameters', 'few shot logs', 'system prompt validation'],
          suggestedAnswer: 'Improved RAG chunking relevance, instructed the model to answer "I don\'t know" if facts are absent, and set model temperatures to 0.'
        }
      ],
      advanced: [
        {
          id: 'ai-h-a1',
          question: 'How do you decide between hosting open source models vs calling API endpoints (OpenAI/Anthropic)?',
          idealAnswerKeys: ['cost models', 'data privacy', 'latency criteria', 'infrastructure costs', 'fine-tuning'],
          suggestedAnswer: 'API endpoints offer quick integrations. Open-source models (Llama) are preferred for data privacy, high-throughput, and customization.'
        },
        {
          id: 'ai-h-a2',
          question: 'How do you manage compute resource costs when scaling AI agent systems?',
          idealAnswerKeys: ['caching prompts', 'rate boundaries', 'filtering queries', 'token limit caps'],
          suggestedAnswer: 'Implement semantic cache gates to reduce LLM calls, cache prompt prefixes, and configure token count restrictions.'
        }
      ]
    },
    scenario: {
      beginner: [
        {
          id: 'ai-s-b1',
          question: 'Scenario: An AI prompt output returns empty text brackets. How do you debug?',
          idealAnswerKeys: ['api status', 'system prompt check', 'parse errors', 'json format constraints'],
          suggestedAnswer: 'Verify API call status logs, check response formatting templates, and audit system constraints.'
        },
        {
          id: 'ai-s-b2',
          question: 'Scenario: The LLM model output cuts off mid-sentence. How do you resolve?',
          idealAnswerKeys: ['max tokens limit', 'context size limit', 'output truncation', 're-request'],
          suggestedAnswer: 'Increase max_tokens configuration bounds, reduce input prompt context sizes, or instruct user prompts to be shorter.'
        }
      ],
      intermediate: [
        {
          id: 'ai-s-i1',
          question: 'Scenario: RAG searches return outdated document segments. How do you update?',
          idealAnswerKeys: ['vector indexing schedule', 'document versioning', 'metadata stamps', 'cache clearance'],
          suggestedAnswer: 'Create automatic vector index refresh pipelines, append metadata date stamps, and clear semantic search cache stores.'
        },
        {
          id: 'ai-s-i2',
          question: 'Scenario: Your agent hits API rate limits during batch analysis tasks. How do you resolve?',
          idealAnswerKeys: ['exponential backoff', 'request queue', 'concurrency throttling', 'retry policy'],
          suggestedAnswer: 'Configure exponential back-off handlers, queue request tasks, and throttle concurrent threads.'
        }
      ],
      advanced: [
        {
          id: 'ai-s-a1',
          question: 'Scenario: An autonomous agent gets stuck loop tool calling the same method. How do you recover?',
          idealAnswerKeys: ['max iteration limit', 'loop detection', 'prompt context update', 'agent reset'],
          suggestedAnswer: 'Enforce max iteration thresholds, write loop detection checks in agent runners, and update context guidelines.'
        },
        {
          id: 'ai-s-a2',
          question: 'Scenario: Prompt injection overrides model system instructions. How do you secure?',
          idealAnswerKeys: ['input isolation', 'guardrails API', 'system prompts formatting', 'defense checks'],
          suggestedAnswer: 'Sanitize user inputs, isolate content parameters, use XML tag separators, and run input validation checkers.'
        }
      ]
    }
  },
  ml: {
    technical: {
      beginner: [
        {
          id: 'ml-t-b1',
          question: 'Explain the difference between supervised and unsupervised learning.',
          idealAnswerKeys: ['labeled data', 'unlabeled data', 'classification', 'clustering', 'regression'],
          suggestedAnswer: 'Supervised learning trains models on labeled datasets (e.g. classification). Unsupervised learning identifies patterns in unlabeled data (e.g. clustering).'
        },
        {
          id: 'ml-t-b2',
          question: 'What is overfitting and how do you diagnose it?',
          idealAnswerKeys: ['train error', 'test validation error', 'complexity', 'generalization'],
          suggestedAnswer: 'Overfitting occurs when a model fits training noise instead of underlying patterns, resulting in low training error but high test error.'
        }
      ],
      intermediate: [
        {
          id: 'ml-t-i1',
          question: 'Explain the precision-recall trade-off and when you prioritize one over the other.',
          idealAnswerKeys: ['precision tp fp', 'recall tp fn', 'f1-score', 'false positives', 'false negatives'],
          suggestedAnswer: 'Precision measures correct positive predictions (minimizing false positives). Recall measures positive captures (minimizing false negatives). Balance via F1-score.'
        },
        {
          id: 'ml-t-i2',
          question: 'Why do you perform feature scaling and what is the difference between standardization and normalization?',
          idealAnswerKeys: ['gradient descent', 'standardization mean variance', 'normalization bounds', 'minmax'],
          suggestedAnswer: 'Feature scaling speeds up gradient descent. Normalization scales values between 0 and 1. Standardization centers values around mean 0 and variance 1.'
        }
      ],
      advanced: [
        {
          id: 'ml-t-a1',
          question: 'Explain model fine-tuning architectures such as LoRA and QLoRA.',
          idealAnswerKeys: ['low rank adaptation', 'weights freezing', 'quantized matrices', 'adapters', 'peft'],
          suggestedAnswer: 'LoRA freezes base model weights and trains low-rank adapter matrices. QLoRA quantizes the base model to 4-bit precision to reduce GPU memory requirements.'
        },
        {
          id: 'ml-t-a2',
          question: 'How do you design a low-latency model inference server (e.g., Triton or vLLM)?',
          idealAnswerKeys: ['triton dynamic batching', 'vllm pagedattention', 'gpu cache pooling', 'throughput', 'concurrency'],
          suggestedAnswer: 'Deploy Triton Dynamic Batching or vLLM PagedAttention to optimize GPU memory caching, reducing key-value cache fragmentation.'
        }
      ]
    },
    hr: {
      beginner: [
        {
          id: 'ml-h-b1',
          question: 'Why did you choose ML engineering over data science?',
          idealAnswerKeys: ['ml systems', 'production models', 'mlops', 'software development'],
          suggestedAnswer: 'Prefer developing production-ready systems, coding deployment workflows, and building pipeline automation.'
        },
        {
          id: 'ml-h-b2',
          question: 'How do you document model training parameters and metrics for your team?',
          idealAnswerKeys: ['mlflow', 'git logs', 'jupyter notebooks', 'documentation'],
          suggestedAnswer: 'Log training runs in MLflow, capture parameters and metrics, and share notebook records.'
        }
      ],
      intermediate: [
        {
          id: 'ml-h-i1',
          question: 'How do you explain model performance degradation to business stakeholders?',
          idealAnswerKeys: ['data drift', 'kpi impacts', 'metrics mapping', 'non-technical terms'],
          suggestedAnswer: 'Map model performance (accuracy drops) to business impacts, explain data drift, and present retraining timelines.'
        },
        {
          id: 'ml-h-i2',
          question: 'Tell me about a disagreement on training data sources and how you resolved it.',
          idealAnswerKeys: ['validation tests', 'data quality', 'bias analysis', 'compromise'],
          suggestedAnswer: 'Conducted validation checks to measure accuracy differences, audited data bias, and agreed on data sources.'
        }
      ],
      advanced: [
        {
          id: 'ml-h-a1',
          question: 'How do you define the end-to-end MLOps pipeline strategy for a team?',
          idealAnswerKeys: ['mlflow', 'dvc data', 'airflow orchestrations', 'model registry', 'monitoring'],
          suggestedAnswer: 'Set up DVC for data versioning, MLflow for tracking, Airflow for pipelines, registries for model versions, and monitoring alerts.'
        },
        {
          id: 'ml-h-a2',
          question: 'How do you justify GPU computing expenses to management?',
          idealAnswerKeys: ['roi metrics', 'batch execution optimizations', 'quantized costs', 'performance gains'],
          suggestedAnswer: 'Quantify accuracy gains, optimize model batching, track inference costs, and present ROI improvements.'
        }
      ]
    },
    scenario: {
      beginner: [
        {
          id: 'ml-s-b1',
          question: 'Scenario: Your PyTorch training script crashes with a tensor shape mismatch. How do you debug?',
          idealAnswerKeys: ['tensor print shape', 'matrix dimensions', 'debugging breakpoint', 'reshaping views'],
          suggestedAnswer: 'Insert print checks, verify matrix dimension alignments, and adjust tensor shapes via view() or reshape() methods.'
        },
        {
          id: 'ml-s-b2',
          question: 'Scenario: Validation set accuracy is high but model performs poorly in production. Why?',
          idealAnswerKeys: ['data leakage', 'train validation split bias', 'overfitting', 'covariate shift'],
          suggestedAnswer: 'Check for data leakage, audit training data splits, and evaluate model performance under production constraints.'
        }
      ],
      intermediate: [
        {
          id: 'ml-s-i1',
          question: 'Scenario: Model drift degrades classification accuracies in production. How do you handle?',
          idealAnswerKeys: ['retraining trigger', 'monitoring logs', 'drift measurement ks-test', 'baseline verification'],
          suggestedAnswer: 'Run Kolmogorov-Smirnov checks to identify covariate drift, trigger retraining pipelines, and benchmark models.'
        },
        {
          id: 'ml-s-i2',
          question: 'Scenario: Your model training script crashes with an out-of-memory error. How do you resolve?',
          idealAnswerKeys: ['reduce batch size', 'gradient accumulation', 'mixed precision fp16', 'garbage collection'],
          suggestedAnswer: 'Reduce batch sizing, configure gradient accumulation, enable mixed-precision (FP16), and clear GPU caches.'
        }
      ],
      advanced: [
        {
          id: 'ml-s-a1',
          question: 'Scenario: Model latency spikes under load. How do you optimize for production?',
          idealAnswerKeys: ['model quantization tensorrt', 'batching rules', 'triton dynamic queues', 'parallel streams'],
          suggestedAnswer: 'Quantize models using TensorRT, enable Triton dynamic batching, and scale inference pods.'
        },
        {
          id: 'ml-s-a2',
          question: 'Scenario: Retraining pipelines fail validation checks due to training data bias. How do you fix?',
          idealAnswerKeys: ['data sampling adjustments', 'bias checks', 'data filtering', 'pipeline thresholds'],
          suggestedAnswer: 'Audit data distributions, adjust sampling weights, verify bias metrics, and rebuild pipelines.'
        }
      ]
    }
  },
  pm: {
    technical: {
      beginner: [
        {
          id: 'pm-t-b1',
          question: 'Explain the Product Lifecycle (PLC) phases and the role of PMs in each.',
          idealAnswerKeys: ['introduction', 'growth', 'maturity', 'decline', 'metrics', 'roadmap'],
          suggestedAnswer: 'PLC consists of Introduction (product-market fit), Growth (scaling), Maturity (optimizing), and Decline. PMs manage priorities, metrics, and roadmap planning.'
        },
        {
          id: 'pm-t-b2',
          question: 'What is the RICE prioritization framework and how do you calculate scores?',
          idealAnswerKeys: ['reach', 'impact', 'confidence', 'effort', 'calculation ratio'],
          suggestedAnswer: 'RICE scores features via Reach, Impact, and Confidence divided by Effort. It prioritizes high-value tasks.'
        }
      ],
      intermediate: [
        {
          id: 'pm-t-i1',
          question: 'How do you identify a North Star Metric and keep teams aligned to it?',
          idealAnswerKeys: ['north star metric', 'leading indicators', 'retention goals', 'value delivery'],
          suggestedAnswer: 'A North Star Metric represents the core value delivered to users. Deconstruct it into team inputs and track progress.'
        },
        {
          id: 'pm-t-i2',
          question: 'How do you design and evaluate an A/B testing framework?',
          idealAnswerKeys: ['hypothesis', 'sample sizes', 'p-value significance', 'metrics tracking', 'variants'],
          suggestedAnswer: 'Define hypotheses, configure control and test variants, calculate sample sizes, run tests, and check p-values for significance.'
        }
      ],
      advanced: [
        {
          id: 'pm-t-a1',
          question: 'Explain API product architectures and how you define technical specifications for integrations.',
          idealAnswerKeys: ['api contract schema', 'endpoints definitions', 'rate limits', 'developer portal', 'webhooks'],
          suggestedAnswer: 'Define API specifications, endpoint schemas, validation constraints, rate boundaries, webhooks, and sandbox testing resources.'
        },
        {
          id: 'pm-t-a2',
          question: 'How do you design a Go-To-Market (GTM) strategy for a complex SaaS feature launch?',
          idealAnswerKeys: ['positioning frameworks', 'customer segments', 'launch stages', 'sales enablement', 'metrics KPI'],
          suggestedAnswer: 'Define target user segments, refine feature messaging, schedule phased rollouts, prepare sales materials, and track adoption KPIs.'
        }
      ]
    },
    hr: {
      beginner: [
        {
          id: 'pm-h-b1',
          question: 'Why did you choose Product Management over standard software engineering or design?',
          idealAnswerKeys: ['strategy planning', 'problem definition', 'cross functional teamwork', 'market analysis'],
          suggestedAnswer: 'Enjoy planning strategy, coordinate cross-functional teams, align products with customer needs, and drive business growth.'
        },
        {
          id: 'pm-h-b2',
          question: 'How do you handle team disagreements during backlog prioritization?',
          idealAnswerKeys: ['objective prioritization', 'customer insights', 'metrics checks', 'alignment meetings'],
          suggestedAnswer: 'Utilize objective prioritization models (RICE), reference user feedback, and facilitate alignment meetings.'
        }
      ],
      intermediate: [
        {
          id: 'pm-h-i1',
          question: 'How do you decline a major feature request from a key customer account?',
          idealAnswerKeys: ['empathy customer', 'roadmap explanation', 'alternatives proposal', 'strategic criteria'],
          suggestedAnswer: 'Validate customer concerns, explain strategic direction constraints, propose alternatives, and offer temporary fixes.'
        },
        {
          id: 'pm-h-i2',
          question: 'Tell me about a time team velocity dropped and how you addressed it.',
          idealAnswerKeys: ['blockers audit', 'retrospective discussions', 'process tweaks', 'scope management'],
          suggestedAnswer: 'Audited sprint blockers, optimized Jira tasks, coordinated developer reviews, and managed sprint scopes.'
        }
      ],
      advanced: [
        {
          id: 'pm-h-a1',
          question: 'How do you present product roadmap pivots to executive leadership teams?',
          idealAnswerKeys: ['data driven proofs', 'strategic vision alignment', 'milestone adjustments', 'financial metrics'],
          suggestedAnswer: 'Present metrics-driven insights, align updates with business goals, show timeline shifts, and detail ROI improvements.'
        },
        {
          id: 'pm-h-a2',
          question: 'How do you lead product transformations during down-market changes?',
          idealAnswerKeys: ['cost rationalization', 'core value retention', 'feature consolidation', 'team focus shifts'],
          suggestedAnswer: 'Consolidate redundant modules, focus roadmap milestones on retention, reduce costs, and focus on core customer value.'
        }
      ]
    },
    scenario: {
      beginner: [
        {
          id: 'pm-s-b1',
          question: 'Scenario: Sprint scope creep occurs mid-sprint. How do you manage?',
          idealAnswerKeys: ['scope boundaries check', 'defer tasks', 'stakeholder check', 'sprint goal safety'],
          suggestedAnswer: 'Audit new feature scopes, evaluate sprint goals impact, defer tasks to upcoming cycles, and clarify requirements.'
        },
        {
          id: 'pm-s-b2',
          question: 'Scenario: Your product dashboard reveals team velocity drops. How do you analyze?',
          idealAnswerKeys: ['burndown chart checks', 'developer checkins', 'dependency audits', 'jira tickets reviews'],
          suggestedAnswer: 'Inspect sprint burndown charts, identify dependency bottlenecks, check developer inputs, and simplify user stories.'
        }
      ],
      intermediate: [
        {
          id: 'pm-s-i1',
          question: 'Scenario: Customer active counts drop after updates release. How do you respond?',
          idealAnswerKeys: ['metric alerts validation', 'user session logs', 'rollback plans', 'feedback surveys'],
          suggestedAnswer: 'Validate analytics dashboards, inspect session logs for errors, consult customer support logs, and roll back if issues persist.'
        },
        {
          id: 'pm-s-i2',
          question: 'Scenario: User interviews reveal navigation layout confusion. How do you resolve?',
          idealAnswerKeys: ['wireframe mockups', 'interaction designer alignments', 'usability tests', 'hotfix planning'],
          suggestedAnswer: 'Review designs with the UX team, schedule card sorting tests, map layout revisions, and update roadmaps.'
        }
      ],
      advanced: [
        {
          id: 'pm-s-a1',
          question: 'Scenario: A competitor launches a cheaper alternative of your core product. How do you react?',
          idealAnswerKeys: ['market feature analysis', 'differentiators mapping', 'pricing audits', 'retention focus'],
          suggestedAnswer: 'Map features comparison, focus on differentiators, adjust pricing strategies, and prioritize retention roadmaps.'
        },
        {
          id: 'pm-s-a2',
          question: 'Scenario: Major platform downtime violates SLA contracts. How do you manage stakeholders?',
          idealAnswerKeys: ['transparent communication', 'incident logs audits', 'compensation models', 'recovery roadmap updates'],
          suggestedAnswer: 'Issue transparent updates, coordinate SLA credit compensations, present recovery roadmaps, and publish root-cause reports.'
        }
      ]
    }
  },
  ds: {
    technical: {
      beginner: [
        {
          id: 'ds-t-b1',
          question: 'Explain descriptive vs inferential statistics and when you use each.',
          idealAnswerKeys: ['descriptive summarize', 'inferential population hypothesis', 'mean deviation', 'sample sets'],
          suggestedAnswer: 'Descriptive statistics summarize dataset metrics (mean/variance). Inferential statistics draw conclusions about population parameters from sample sets using hypothesis testing.'
        },
        {
          id: 'ds-t-b2',
          question: 'Explain SQL database query aggregation functions and GROUP BY limits.',
          idealAnswerKeys: ['sql aggregation', 'group by rows', 'having filters', 'joins execution'],
          suggestedAnswer: 'Aggregations calculate summaries (SUM/AVG) over rows. GROUP BY groups matching inputs, filtered via HAVING clauses.'
        }
      ],
      intermediate: [
        {
          id: 'ds-t-i1',
          question: 'Explain hypothesis testing, p-values, and statistical significance.',
          idealAnswerKeys: ['null hypothesis', 'p-value alpha', 'significance level', 'type 1 error'],
          suggestedAnswer: 'Hypothesis testing evaluates a null hypothesis. The p-value measures the probability of observing results under the null hypothesis. Reject it if the p-value is less than alpha.'
        },
        {
          id: 'ds-t-i2',
          question: 'What is exploratory data analysis (EDA) and how do you handle missing values?',
          idealAnswerKeys: ['pandas cleaning', 'imputation methods', 'outliers diagnostics', 'plots correlations'],
          suggestedAnswer: 'EDA involves analyzing datasets to summarize main characteristics, using plots and data cleaning techniques like mean/median imputation.'
        }
      ],
      advanced: [
        {
          id: 'ds-t-a1',
          question: 'Explain Principal Component Analysis (PCA) and dimensionality reduction mechanics.',
          idealAnswerKeys: ['eigenvectors covariance', 'dimensionality reduction', 'variance retention', 'projections'],
          suggestedAnswer: 'PCA projects high-dimensional data onto orthogonal directions (principal components) of maximum variance, using eigenvectors of the covariance matrix.'
        },
        {
          id: 'ds-t-a2',
          question: 'Explain distributed data computing architectures using PySpark.',
          idealAnswerKeys: ['pyspark datasets', 'rdd transformations', 'lazy evaluation', 'data partitioning'],
          suggestedAnswer: 'PySpark distributes data frames across clusters, executing parallel RDD transformations using lazy evaluation to optimize execution plans.'
        }
      ]
    },
    hr: {
      beginner: [
        {
          id: 'ds-h-b1',
          question: 'Why did you choose Data Science over general software engineering?',
          idealAnswerKeys: ['statistical analysis', 'patterns extraction', 'business decision data', 'modeling'],
          suggestedAnswer: 'Enthusiastic about applying mathematical modeling, extracting patterns from datasets, and driving business decisions.'
        },
        {
          id: 'ds-h-b2',
          question: 'How do you explain statistical correlation patterns to non-technical business partners?',
          idealAnswerKeys: ['simple terminology', 'visual charts', 'causation limits', 'business metrics'],
          suggestedAnswer: 'Use simple terms (e.g. variables moving together), present visual scatter plots, and clarify that correlation does not imply causation.'
        }
      ],
      intermediate: [
        {
          id: 'ds-h-i1',
          question: 'How do you handle modeling tasks when target data availability is low?',
          idealAnswerKeys: ['data synthesis', 'proxy metrics', 'transfer learning', 'sample constraints'],
          suggestedAnswer: 'Leverage proxy metrics, generate synthetic data samples, use transfer learning models, and document constraints.'
        },
        {
          id: 'ds-h-i2',
          question: 'Tell me about a time you defended your experimental testing design during project reviews.',
          idealAnswerKeys: ['sample size checks', 'bias exclusions', 'statistical bounds', 'metrics validation'],
          suggestedAnswer: 'Presented sample sizing formulas, proved random assignment integrity, and defended statistical significance criteria.'
        }
      ],
      advanced: [
        {
          id: 'ds-h-a1',
          question: 'How do you establish data science best practices for warehousing data sets?',
          idealAnswerKeys: ['schema standards', 'version controls database', 'pipeline validations', 'security policies'],
          suggestedAnswer: 'Enforce schema version control, write data pipelines verification checks, configure security audits, and log metrics.'
        },
        {
          id: 'ds-h-a2',
          question: 'How do you demonstrate data science modeling ROI to board members?',
          idealAnswerKeys: ['revenue metrics', 'conversion rate improvements', 'system cost cuts', 'business goals'],
          suggestedAnswer: 'Link model metrics (precision) to business outcomes, show cost reductions, and present ROI changes.'
        }
      ]
    },
    scenario: {
      beginner: [
        {
          id: 'ds-s-b1',
          question: 'Scenario: A CSV data file contains high proportions of null records. How do you preprocess?',
          idealAnswerKeys: ['imputation mean median', 'drop rows constraints', 'null checks script', 'flag values'],
          suggestedAnswer: 'Impute missing values using mean/median/mode, drop rows exceeding threshold limits, and log flag columns.'
        },
        {
          id: 'ds-s-b2',
          question: 'Scenario: Your python data cleaning script crashes due to out-of-memory errors. How do you resolve?',
          idealAnswerKeys: ['chunk loading pandas', 'data type downcasting', 'generator functions', 'gc collection'],
          suggestedAnswer: 'Load files in chunks via Pandas, downcast integer/float types, use generators, and trigger garbage collection.'
        }
      ],
      intermediate: [
        {
          id: 'ds-s-i1',
          question: 'Scenario: An A/B test results in statistically inconclusive patterns. How do you advise product teams?',
          idealAnswerKeys: ['sample sizing checks', 'test duration extensions', 'segmentation reviews', 'p-value limits'],
          suggestedAnswer: 'Audit sample sizes, extend test durations, segment user groups, and advise on statistical power limitations.'
        },
        {
          id: 'ds-s-i2',
          question: 'Scenario: You detect significant labels bias inside training datasets. How do you mitigate?',
          idealAnswerKeys: ['stratified sampling', 'bias checks', 'data filtering', 'class balancing algorithms'],
          suggestedAnswer: 'Rebalance classes via stratified sampling, apply class weights during training, and audit dataset labels.'
        }
      ],
      advanced: [
        {
          id: 'ds-s-a1',
          question: 'Scenario: Upstream database schema modifications break running data pipelines. How do you recover?',
          idealAnswerKeys: ['schema registries checks', 'pipeline error boundaries', 'fallback schemas', 'notifications log'],
          suggestedAnswer: 'Verify schema registries, implement robust pipeline error boundaries, run fallback schemas, and alert databases admins.'
        },
        {
          id: 'ds-s-a2',
          question: 'Scenario: Model prediction accuracy drops significantly in production. How do you debug?',
          idealAnswerKeys: ['data drift verification', 'retraining checks', 'feature updates checks', 'accuracy metrics tracking'],
          suggestedAnswer: 'Verify data drift, evaluate feature inputs, run model checks against gold standard datasets, and log accuracies.'
        }
      ]
    }
  },
  ux: {
    technical: {
      beginner: [
        {
          id: 'ux-t-b1',
          question: 'Explain visual hierarchy and how contrast, sizing, and spacing guide user navigation.',
          idealAnswerKeys: ['layout reading patterns', 'contrast weights', 'visual grids', 'whitespace margins'],
          suggestedAnswer: 'Visual hierarchy guides layouts using contrast (color/weight), sizing (headers vs body), and whitespace to direct user attention.'
        },
        {
          id: 'ux-t-b2',
          question: 'Explain low-fidelity wireframing steps and layout mockups strategies.',
          idealAnswerKeys: ['sitemaps', 'user flow mapping', 'wireframes layouts', 'feedback iterations'],
          suggestedAnswer: 'Map user flows, sketch layout wireframes to establish component placements, and iterate based on initial feedback.'
        }
      ],
      intermediate: [
        {
          id: 'ux-t-i1',
          question: 'Explain design systems implementation and components configuration rules in Figma.',
          idealAnswerKeys: ['auto-layout constraints', 'component variants set', 'design tokens overrides', 'consistent styles'],
          suggestedAnswer: 'Design systems use auto-layout, configure variants for states, apply design tokens, and verify style libraries.'
        },
        {
          id: 'ux-t-i2',
          question: 'How do you prepare usability testing scripts and execute user testing protocols?',
          idealAnswerKeys: ['testing tasks definitions', 'user screen logs', 'sus score questionnaires', 'feedback reviews'],
          suggestedAnswer: 'Define target task guidelines, observe user path interactions, record qualitative feedback, and calculate SUS metrics.'
        }
      ],
      advanced: [
        {
          id: 'ux-t-a1',
          question: 'Explain design tokens configuration and how they bridge UI designs with developer CSS codes.',
          idealAnswerKeys: ['json tokens output', 'design variables translations', 'style dictionaries', 'figma plugins'],
          suggestedAnswer: 'Design tokens declare variables (spacing/colors) in JSON files. Export them via Figma plugins to generate style sheets.'
        },
        {
          id: 'ux-t-a2',
          question: 'Explain Web Content Accessibility Guidelines (WCAG) 2.1 AA and AAA standards.',
          idealAnswerKeys: ['contrast margins ratios', 'keyboard inputs navigation', 'screen readers compatibility', 'aria tags validation'],
          suggestedAnswer: 'WCAG outlines contrast parameters, keyboard controls navigation, screen-reader compatibility, and ARIA attributes.'
        }
      ]
    },
    hr: {
      beginner: [
        {
          id: 'ux-h-b1',
          question: 'Why do you specialize in UI/UX Design rather than frontend development or art?',
          idealAnswerKeys: ['human interaction focus', 'problem solving layouts', 'user experience research', 'prototyping'],
          suggestedAnswer: 'Focus on human-centered design, solving user problems, validating ideas, and constructing layout prototypes.'
        },
        {
          id: 'ux-h-b2',
          question: 'How do you react to negative critiques of your interface design choices?',
          idealAnswerKeys: ['empathy listener', 'objective parameters check', 'user testing metrics', 'constructive changes'],
          suggestedAnswer: 'Gather feedback with empathy, reference design standards, run usability tests, and iterate.'
        }
      ],
      intermediate: [
        {
          id: 'ux-h-i1',
          question: 'How do you handle engineers asserting design ideas are too complex to build?',
          idealAnswerKeys: ['technical trade-offs negotiation', 'components simplification options', 'design specification checks', 'collaboration'],
          suggestedAnswer: 'Discuss framework limits, propose simplified layouts, write specifications, and collaborate on adjustments.'
        },
        {
          id: 'ux-h-i2',
          question: 'Tell me about a time you adapted design specifications mid-sprint.',
          idealAnswerKeys: ['developer communication logs', 'simplified component variants', 'agile backlog syncs', 'outcomes focus'],
          suggestedAnswer: 'Collaborated with devs, updated components, synchronized sprint backlog items, and focused on core deliverables.'
        }
      ],
      advanced: [
        {
          id: 'ux-h-a1',
          question: 'How do you lead the creation of an enterprise-grade design system across teams?',
          idealAnswerKeys: ['component audits', 'figma systems standards', 'shared token dictionaries', 'stakeholder presentations'],
          suggestedAnswer: 'Audit component libraries, configure Figma styles, set up design tokens, and present GTM metrics.'
        },
        {
          id: 'ux-h-a2',
          question: 'How do you champion user research budgets to executive leaders?',
          idealAnswerKeys: ['roi calculations metrics', 'usability cost analysis', 'customer retention inputs', 'business priorities'],
          suggestedAnswer: 'Link usability fixes to retention metrics, show cost savings, and align goals with business priorities.'
        }
      ]
    },
    scenario: {
      beginner: [
        {
          id: 'ux-s-b1',
          question: 'Scenario: Font sizes do not scale cleanly on small screens. How do you resolve?',
          idealAnswerKeys: ['rem scale rules', 'responsive typography breakpoints', 'viewports testing', 'figma text variants'],
          suggestedAnswer: 'Switch from absolute pixels to relative REM units, configure responsive text variants, and test layouts.'
        },
        {
          id: 'ux-s-b2',
          question: 'Scenario: Custom component layouts break consistency rules in Figma. How do you clean?',
          idealAnswerKeys: ['master component link', 'variant overrides clear', 'style library audits', 'file audits'],
          suggestedAnswer: 'Link variants back to master components, clear local style overrides, and audit style libraries.'
        }
      ],
      intermediate: [
        {
          id: 'ux-s-i1',
          question: 'Scenario: Checkout funnel reports highlight high cart abandonment rates. How do you diagnose UI issues?',
          idealAnswerKeys: ['checkout user journey checks', 'error fields audits', 'form validation speed', 'usability tests scripts'],
          suggestedAnswer: 'Audit checkout logs, track form input speeds, check error validations, and schedule usability tests.'
        },
        {
          id: 'ux-s-i2',
          question: 'Scenario: Navigation components confuse target users during usability tests. How do you redesign?',
          idealAnswerKeys: ['card sorting audits', 'hierarchical nav layouts', 'user flow simplification', 'ab tests variant'],
          suggestedAnswer: 'Run card sorting tests, build prototype variants, simplify user paths, and run comparative tests.'
        }
      ],
      advanced: [
        {
          id: 'ux-s-a1',
          question: 'Scenario: Frontend developer handoff results in visual layout mismatches. How do you resolve?',
          idealAnswerKeys: ['redline specifications files', 'layout grid syncs', 'storybook catalog audits', 'inspect tool specs'],
          suggestedAnswer: 'Publish detailed design specifications, verify auto-layouts, and audit components in Storybook.'
        },
        {
          id: 'ux-s-a2',
          question: 'Scenario: Dark mode variations fail contrast validation checks. How do you correct?',
          idealAnswerKeys: ['contrast ratio analyzer', 'color pallet values adjustment', 'accessibility guidelines checks', 'wcag verification'],
          suggestedAnswer: 'Audit contrast ratios using validator tools, adjust hex values to meet WCAG standards, and update tokens.'
        }
      ]
    }
  },
  da: {
    technical: {
      beginner: [
        {
          id: 'da-t-b1',
          question: 'Explain pivot tables, VLOOKUP, and INDEX-MATCH in Excel.',
          idealAnswerKeys: ['pivot table summaries', 'vlookup indexing', 'index match search', 'data filters'],
          suggestedAnswer: 'Pivot Tables aggregate and summarize datasets. VLOOKUP searches keys vertically in columns. INDEX-MATCH matches coordinates across grids.'
        },
        {
          id: 'da-t-b2',
          question: 'What is a SQL JOIN and explain the difference between INNER, LEFT, and OUTER JOINs.',
          idealAnswerKeys: ['inner join match', 'left join all', 'outer join union', 'primary key'],
          suggestedAnswer: 'INNER JOIN returns matching rows. LEFT JOIN returns all left rows plus matching right rows. OUTER JOIN returns all rows.'
        },
        {
          id: 'da-t-b3',
          question: 'Explain common Excel text functions (LEFT, RIGHT, MID, CONCATENATE, TRIM, FIND) and when you would use them.',
          idealAnswerKeys: ['text extraction', 'concatenate strings', 'remove spaces', 'trim spaces', 'substring search'],
          suggestedAnswer: 'LEFT, RIGHT, and MID extract text from specific locations. CONCATENATE or & joins strings, TRIM removes leading/trailing spaces, and FIND locates the position of a substring.'
        },
        {
          id: 'da-t-b4',
          question: 'What is the order of execution for query clauses in SQL, and how does SELECT relate to WHERE and ORDER BY?',
          idealAnswerKeys: ['FROM', 'WHERE', 'SELECT', 'ORDER BY', 'execution sequence', 'filtering'],
          suggestedAnswer: 'SQL clauses execute in the order: FROM/JOIN, WHERE, GROUP BY, HAVING, SELECT, DISTINCT, and ORDER BY. This means filtering in WHERE happens before SELECT.'
        },
        {
          id: 'da-t-b5',
          question: 'In Power BI, what is the difference between a Calculated Column and a Measure, and when would you use each?',
          idealAnswerKeys: ['row-by-row context', 'filter context', 'pre-calculated', 'dynamic aggregation', 'DAX memory'],
          suggestedAnswer: 'Calculated columns are evaluated row-by-row during data refresh, occupying memory. Measures are calculated dynamically on-the-fly based on visual filter contexts.'
        },
        {
          id: 'da-t-b6',
          question: 'Explain basic SQL aggregation functions and how they handle NULL values.',
          idealAnswerKeys: ['COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'ignored nulls', 'COUNT(*) vs COUNT(column)'],
          suggestedAnswer: 'Aggregation functions (SUM, AVG, COUNT, MIN, MAX) summarize a column. Most functions ignore NULL values, except COUNT(*) which counts all rows including NULLs.'
        }
      ],
      intermediate: [
        {
          id: 'da-t-i1',
          question: 'Explain SQL Window Functions and write a query syntax example using PARTITION BY.',
          idealAnswerKeys: ['partition by windows', 'over clause analytics', 'rank or row_number', 'aggregations without collapse'],
          suggestedAnswer: 'Window functions perform calculations across rows without collapsing groups. Example: ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY date DESC).'
        },
        {
          id: 'da-t-i2',
          question: 'How do you design a dashboard in Tableau or Power BI to track business KPIs?',
          idealAnswerKeys: ['kpi metric design', 'data connection', 'interactive filters', 'visual hierarchy', 'data refreshing'],
          suggestedAnswer: 'Define KPIs, connect databases, create visual filters, and optimize data refresh schedules.'
        },
        {
          id: 'da-t-i3',
          question: 'Explain the difference between the WHERE clause and the HAVING clause in SQL.',
          idealAnswerKeys: ['filter rows before', 'filter groups after', 'aggregate functions', 'group by interaction'],
          suggestedAnswer: 'WHERE filters raw rows before aggregation, whereas HAVING filters aggregated group results after a GROUP BY clause is processed.'
        },
        {
          id: 'da-t-i4',
          question: 'Compare a Star Schema against a Snowflake Schema in data modeling, and explain which is preferred for Power BI.',
          idealAnswerKeys: ['denormalized dimensions', 'normalized tables', 'performance query', 'relationships complexity', 'star schema preferred'],
          suggestedAnswer: 'Star Schema uses denormalized dimensions directly linked to a fact table, optimizing queries. Snowflake schema normalizes dimensions into multiple tables, increasing joins. Star schema is preferred in Power BI.'
        },
        {
          id: 'da-t-i5',
          question: 'In Tableau, what is the difference between blue pills (discrete) and green pills (continuous)?',
          idealAnswerKeys: ['discrete headers', 'continuous axes', 'finite buckets', 'infinite range', 'blue vs green'],
          suggestedAnswer: 'Blue pills represent discrete data which create headers/buckets in layout grids. Green pills represent continuous data which create axes/lines in charts.'
        },
        {
          id: 'da-t-i6',
          question: 'Define the Customer Acquisition Cost (CAC) and Lifetime Value (LTV) KPIs, and how you calculate them from raw business tables.',
          idealAnswerKeys: ['marketing sales spend', 'new customers count', 'average customer lifespan', 'revenue per customer', 'LTV to CAC ratio'],
          suggestedAnswer: 'CAC is total marketing and sales costs divided by new customers acquired. LTV is average revenue per customer multiplied by customer lifespan. A healthy ratio is 3:1.'
        }
      ],
      advanced: [
        {
          id: 'da-t-a1',
          question: 'Explain ETL pipelines architectures and data extraction workflows.',
          idealAnswerKeys: ['extract transform load', 'data pipelines schedules', 'data staging validation', 'data lakes warehouses'],
          suggestedAnswer: 'ETL pipelines extract raw records from sources, transform datasets via cleaning models, and load them into data warehouses.'
        },
        {
          id: 'da-t-a2',
          question: 'How do you design cohort retention analyses and track business growth trends?',
          idealAnswerKeys: ['cohort segments analysis', 'retention curves metrics', 'user signups dates', 'churn rates calculations'],
          suggestedAnswer: 'Group users by signup date cohorts, calculate weekly active rates, plot retention curves, and analyze churn indicators.'
        },
        {
          id: 'da-t-a3',
          question: 'Explain how you optimize slow-running SQL queries, and contrast Common Table Expressions (CTEs) against nested subqueries.',
          idealAnswerKeys: ['explain plan', 'indexes scan', 'avoid nested loops', 'readable CTE', 'materialized views', 'optimizer behavior'],
          suggestedAnswer: 'Analyze queries using EXPLAIN plans, ensure indices are used on join keys, replace nested loops, and rewrite subqueries as readable CTEs which sometimes help the optimizer build better plans.'
        },
        {
          id: 'da-t-a4',
          question: 'An e-commerce company notices a 15% drop-off at the payment step. Walk through your analytics strategy to diagnose this issue.',
          idealAnswerKeys: ['funnel analysis', 'browser device segments', 'payment gateway logs', 'A/B testing anomalies', 'user session recording'],
          suggestedAnswer: 'Examine conversion funnels segmented by browser/device to identify bugs. Audit payment gateway API logs for error codes, and check recent product checkouts updates.'
        },
        {
          id: 'da-t-a5',
          question: 'How do you design a tracking plan to collect clean user interaction event data for a new SaaS product?',
          idealAnswerKeys: ['event schema definition', 'naming conventions', 'properties parameters', 'analytics sdk', 'data governance'],
          suggestedAnswer: 'Draft an event dictionary specifying naming conventions (e.g. verb-noun style), identify trigger points, define properties (user_id, screen), and establish tracking guidelines.'
        },
        {
          id: 'da-t-a6',
          question: 'Explain Slowly Changing Dimensions (SCD) Type 1 and Type 2, and their impact on historical reporting.',
          idealAnswerKeys: ['overwrite values', 'history rows', 'start date end date', 'surrogate key', 'scd type 2'],
          suggestedAnswer: 'SCD Type 1 overwrites old record values, losing history. SCD Type 2 adds a new row with validation dates (start/end) and a surrogate key, preserving history for trend reporting.'
        }
      ]
    },
    hr: {
      beginner: [
        {
          id: 'da-h-b1',
          question: 'Why did you select Data Analysis over general software engineering or marketing?',
          idealAnswerKeys: ['data patterns logic', 'business value reports', 'problem solving metrics', 'visualizing insights'],
          suggestedAnswer: 'Enthusiastic about translating datasets into business insights, writing SQL, and visual dashboarding.'
        },
        {
          id: 'da-h-b2',
          question: 'How do you handle cleansing extremely unstructured or messy datasets?',
          idealAnswerKeys: ['null records audits', 'regex formatting rules', 'outliers diagnostics', 'script automation cleaning'],
          suggestedAnswer: 'Run null audits, apply regex rules to format text fields, filter outlier records, and script data updates.'
        },
        {
          id: 'da-h-b3',
          question: 'How do you handle a situation where a stakeholder requests an analysis urgently, but some key data sets are missing?',
          idealAnswerKeys: ['stakeholder communication', 'scope management', 'proxy metrics', 'documented assumptions', 'iterative delivery'],
          suggestedAnswer: 'Explain data constraints to the stakeholder, offer a simplified analysis using proxy metrics, document assumptions clearly, and deliver intermediate insights.'
        },
        {
          id: 'da-h-b4',
          question: 'Tell me about your experience learning your first Business Intelligence tool (like Tableau or Power BI).',
          idealAnswerKeys: ['self-guided study', 'portfolio dashboard', 'data connection challenges', 'calculated measures'],
          suggestedAnswer: 'Describe connecting to Excel datasets, learning to model tables, building charts, structuring layouts, and practicing DAX formulas.'
        },
        {
          id: 'da-h-b5',
          question: 'Describe a time you discovered an error in your own analysis before presenting the results to stakeholders.',
          idealAnswerKeys: ['validation check', 'double check queries', 'transparency', 'correcting data', 'lessons learned'],
          suggestedAnswer: 'Audited query results against raw sums, noticed a duplicate row join issue, corrected the charts, and set up automatic query checks for future runs.'
        },
        {
          id: 'da-h-b6',
          question: 'How do you check and validate that your SQL queries are producing accurate results?',
          idealAnswerKeys: ['count validation', 'sample checks', 'limit query tests', 'isolated database runs', 'known benchmarks'],
          suggestedAnswer: 'Run sample check rows, compare output aggregates against verified base summaries, test subqueries independently, and assert primary key uniqueness.'
        }
      ],
      intermediate: [
        {
          id: 'da-h-i1',
          question: 'How do you present weekly analytics metrics reports to your managers?',
          idealAnswerKeys: ['key takeaways highlights', 'metric dashboards visual', 'data trends analysis', 'business suggestions'],
          suggestedAnswer: 'Highlight key takeaways, present metric trends visually, and propose business optimizations.'
        },
        {
          id: 'da-h-i2',
          question: 'Tell me about a time you disagreed on the definition of a core business KPI.',
          idealAnswerKeys: ['data documentation audit', 'stakeholder alignments', 'metrics calculation testing', 'agreements'],
          suggestedAnswer: 'Audited data schemas, aligned business definitions, tested metric outputs, and documented calculations.'
        },
        {
          id: 'da-h-i3',
          question: "A business stakeholder asks you to 'look at the data and find anything interesting.' How do you respond?",
          idealAnswerKeys: ['clarifying business goals', 'define hypotheses', 'prioritize questions', 'structured framework'],
          suggestedAnswer: 'Schedule a brief call to align on core business questions, define testable hypotheses, establish success metrics, and structure the analysis exploration.'
        },
        {
          id: 'da-h-i4',
          question: 'How do you prioritize analytical request backlogs coming from two different business teams (e.g. Marketing and Product)?',
          idealAnswerKeys: ['impact scoring', 'effort estimation', 'revenue alignment', 'stakeholder consensus', 'priority queue'],
          suggestedAnswer: 'Map requests to business revenue impact and engineering effort. Communicate timelines transparently and run prioritization check-ins.'
        },
        {
          id: 'da-h-i5',
          question: 'Describe a time you had to explain a complex statistical finding or predictive model output to a non-technical audience.',
          idealAnswerKeys: ['analogy comparison', 'simple language', 'visual charts', 'focus on business takeaway', 'avoid jargon'],
          suggestedAnswer: 'Translate calculations into business outcomes, avoid statistical terms (e.g., talk about trends instead of p-values), and use clean charts.'
        },
        {
          id: 'da-h-i6',
          question: 'How do you handle a situation where you build an executive dashboard, but find that the business team is not using it?',
          idealAnswerKeys: ['user feedback surveys', 'usability training', 'simplify visual complexity', 'integrate routine alerts'],
          suggestedAnswer: 'Gather feedback from users to identify blockers, simplify layout grids, run walkthrough sessions, and set up email notifications for key metrics.'
        }
      ],
      advanced: [
        {
          id: 'da-h-a1',
          question: 'How do you champion data-driven decision workflows within a company culture?',
          idealAnswerKeys: ['self service metrics tools', 'training sessions audits', 'data catalog indexing', 'dashboard updates'],
          suggestedAnswer: 'Deploy self-service BI dashboards, host database querying workshops, and establish data documentation.'
        },
        {
          id: 'da-h-a2',
          question: 'How do you optimize Snowflake data warehouse compute resource expenditures?',
          idealAnswerKeys: ['query warehouses scaling', 'warehouse auto-suspend times', 'sql caching utilization', 'diagnostics tools'],
          suggestedAnswer: 'Tune slow SQL queries, configure auto-suspend triggers, leverage cache systems, and scale computing clusters.'
        },
        {
          id: 'da-h-a3',
          question: 'Tell me about a time you mentored a junior data analyst. How did you guide them through SQL query optimization?',
          idealAnswerKeys: ['code review sessions', 'explain query plan', 'indexing coaching', 'collaborative refactoring'],
          suggestedAnswer: 'Conducted regular code reviews, explained database scan costs, coached them on index utilization, and rewrote query statements collaboratively.'
        },
        {
          id: 'da-h-a4',
          question: 'How do you handle situations where executive management pressures you to bias data findings to support a pre-determined decision?',
          idealAnswerKeys: ['data integrity', 'objective metrics', 'transparent methodology', 'presenting scenarios', 'ethical standards'],
          suggestedAnswer: 'Present the objective findings with absolute transparency, document the statistical methodology, and outline alternative scenarios clearly to remain a neutral guide.'
        },
        {
          id: 'da-h-a5',
          question: 'How do you establish data governance and security parameters when sharing BI dashboards with external clients?',
          idealAnswerKeys: ['row-level security', 'data masking encryption', 'access groups', 'compliance validation', 'audit logging'],
          suggestedAnswer: 'Implement row-level security (RLS) policies, configure access permissions, mask sensitive fields, and monitor usage logs.'
        },
        {
          id: 'da-h-a6',
          question: 'How do you align multiple department heads on a single source of truth for high-stakes business KPIs?',
          idealAnswerKeys: ['data definitions dictionary', 'central warehouse tables', 'stakeholder committee', 'metrics standardizations'],
          suggestedAnswer: 'Draft a unified data dictionary, establish schema models in the central data warehouse, and secure metric definitions approval.'
        }
      ]
    },
    scenario: {
      beginner: [
        {
          id: 'da-s-b1',
          question: 'Scenario: Duplicate records skew sum totals inside your dataset files. How do you resolve?',
          idealAnswerKeys: ['distinct primary keys', 'row duplicates remove', 'data sorting filters', 'aggregate checks'],
          suggestedAnswer: 'Filter duplicate records using DISTINCT or drop_duplicates() in Pandas, and verify row count keys.'
        },
        {
          id: 'da-s-b2',
          question: 'Scenario: An Excel file crashes due to high record size. What options do you take?',
          idealAnswerKeys: ['database query export', 'python script loading', 'sqlite database files', 'power query'],
          suggestedAnswer: 'Import files via Power Query, load records in Pandas notebooks, or query datasets using SQLite.'
        },
        {
          id: 'da-s-b3',
          question: 'Scenario: An Excel sheet returns a circular reference warning. How do you isolate and resolve it?',
          idealAnswerKeys: ['circular formulas inspection', 'formulas tab audit', 'trace dependents precedents', 'cell references corrections'],
          suggestedAnswer: 'Check the circular reference cells list via Excel\'s Formulas tab, trace dependents and precedents paths, and correct cell addresses.'
        },
        {
          id: 'da-s-b4',
          question: 'Scenario: A SQL query run against a dataset returns zero records, but you know data exists. How do you debug?',
          idealAnswerKeys: ['check join constraints', 'null columns check', 'where clause filtering limits', 'sample data SELECT *'],
          suggestedAnswer: 'Run a simple SELECT * LIMIT 5 to see raw formats. Check join parameters, review filters in WHERE clauses, and verify data casing.'
        },
        {
          id: 'da-s-b5',
          question: 'Scenario: A bar chart in Power BI displays a category named \'Blank\' containing a high sum total. How do you troubleshoot?',
          idealAnswerKeys: ['missing data relationships', 'referential integrity check', 'null keys in tables', 'filter null records'],
          suggestedAnswer: 'Inspect table relationships. A \'Blank\' category indicates referential integrity failures where fact rows contain foreign keys missing from the dimension table.'
        },
        {
          id: 'da-s-b6',
          question: 'Scenario: A pivot table sum doesn\'t match the manually counted sum of the source table rows. What is likely wrong?',
          idealAnswerKeys: ['text formatting numbers', 'hidden blank spaces', 'value field settings count', 'data cache refresh'],
          suggestedAnswer: 'Check if some numbers are formatted as text, refresh the pivot table cache, and ensure the value field setting is set to SUM rather than COUNT.'
        }
      ],
      intermediate: [
        {
          id: 'da-s-i1',
          question: 'Scenario: Database queries time out on large production tables. How do you debug?',
          idealAnswerKeys: ['explain query scanning', 'indexes on keys', 'cte partition rules', 'subquery updates'],
          suggestedAnswer: 'Check query query plans via EXPLAIN, build indexes on filter criteria, partition large tables, and avoid nested subqueries.'
        },
        {
          id: 'da-s-i2',
          question: 'Scenario: Business users report inconsistencies across dashboard reports. How do you troubleshoot?',
          idealAnswerKeys: ['data pipeline sync check', 'schema query verification', 'cache flush files', 'data sources audits'],
          suggestedAnswer: 'Verify pipeline updates, inspect query definitions for calculations discrepancies, flush dashboard caches, and check data sources.'
        },
        {
          id: 'da-s-i3',
          question: 'Scenario: A SQL JOIN returns significantly more rows than are in the left table, skewing metrics. What is the cause and how do you resolve?',
          idealAnswerKeys: ['many-to-many relationship', 'duplicate join keys', 'aggregation before join', 'distinct key validation'],
          suggestedAnswer: 'Verify join keys. If key columns contain duplicates, a many-to-many join occurs. Fix by deduplicating join keys or aggregating tables before joining.'
        },
        {
          id: 'da-s-i4',
          question: 'Scenario: Your weekly dashboard reveals active customer conversion rate dropped by 20% overnight. Walk through your diagnostic steps.',
          idealAnswerKeys: ['data extraction fail check', 'recent release verify', 'anomaly filters inspection', 'segmentation checks'],
          suggestedAnswer: 'Confirm that nightly ETL data extracts ran successfully. Check for recent site deployments, and segment conversion rate drop by browser/device.'
        },
        {
          id: 'da-s-i5',
          question: 'Scenario: A Tableau dashboard takes 15 seconds to render after clicking filters. How do you optimize its speed?',
          idealAnswerKeys: ['tableau data extracts', 'minimize filters count', 'reduce context filters', 'custom SQL optimization', 'performance recording'],
          suggestedAnswer: 'Use Tableau Data Extracts instead of live queries, reduce filter counts, optimize custom SQL scripts, and run performance recording to check rendering times.'
        },
        {
          id: 'da-s-i6',
          question: 'Scenario: The product manager asks you to define and track a new metric for \'Customer Engagement\' using raw event logs. How do you proceed?',
          idealAnswerKeys: ['session duration metrics', 'key events interactions', 'active days frequency', 'dashboard aggregation'],
          suggestedAnswer: 'Propose a composite metric (e.g. active session duration, trigger clicks, frequency days), draft SQL queries to aggregate raw event logs, and build a trend dashboard.'
        }
      ],
      advanced: [
        {
          id: 'da-s-a1',
          question: 'Scenario: Upstream data sync tasks fail overnight. How do you alert stakeholders?',
          idealAnswerKeys: ['automated notifications email', 'incident diagnostics protocol', 'compensation reports data', 'pipeline updates triggers'],
          suggestedAnswer: 'Trigger automated notification alerts, identify failed pipelines stages, notify users, and schedule data sync retries.'
        },
        {
          id: 'da-s-a2',
          question: 'Scenario: Executive reports load too slowly. How do you optimize?',
          idealAnswerKeys: ['summary table aggregation', 'query cache triggers', 'warehouse cluster scaling', 'snowflake materialization views'],
          suggestedAnswer: 'Pre-aggregate metrics in summary tables, build materialized views, scale warehouses, and leverage cached queries.'
        },
        {
          id: 'da-s-a3',
          question: 'Scenario: A dashboard query with multiple nested subqueries and joins is taking 10 minutes to run. How do you refactor it?',
          idealAnswerKeys: ['common table expressions', 'temporary tables execution', 'pre-aggregation aggregates', 'partition table scan'],
          suggestedAnswer: 'Refactor nested logic into CTEs or temporary tables, pre-aggregate metrics in ETL stages, and add indices on partitioned timestamp columns.'
        },
        {
          id: 'da-s-a4',
          question: 'Scenario: Subscription revenue is flat month-over-month, but user signups have increased by 30%. What areas do you explore?',
          idealAnswerKeys: ['churn rates analysis', 'subscription package tiers', 'acquisition channels value', 'customer lifetime metrics'],
          suggestedAnswer: 'Analyze subscriber churn trends, evaluate new signups distribution across tier plans, check pricing discounts impact, and inspect signup acquisition channels.'
        },
        {
          id: 'da-s-a5',
          question: 'Scenario: A fast-growing SaaS platform needs to restructure its reporting warehouse to support multiple timezones and multi-tenant isolation. How do you model this?',
          idealAnswerKeys: ['utc timestamps standard', 'tenant id partition', 'star schema dimensional', 'row level security rules'],
          suggestedAnswer: 'Standardize warehouse columns to UTC, partition database schemas by tenant_id, organize dimensions into a Star Schema, and enforce row-level security policy parameters.'
        },
        {
          id: 'da-s-a6',
          question: 'Scenario: Your company\'s monthly Snowflake warehouse bill suddenly spikes by 50% month-over-month. How do you audit and control costs?',
          idealAnswerKeys: ['snowflake query history logs', 'warehouse auto-suspend verify', 'cost attribution tags', 'optimize scan limits'],
          suggestedAnswer: 'Audit queries history in Snowflake logs to locate heavy queries. Set auto-suspend times on warehouses to 60 seconds, and configure query timeout limits.'
        }
      ]
    }
  }
};
