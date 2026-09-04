import { Project } from '../types/project';

/**
 * Case studies for "Selected work", ordered most impactful first.
 *
 * Source of truth: production work from the resume (Cynayd Solutions +
 * related delivery), plus a small set of personal systems that prove the
 * agentic half of the profile. Every claim here is taken from resume copy
 * or from this site itself — no invented employers, metrics or links.
 */
export const projects: Project[] = [
  {
    id: 1,
    slug: 'my-live',
    title: 'My Live',
    tagline:
      'Backend for a live video platform that keeps thousands of concurrent viewers, chat and presence in sync.',
    capabilityArea: 'Realtime backend at scale',
    category: 'realtime',
    capabilities: ['realtime', 'backend', 'cloud', 'fullstack'],
    role: 'Sr. Software Developer - backend architecture and realtime systems',
    timeframe: '2022 – present · Cynayd Solutions',
    status: 'live',
    problem:
      'A live streaming product dies the moment chat lags, presence lies or a single node becomes the bottleneck. The hard problem is not the video codec — it is keeping messaging, sessions and fanout correct while thousands of viewers join the same room.',
    description:
      'I led the backend for My Live, a production live-streaming platform. The system carries live video and audio alongside interactive chat and presence, using Socket.IO with Redis pub/sub so events fan out across instances instead of living in one process. MySQL holds accounts, stream metadata and chat history with schemas tuned for the hot paths, and the service is operated for continuous streaming rather than demo traffic.',
    technologies: [
      'PHP',
      'Socket.IO',
      'WebSockets',
      'Redis',
      'MySQL',
      'Node.js',
      'AWS',
      'FFmpeg',
    ],
    stackLayers: [
      { layer: 'Clients', items: ['Mobile app (Play Store)', 'Live viewer and broadcaster'] },
      { layer: 'Realtime', items: ['Socket.IO', 'Presence', 'Interactive chat', 'Redis pub/sub'] },
      { layer: 'Services', items: ['Streaming and session APIs', 'Notification paths'] },
      { layer: 'Data', items: ['MySQL (accounts, streams, chat)', 'Redis sessions'] },
      { layer: 'Delivery', items: ['Cloud deploy', 'Fault-tolerant 24/7 operation'] },
    ],
    architecture: {
      summary:
        'Clients attach over Socket.IO; Redis pub/sub fans events across nodes so chat and presence stay consistent under load while MySQL remains the system of record.',
      nodes: [
        { id: 'app', label: 'Mobile / web', sublabel: 'viewer + broadcaster', kind: 'client', column: 0, row: 0 },
        { id: 'gateway', label: 'Socket.IO gateway', sublabel: 'rooms + presence', kind: 'api', column: 1, row: 0 },
        { id: 'api', label: 'Streaming API', sublabel: 'sessions + metadata', kind: 'api', column: 1, row: 1 },
        { id: 'redis', label: 'Redis', sublabel: 'pub/sub + sessions', kind: 'data', column: 2, row: 0 },
        { id: 'mysql', label: 'MySQL', sublabel: 'accounts + streams', kind: 'data', column: 3, row: 0 },
        { id: 'media', label: 'Media path', sublabel: 'live A/V', kind: 'orchestrator', column: 2, row: 1 },
      ],
      edges: [
        { from: 'app', to: 'gateway', label: 'ws' },
        { from: 'app', to: 'api', label: 'https' },
        { from: 'gateway', to: 'redis', label: 'fanout' },
        { from: 'api', to: 'mysql' },
        { from: 'api', to: 'redis', dashed: true },
        { from: 'app', to: 'media', label: 'stream' },
      ],
    },
    metrics: [
      {
        label: 'Concurrent users',
        value: 'Thousands',
        note: 'Handled in production with low-latency messaging',
      },
      {
        label: 'Uptime target',
        value: '24/7',
        note: 'Designed for uninterrupted live streaming',
      },
    ],
    decisions: [
      {
        choice: 'Redis pub/sub for cross-node fanout',
        rationale:
          'In-process Socket.IO state collapses the moment a second instance comes online. Pub/sub keeps rooms and presence correct without sticky-session gymnastics.',
        alternative: 'Single-node Socket.IO or sticky load balancing only',
      },
      {
        choice: 'MySQL as system of record for streams and chat',
        rationale:
          'Accounts, stream metadata and chat history need durable relational integrity; Redis stays hot-path only.',
        alternative: 'Document store for everything',
      },
    ],
    incident: {
      broke:
        'Under peak concurrent load, chat and presence drifted when events stayed local to one Socket.IO process while viewers were spread across instances.',
      fix:
        'Moved fanout through Redis pub/sub, tightened room and session design, and treated reconnect plus heartbeats as part of the product path rather than an afterthought.',
    },
    features: [
      'Live video and audio broadcasting',
      'Interactive chat under concurrent load',
      'User presence across rooms',
      'Redis-backed distributed event propagation',
      'MySQL models for accounts, streams and chat logs',
    ],
    liveUrl:
      'https://play.google.com/store/apps/details?id=com.livestreaming.mylive&hl=en_IN',
    featured: true,
  },
  {
    id: 2,
    slug: 'cynayd-connect',
    title: 'Cynayd Connect',
    tagline:
      'WebRTC conferencing with Mediasoup SFU, Node signaling and Redis — built for multi-party calls that stay low-latency.',
    capabilityArea: 'Realtime media systems',
    category: 'realtime',
    capabilities: ['realtime', 'backend', 'fullstack'],
    role: 'Sr. Software Developer - WebRTC infrastructure and signaling',
    timeframe: '2024 – present · Cynayd Solutions',
    status: 'private',
    problem:
      'Peer-to-peer WebRTC collapses once a meeting grows past a handful of participants. You need an SFU, a reliable signaling plane, and session state that survives reconnects — otherwise audio clips, video freezes and people silently drop.',
    description:
      'Cynayd Connect is a real-time video conferencing product. I built the Mediasoup-based media path for multi-party audio and video, a Node.js WebSocket signaling server for peer and room events, Redis for session and message brokering, and PostgreSQL for profiles, meeting metadata and history. The design targets large conferences with minimal latency rather than two-person demos.',
    technologies: [
      'Node.js',
      'WebRTC',
      'Mediasoup',
      'WebSockets',
      'Redis',
      'PostgreSQL',
      'Socket.IO',
    ],
    stackLayers: [
      { layer: 'Clients', items: ['Conferencing UI', 'Device and media controls'] },
      { layer: 'Signaling', items: ['Node.js WebSocket server', 'Room and peer events'] },
      { layer: 'Media', items: ['Mediasoup SFU', 'WebRTC A/V'] },
      { layer: 'State', items: ['Redis sessions and brokering', 'PostgreSQL meeting history'] },
    ],
    architecture: {
      summary:
        'Browsers talk WebRTC to a Mediasoup SFU; a Node signaling server coordinates rooms while Redis and PostgreSQL own ephemeral and durable meeting state.',
      nodes: [
        { id: 'client', label: 'Meeting client', sublabel: 'WebRTC', kind: 'client', column: 0, row: 0 },
        { id: 'signal', label: 'Signaling', sublabel: 'Node + WebSocket', kind: 'api', column: 1, row: 0 },
        { id: 'sfu', label: 'Mediasoup SFU', sublabel: 'A/V routing', kind: 'orchestrator', column: 2, row: 0 },
        { id: 'redis', label: 'Redis', sublabel: 'sessions + broker', kind: 'data', column: 3, row: 0 },
        { id: 'pg', label: 'PostgreSQL', sublabel: 'profiles + history', kind: 'data', column: 3, row: 1 },
      ],
      edges: [
        { from: 'client', to: 'signal', label: 'ws' },
        { from: 'client', to: 'sfu', label: 'webrtc' },
        { from: 'signal', to: 'redis' },
        { from: 'signal', to: 'pg' },
        { from: 'signal', to: 'sfu', label: 'control', dashed: true },
      ],
    },
    metrics: [
      {
        label: 'Call shape',
        value: 'Multi-party',
        note: 'SFU path instead of mesh P2P for scale',
      },
      {
        label: 'Latency focus',
        value: 'Low-latency A/V',
        note: 'Mediasoup routing with Redis-backed session state',
      },
    ],
    decisions: [
      {
        choice: 'Mediasoup SFU over mesh WebRTC',
        rationale:
          'Mesh upload cost grows with every participant. An SFU keeps each client sending once and lets the server fan media out.',
        alternative: 'Peer-to-peer mesh for every meeting size',
      },
      {
        choice: 'Separate signaling from media',
        rationale:
          'Room events, auth and reconnect logic belong on a Node WebSocket plane; media stays on Mediasoup so either side can fail and recover independently.',
        alternative: 'One process owning both signaling and media',
      },
    ],
    incident: {
      broke:
        'Participants could join a room while media negotiation raced ahead of session state, producing one-way audio or phantom peers after a flaky reconnect.',
      fix:
        'Tightened handshake ordering on the signaling server, stored session truth in Redis, and made reconnect rebuild room membership before renegotiating tracks.',
    },
    features: [
      'Multi-party video and audio via Mediasoup',
      'Node WebSocket signaling for rooms and peers',
      'Redis session management and message brokering',
      'PostgreSQL storage for profiles and meeting history',
      'Designed for large conferences, not two-person demos',
    ],
    linkNote: 'Internal Cynayd product — architecture and role discussed on request',
    featured: true,
  },
  {
    id: 3,
    slug: 'hybrid-rag-search',
    title: 'Hybrid RAG Search',
    tagline:
      'Production retrieval that mixes FAISS and BM25, then reranks — so answers cite real sources instead of inventing them.',
    capabilityArea: 'Retrieval and grounding',
    category: 'rag',
    capabilities: ['rag', 'eval', 'backend'],
    role: 'AI Engineer - retrieval design and FastAPI delivery',
    timeframe: '2023 – present · Cynayd Solutions',
    status: 'private',
    problem:
      'Dense-only search misses exact product names, codes and phrases. Keyword-only search misses paraphrases. Either failure mode produces answers that sound confident and are wrong — unacceptable once you attach citations.',
    description:
      'I built a hybrid RAG pipeline that scrapes and chunks source pages, retrieves with FAISS for meaning and BM25 for exact terms, expands queries, reranks with a cross-encoder, and scores confidence before answering. The interactive path is a FastAPI + LangChain service that returns summarised answers with source citations and justifications.',
    technologies: [
      'Python',
      'FastAPI',
      'LangChain',
      'FAISS',
      'BM25',
      'BeautifulSoup',
      'Cross-encoder reranking',
    ],
    stackLayers: [
      { layer: 'Ingestion', items: ['BeautifulSoup scraping', 'Context-aware chunking'] },
      { layer: 'Retrieval', items: ['FAISS dense', 'BM25 sparse', 'Query expansion'] },
      { layer: 'Ranking', items: ['Cross-encoder rerank', 'Confidence scoring'] },
      { layer: 'API', items: ['FastAPI', 'LangChain', 'Cited answers'] },
    ],
    architecture: {
      summary:
        'Ingest once into dual indexes; at query time run dense and sparse retrieval in parallel, expand and rerank, then generate only from the surviving passages.',
      nodes: [
        { id: 'client', label: 'Search client', sublabel: 'question + citations', kind: 'client', column: 0, row: 0 },
        { id: 'api', label: 'FastAPI', sublabel: 'LangChain path', kind: 'api', column: 1, row: 0 },
        { id: 'ingest', label: 'Ingestion', sublabel: 'scrape + chunk', kind: 'api', column: 1, row: 1 },
        { id: 'hybrid', label: 'Hybrid retrieve', sublabel: 'FAISS + BM25', kind: 'orchestrator', column: 2, row: 0 },
        { id: 'rerank', label: 'Cross-encoder', sublabel: 'rerank + confidence', kind: 'tool', column: 3, row: 0 },
        { id: 'llm', label: 'Grounded answer', sublabel: 'cited response', kind: 'model', column: 4, row: 0 },
      ],
      edges: [
        { from: 'client', to: 'api' },
        { from: 'ingest', to: 'hybrid', dashed: true },
        { from: 'api', to: 'hybrid' },
        { from: 'hybrid', to: 'rerank' },
        { from: 'rerank', to: 'llm' },
      ],
    },
    metrics: [
      {
        label: 'Retrieval shape',
        value: 'Hybrid',
        note: 'Dense FAISS + sparse BM25 before generation',
      },
      {
        label: 'Answer contract',
        value: 'Cited',
        note: 'Source citation and confidence before the model speaks',
      },
    ],
    decisions: [
      {
        choice: 'Hybrid retrieval before the LLM',
        rationale:
          'FAISS alone drops exact tokens; BM25 alone drops paraphrases. Fusing both, then reranking, is cheaper than asking a larger model to compensate for bad context.',
        alternative: 'Dense-only vector search with a bigger context window',
      },
      {
        choice: 'Cross-encoder rerank + confidence gate',
        rationale:
          'First-stage recall is noisy. A reranker and a confidence score decide what is worth generating from, which keeps citations honest.',
        alternative: 'Top-k from the vector store straight into the prompt',
      },
    ],
    incident: {
      broke:
        'Naive fixed-size chunking split definitions away from the terms they defined, so retrieval returned fragments that looked relevant and produced fluent wrong answers.',
      fix:
        'Moved to context-aware chunking that keeps semantic units together, then required citation and confidence checks before the final response.',
    },
    features: [
      'URL/page ingestion with BeautifulSoup',
      'Context-aware document chunking',
      'FAISS + BM25 hybrid retrieval',
      'Query expansion and cross-encoder reranking',
      'FastAPI answers with source citations',
    ],
    linkNote: 'Production Cynayd system — walkthrough and design notes on request',
    featured: true,
  },
  {
    id: 4,
    slug: 'solar-savings-agent',
    title: 'Solar Savings Agent',
    tagline:
      'A LangGraph agent that routes between calculation, live search and feedback tools instead of one brittle chain.',
    capabilityArea: 'Agentic systems',
    category: 'agent',
    capabilities: ['agent', 'rag', 'fullstack'],
    role: 'Sole engineer - graph design, tools and persistence',
    timeframe: '2024',
    status: 'source-available',
    problem:
      'A single prompt that tries to calculate savings, search the web and remember feedback will fail in different ways on different turns. Without an explicit graph, retries replay everything and tool failures become user-facing stack traces.',
    description:
      'An agent built as a LangGraph StateGraph: a cheap router classifies intent, tool nodes run calculation, Tavily search, chart rendering or feedback writes, and each tool path has a fallback so the conversation continues with a partial answer instead of crashing. State is checkpointed so retries resume cleanly.',
    technologies: [
      'Python',
      'LangGraph',
      'LangChain',
      'Tavily',
      'SQLite',
      'Streamlit',
    ],
    stackLayers: [
      { layer: 'Interface', items: ['Conversational UI', 'Generated charts'] },
      { layer: 'Orchestration', items: ['LangGraph StateGraph', 'ToolNode', 'Conditional edges'] },
      { layer: 'Tools', items: ['Savings calculator', 'Tavily search', 'Chart renderer', 'Feedback writer'] },
      { layer: 'Data', items: ['SQLite feedback store', 'Cached search results'] },
      { layer: 'Reliability', items: ['ToolNode fallbacks', 'Typed error handling'] },
    ],
    architecture: {
      summary:
        'The router is the cheap fast path. Only tool-bearing intents reach execution, and results are summarised back into conversational form.',
      nodes: [
        { id: 'ui', label: 'Chat UI', sublabel: 'user turn', kind: 'client', column: 0, row: 0 },
        { id: 'router', label: 'Intent router', sublabel: 'conditional edges', kind: 'orchestrator', column: 1, row: 0 },
        { id: 'calc', label: 'Calculator', sublabel: 'deterministic', kind: 'tool', column: 2, row: 0 },
        { id: 'search', label: 'Tavily search', sublabel: 'live web', kind: 'tool', column: 2, row: 1 },
        { id: 'feedback', label: 'Feedback store', sublabel: 'SQLite', kind: 'data', column: 3, row: 0 },
        { id: 'answer', label: 'Response', sublabel: 'summarise tools', kind: 'model', column: 3, row: 1 },
      ],
      edges: [
        { from: 'ui', to: 'router' },
        { from: 'router', to: 'calc', label: 'savings' },
        { from: 'router', to: 'search', label: 'research' },
        { from: 'router', to: 'feedback', label: 'feedback', dashed: true },
        { from: 'calc', to: 'answer' },
        { from: 'search', to: 'answer' },
        { from: 'feedback', to: 'answer', dashed: true },
      ],
    },
    metrics: [
      {
        label: 'Control flow',
        value: 'StateGraph',
        note: 'Explicit nodes and edges instead of one mega-prompt',
      },
      {
        label: 'Failure mode',
        value: 'Fallback nodes',
        note: 'Partial answers over hard crashes',
      },
    ],
    decisions: [
      {
        choice: 'LangGraph over a single chain',
        rationale:
          'Routing, tools and memory are different failure domains. A graph makes each one inspectable and retryable.',
        alternative: 'One LangChain agent loop with unbounded tool use',
      },
      {
        choice: 'Deterministic calculator as a tool',
        rationale:
          'Savings math should not be left to the model. The LLM explains; the tool computes.',
        alternative: 'Ask the model to do arithmetic in-context',
      },
    ],
    incident: {
      broke:
        'Search tool timeouts aborted the entire turn and left the user with an error instead of the calculation that had already succeeded.',
      fix:
        'Wrapped tool nodes with fallbacks so a failed search still returns the calculated savings and states what could not be fetched.',
    },
    features: [
      'Intent routing before tool execution',
      'Savings calculation tool',
      'Live web search via Tavily',
      'Feedback persistence in SQLite',
      'Fallback paths on tool failure',
    ],
    linkNote: 'Source available on request — replace with your public repo URL when ready',
    featured: true,
  },
  {
    id: 5,
    slug: 'recommendation-engine',
    title: 'Recommendation Engine',
    tagline:
      'Collaborative and content-based recommendations served in real time through a FastAPI layer.',
    capabilityArea: 'Applied ML systems',
    category: 'ml',
    capabilities: ['backend', 'fullstack'],
    role: 'AI Engineer - modelling and API integration',
    timeframe: '2021 – 2023 · Cynayd Solutions',
    status: 'private',
    problem:
      'Generic “popular items” lists ignore behaviour. The product needed personalised suggestions that update from real user-item interaction data and arrive fast enough to show inside the app experience.',
    description:
      'I built a recommendation system using collaborative and content-based filtering over a user-item interaction matrix, implemented in Python with Scikit-learn, Pandas and NumPy, and exposed through FastAPI so the web app could request personalised suggestions in real time. The work improved engagement by focusing suggestions on observed behaviour rather than editorial lists.',
    technologies: [
      'Python',
      'Scikit-learn',
      'Pandas',
      'NumPy',
      'FastAPI',
      'Flask / Django',
    ],
    stackLayers: [
      { layer: 'Modelling', items: ['Collaborative filtering', 'Content-based filtering', 'User-item matrix'] },
      { layer: 'API', items: ['FastAPI real-time recommendations'] },
      { layer: 'Integration', items: ['Web / mobile consumer apps'] },
    ],
    architecture: {
      summary:
        'Behaviour data builds a user-item matrix offline; the API scores and returns personalised candidates on request.',
      nodes: [
        { id: 'app', label: 'Product UI', sublabel: 'web / mobile', kind: 'client', column: 0, row: 0 },
        { id: 'api', label: 'FastAPI', sublabel: 'recommend endpoint', kind: 'api', column: 1, row: 0 },
        { id: 'model', label: 'Rec models', sublabel: 'CF + content', kind: 'orchestrator', column: 2, row: 0 },
        { id: 'matrix', label: 'Interaction matrix', sublabel: 'user × item', kind: 'data', column: 3, row: 0 },
      ],
      edges: [
        { from: 'app', to: 'api' },
        { from: 'api', to: 'model' },
        { from: 'model', to: 'matrix' },
      ],
    },
    metrics: [
      {
        label: 'Engagement lift',
        value: '+20%',
        note: 'Measured after personalised suggestions shipped',
      },
    ],
    decisions: [
      {
        choice: 'Hybrid collaborative + content-based signals',
        rationale:
          'Pure collaborative filtering is cold-start blind; content features cover new items while interactions personalise over time.',
        alternative: 'Popularity ranking only',
      },
      {
        choice: 'Serve scores through FastAPI',
        rationale:
          'Keeping the model behind a versioned API let the product iterate UI without redeploying training code on every change.',
        alternative: 'Batch CSV drops into the app database',
      },
    ],
    features: [
      'User-item interaction modelling',
      'Collaborative and content-based filtering',
      'Real-time recommendation API',
      'Integration into consumer web experiences',
    ],
    linkNote: 'Internal Cynayd ML service — outcomes and approach discussed on request',
    featured: false,
  },
  {
    id: 6,
    slug: 'portfolio-agent',
    title: "This Site's Agent",
    tagline:
      'A live retrieval agent on this page: route, retrieve, tool call, then answer — with the trace visible.',
    capabilityArea: 'Integration and deployment',
    category: 'agent',
    capabilities: ['agent', 'rag', 'backend', 'fullstack'],
    role: 'Sole engineer - route, retrieval, tools and UI',
    timeframe: '2025 – 2026',
    status: 'live',
    problem:
      'Most portfolio chatbots are keyword scripts dressed as AI. That misleads visitors and teaches nothing about how the engineer actually builds agents.',
    description:
      'The Ask section on this site is a real agent path: intent routing, hybrid retrieval over the same profile and case-study data the page renders, an optional live GitHub tool, and streamed answers with citations and an execution trace. Without a model key it still answers extractively and says so.',
    technologies: [
      'Next.js',
      'TypeScript',
      'Route Handlers',
      'Hybrid retrieval',
      'Groq / OpenAI',
      'GitHub API',
    ],
    stackLayers: [
      { layer: 'Interface', items: ['Next.js client', 'Token streaming', 'Visible trace'] },
      { layer: 'Orchestration', items: ['Intent router', 'Tool dispatch', 'Grounded prompting'] },
      { layer: 'Tools', items: ['Portfolio retrieval', 'Live GitHub activity'] },
      { layer: 'Retrieval', items: ['Corpus derived from site data', 'Keyword + phrase scoring'] },
      { layer: 'Models', items: ['Groq or OpenAI when configured', 'Extractive fallback when not'] },
    ],
    architecture: {
      summary:
        'The same brain-and-hands split used in larger systems, scaled down to one route handler with no vendor lock-in.',
      nodes: [
        { id: 'ui', label: 'Agent console', sublabel: 'this page', kind: 'client', column: 0, row: 0 },
        { id: 'route', label: 'Intent router', sublabel: 'portfolio / github', kind: 'orchestrator', column: 1, row: 0 },
        { id: 'retrieve', label: 'Retriever', sublabel: 'site corpus', kind: 'tool', column: 2, row: 0 },
        { id: 'github', label: 'GitHub tool', sublabel: 'live repos', kind: 'tool', column: 2, row: 1 },
        { id: 'answer', label: 'Answer', sublabel: 'stream + citations', kind: 'model', column: 3, row: 0 },
      ],
      edges: [
        { from: 'ui', to: 'route' },
        { from: 'route', to: 'retrieve' },
        { from: 'route', to: 'github', label: 'activity', dashed: true },
        { from: 'retrieve', to: 'answer' },
        { from: 'github', to: 'answer', dashed: true },
      ],
    },
    metrics: [
      {
        label: 'Honesty mode',
        value: 'Extractive fallback',
        note: 'Works without a model key and labels itself',
      },
      {
        label: 'Provenance',
        value: 'Cited passages',
        note: 'Answers point back to profile and case-study chunks',
      },
    ],
    decisions: [
      {
        choice: 'Corpus derived from the same modules the page renders',
        rationale:
          'One edit to profile or project data updates both the site and what the agent knows — no second stale knowledge base.',
        alternative: 'Hand-written chatbot FAQ',
      },
      {
        choice: 'Show the execution trace',
        rationale:
          'Visitors should see route → retrieve → tool → answer. Hiding it would make this look like another black-box widget.',
        alternative: 'Chat bubble with no internals',
      },
    ],
    features: [
      'Intent routing for portfolio vs GitHub questions',
      'Retrieval over live site content',
      'Optional model generation with extractive fallback',
      'Visible trace and citations in the UI',
    ],
    liveUrl: '/#ask',
    featured: true,
  },
  {
    id: 7,
    slug: 'aviation-booking',
    title: 'Aviation Training Booking',
    tagline:
      'Full-stack booking platform with payments, calendar sync and PDF waiver automation for flight training.',
    capabilityArea: 'Full-stack product delivery',
    category: 'fullstack',
    capabilities: ['fullstack', 'backend'],
    role: 'Software Developer - platform architecture and integrations',
    timeframe: '2025 · Whistler Sky Sports / delivery via Cynayd & EXALIS',
    status: 'live',
    problem:
      'Flight schools juggle scheduling, payments, instructor availability and legal waivers across email and spreadsheets. Double bookings and missing paperwork are operational failures, not UI polish problems.',
    description:
      'I architected a Laravel booking platform with PayPal payments, Tailwind UI, Google Calendar and Sheets sync for instructor availability, automated email flows, multi-role student and admin portals, and PDF waiver generation for compliance. The admin dashboard centralises bookings, transactions, reviews and media.',
    technologies: [
      'Laravel',
      'PHP',
      'Tailwind CSS',
      'PayPal',
      'Google Calendar API',
      'Google Sheets API',
      'PDF automation',
    ],
    stackLayers: [
      { layer: 'Interface', items: ['Tailwind booking UI', 'Admin dashboard', 'Weather widget'] },
      { layer: 'Domain', items: ['Laravel', 'Multi-role auth', 'Booking calendar'] },
      { layer: 'Integrations', items: ['PayPal', 'Google Calendar', 'Google Sheets', 'Email'] },
      { layer: 'Compliance', items: ['PDF waiver automation', 'Stored legal documents'] },
    ],
    architecture: {
      summary:
        'Students and admins hit a Laravel app that coordinates payments, calendar truth and waiver PDFs through external APIs.',
      nodes: [
        { id: 'web', label: 'Booking UI', sublabel: 'student + admin', kind: 'client', column: 0, row: 0 },
        { id: 'app', label: 'Laravel', sublabel: 'domain + auth', kind: 'api', column: 1, row: 0 },
        { id: 'pay', label: 'PayPal', sublabel: 'payments', kind: 'tool', column: 2, row: 0 },
        { id: 'cal', label: 'Google APIs', sublabel: 'Calendar + Sheets', kind: 'tool', column: 2, row: 1 },
        { id: 'pdf', label: 'Waiver PDFs', sublabel: 'compliance', kind: 'data', column: 3, row: 0 },
        { id: 'db', label: 'App database', sublabel: 'bookings + users', kind: 'data', column: 3, row: 1 },
      ],
      edges: [
        { from: 'web', to: 'app' },
        { from: 'app', to: 'pay' },
        { from: 'app', to: 'cal' },
        { from: 'app', to: 'pdf' },
        { from: 'app', to: 'db' },
      ],
    },
    metrics: [
      {
        label: 'Scheduling integrity',
        value: 'Calendar-synced',
        note: 'Instructor availability via Google Calendar / Sheets',
      },
      {
        label: 'Compliance',
        value: 'PDF waivers',
        note: 'Automated generation and storage for training legal requirements',
      },
    ],
    decisions: [
      {
        choice: 'Google Calendar as availability source of truth',
        rationale:
          'Instructors already lived in calendars. Syncing availability beat inventing a second schedule they would ignore.',
        alternative: 'Custom availability tables only',
      },
      {
        choice: 'Automate waiver PDFs in the booking flow',
        rationale:
          'Compliance paperwork fails when it is a separate email step. Generating and storing waivers at booking time closes the gap.',
        alternative: 'Manual PDF upload after the fact',
      },
    ],
    features: [
      'Flight session booking and PayPal checkout',
      'Google Calendar and Sheets instructor sync',
      'Multi-role student and admin portals',
      'PDF waiver automation',
      'Admin dashboard for bookings and transactions',
    ],
    liveUrl: 'https://whistlerskysports.ca',
    featured: false,
  },
];

export const capabilityLabels: Record<string, string> = {
  rag: 'RAG',
  agent: 'LangGraph',
  mcp: 'MCP',
  eval: 'Eval',
  backend: 'Backend',
  realtime: 'Realtime',
  cloud: 'Cloud',
  fullstack: 'Full-stack',
  nlp: 'NLP',
};

export const categories = [
  { id: 'all', label: 'All' },
  { id: 'realtime', label: 'Realtime' },
  { id: 'rag', label: 'RAG' },
  { id: 'agent', label: 'Agents' },
  { id: 'ml', label: 'ML' },
  { id: 'fullstack', label: 'Full-stack' },
] as const;
