/**
 * Single source of truth for brand, positioning and contact facts.
 * The hero, stack section, contact block and the portfolio agent all read from here.
 */

export const profile = {
  name: 'Jokhendra Prajapati',
  shortName: 'Jokhendra',
  initials: 'JP',
  role: 'Senior AI & Full-Stack Engineer',
  brandLine: 'Agentic AI systems and the production backends that run them',
  supportingLine: 'LangGraph · RAG · MCP · FastAPI · Express / NestJS · WebSockets · AWS',
  heroSentence:
    'I build retrieval and agent systems that hold up outside a notebook, plus the Python and Node services, realtime layers and cloud infrastructure they actually run on.',
  location: 'Bhopal, Madhya Pradesh, India',
  timezone: 'IST (UTC+5:30)',
  remote: 'Remote worldwide',
  email: 'jokhendra.prajapati@gmail.com',
  experienceYears: '5+',
  availability: {
    status: 'Available for senior AI and full-stack engineering roles and consulting',
    responseTime: 'Typical response within 6 hours',
  },
  social: {
    github: 'https://github.com/jokhendra',
    githubHandle: 'jokhendra',
    linkedin: 'https://www.linkedin.com/in/jokhendra-prajapati-560a841aa/',
  },
  cvUrl:
    'https://www.dropbox.com/scl/fi/ikxuk36rflo44y4km9kkd/Jokhendra-Prajapati.pdf?rlkey=yizn54p7z1oqzcduxqktm1jmi&st=30l7hdce&e=1&dl=0',
} as const;

/**
 * Four capability areas, weighted equally: the AI half and the engineering half
 * of an AI full-stack engineer.
 */
export const focusAreas = [
  {
    id: 'retrieval',
    title: 'Retrieval and grounding',
    summary:
      'Hybrid retrieval over messy sources: chunking chosen for the document shape, sparse plus dense scoring, and answers tied back to retrieved text.',
    keywords: ['RAG', 'Hybrid search', 'FAISS', 'BM25', 'Chunking strategy'],
  },
  {
    id: 'agentic',
    title: 'Agentic systems',
    summary:
      'LangGraph state machines instead of one long chain: an intent router, tool nodes with fallbacks, and memory scoped per conversation thread.',
    keywords: ['LangGraph', 'StateGraph', 'Tool calling', 'MCP', 'Fallbacks'],
  },
  {
    id: 'backend',
    title: 'Backend engineering',
    summary:
      'Python and Node services built to be operated: versioned REST contracts, validation at the edge, WebSocket transport for realtime, and queued workers for anything slow.',
    keywords: ['FastAPI', 'Express', 'NestJS', 'WebSockets', 'Queues', 'JWT / OAuth'],
  },
  {
    id: 'platform',
    title: 'Cloud and delivery',
    summary:
      'Containerised services on AWS with CI/CD, health checks and structured logs, plus the Next.js interfaces that sit on top. One person, whole path.',
    keywords: ['AWS', 'Docker', 'CI/CD', 'Next.js', 'Observability'],
  },
] as const;

/** Layered stack, ordered from interface down to operations. */
export const stackLayers = [
  {
    layer: 'Interface',
    role: 'What the user actually touches',
    items: ['Next.js', 'React', 'TypeScript', 'Streaming UI', 'Tailwind CSS'],
  },
  {
    layer: 'AI orchestration',
    role: 'Decides what happens next',
    items: ['LangGraph', 'LangChain', 'Intent routing', 'Prompt design', 'Checkpointed memory'],
  },
  {
    layer: 'Tools and integrations',
    role: 'The hands of the system',
    items: ['MCP servers', 'Tool calling', 'REST and webhooks', 'Tavily search', 'Typed function tools'],
  },
  {
    layer: 'Backend services',
    role: 'Where the business logic lives',
    items: ['FastAPI', 'Express', 'NestJS', 'Django', 'REST and streaming APIs', 'JWT / OAuth'],
  },
  {
    layer: 'Realtime and async',
    role: 'Work that cannot block a request',
    items: ['WebSockets', 'Socket.IO', 'MediaSoup', 'Queues and workers', 'Redis pub/sub'],
  },
  {
    layer: 'Retrieval and data',
    role: 'Grounding and persistence',
    items: ['FAISS', 'BM25', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite'],
  },
  {
    layer: 'Models',
    role: 'Routed by cost and latency',
    items: ['Groq', 'OpenAI', 'Open-weight models', 'Embeddings', 'LLM-as-judge'],
  },
  {
    layer: 'Cloud and delivery',
    role: 'Getting it live and keeping it honest',
    items: ['AWS (EC2, S3, Lambda)', 'Docker', 'CI/CD', 'Nginx', 'Logs and metrics'],
  },
] as const;

/** Nodes for the expertise graph. Four clusters, AI and engineering balanced. */
export const expertiseGraph = {
  clusters: [
    {
      id: 'genai',
      label: 'GenAI',
      nodes: [
        { id: 'rag', label: 'RAG pipelines' },
        { id: 'hybrid', label: 'Hybrid search' },
        { id: 'eval', label: 'Evaluation' },
        { id: 'routing', label: 'Model routing' },
      ],
    },
    {
      id: 'agentic',
      label: 'Agentic',
      nodes: [
        { id: 'langgraph', label: 'LangGraph' },
        { id: 'tools', label: 'Tool calling' },
        { id: 'mcp', label: 'MCP servers' },
        { id: 'memory', label: 'State and memory' },
      ],
    },
    {
      id: 'backend',
      label: 'Backend',
      nodes: [
        { id: 'fastapi', label: 'FastAPI / Python' },
        { id: 'node', label: 'Express / NestJS' },
        { id: 'ws', label: 'WebSockets' },
        { id: 'queues', label: 'Queues and workers' },
      ],
    },
    {
      id: 'platform',
      label: 'Platform',
      nodes: [
        { id: 'next', label: 'Next.js / React' },
        { id: 'data', label: 'Postgres / Mongo' },
        { id: 'aws', label: 'AWS' },
        { id: 'docker', label: 'Docker / CI' },
      ],
    },
  ],
  links: [
    { from: 'hybrid', to: 'rag' },
    { from: 'eval', to: 'rag' },
    { from: 'routing', to: 'langgraph' },
    { from: 'memory', to: 'langgraph' },
    { from: 'rag', to: 'langgraph' },
    { from: 'langgraph', to: 'tools' },
    { from: 'tools', to: 'mcp' },
    { from: 'langgraph', to: 'fastapi' },
    { from: 'mcp', to: 'node' },
    { from: 'fastapi', to: 'queues' },
    { from: 'ws', to: 'queues' },
    { from: 'fastapi', to: 'data' },
    { from: 'node', to: 'data' },
    { from: 'queues', to: 'aws' },
    { from: 'next', to: 'node' },
    { from: 'aws', to: 'docker' },
    { from: 'rag', to: 'data' },
  ],
} as const;

/** Facts the portfolio agent is allowed to answer from. */
export const profileFacts = [
  {
    id: 'profile-role',
    title: 'Role and positioning',
    text: `${profile.name} is a ${profile.role} working on ${profile.brandLine}. The AI side is LangChain, LangGraph, RAG and MCP; the engineering side is Python and Node backends, realtime transport and AWS delivery. Around ${profile.experienceYears} years building software, with recent work concentrated on generative and agentic AI systems on top of production backends.`,
    tags: ['about', 'role', 'senior', 'positioning', 'experience', 'fullstack', 'full-stack'],
  },
  {
    id: 'profile-agentic',
    title: 'How the agent work is structured',
    text: 'Agents are built as LangGraph state graphs rather than single chains. A cheap router classifies intent first, tool nodes carry their own fallbacks, and conversation state is checkpointed per thread so retries do not lose context. Tools are kept behind an explicit boundary (MCP or typed function tools) so the model never holds credentials.',
    tags: ['langgraph', 'agent', 'agentic', 'mcp', 'tools', 'state', 'memory', 'router'],
  },
  {
    id: 'profile-rag',
    title: 'How the retrieval work is structured',
    text: 'Retrieval uses hybrid scoring: BM25-style sparse matching for exact terms plus dense vectors for meaning, merged and reranked before prompting. Chunk size is chosen from the document shape rather than copied from a tutorial, and answers are grounded with citations back to retrieved passages.',
    tags: ['rag', 'retrieval', 'hybrid', 'bm25', 'faiss', 'chunking', 'grounding', 'citations'],
  },
  {
    id: 'profile-backend',
    title: 'Backend and API engineering',
    text: 'Backend work spans both runtimes: Python services with FastAPI and Django, and Node services with Express and NestJS. APIs are versioned with validation at the edge, consistent error contracts, and JWT or OAuth authentication. Anything slow moves behind a queue with retries and backoff rather than blocking a request, and handlers are written to be idempotent so a retry is safe.',
    tags: [
      'backend', 'api', 'apis', 'fastapi', 'django', 'python', 'node', 'nodejs', 'express',
      'nest', 'nestjs', 'rest', 'auth', 'jwt', 'oauth', 'queue', 'queues', 'workers',
      'microservices', 'services', 'validation', 'idempotent',
    ],
  },
  {
    id: 'profile-realtime',
    title: 'Realtime systems',
    text: 'Realtime features run over WebSockets with an authenticated handshake and room or namespace design, using Socket.IO for application messaging and MediaSoup for media transport. Fanout across multiple instances goes through Redis pub/sub, and clients get heartbeats plus reconnect with backoff so a dropped socket recovers instead of silently dying.',
    tags: [
      'realtime', 'real-time', 'websocket', 'websockets', 'socket', 'socket.io', 'mediasoup',
      'webrtc', 'streaming', 'pubsub', 'redis', 'reconnect', 'scaling', 'rooms',
    ],
  },
  {
    id: 'profile-cloud',
    title: 'Cloud, delivery and operations',
    text: 'Services are containerised with Docker and deployed to AWS using EC2, S3 and Lambda, fronted by Nginx, with CI/CD pipelines handling build and release. Health checks, structured logs and metrics are treated as part of the feature, so production problems are diagnosable rather than guessed at.',
    tags: [
      'cloud', 'aws', 'ec2', 's3', 'lambda', 'cloudwatch', 'docker', 'ci', 'cd', 'cicd',
      'deploy', 'deployment', 'devops', 'nginx', 'monitoring', 'observability', 'logs',
      'metrics', 'infrastructure',
    ],
  },
  {
    id: 'profile-fullstack',
    title: 'Full-stack delivery',
    text: 'Delivery covers the whole path: Next.js and React interfaces with token streaming, FastAPI or Express and NestJS services behind them, Postgres, MongoDB, Redis and SQLite persistence, Docker packaging, and deployment on AWS or Vercel. The same person designs the agent graph and ships the platform it runs on.',
    tags: ['fullstack', 'full-stack', 'nextjs', 'react', 'frontend', 'end to end', 'ownership'],
  },
  {
    id: 'profile-contact',
    title: 'Contact and availability',
    text: `${profile.availability.status}. Email ${profile.email}, or use the contact form and scheduling section on this site. Based in ${profile.location}, working ${profile.remote} on ${profile.timezone}. ${profile.availability.responseTime}.`,
    tags: ['contact', 'hire', 'email', 'availability', 'location', 'timezone', 'schedule', 'call'],
  },
] as const;
