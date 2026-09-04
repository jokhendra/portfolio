# Jokhendra Prajapati - Senior AI & Full-Stack Engineer portfolio

A Next.js 14 (App Router) portfolio positioned around two halves of the same
job: agentic AI systems (LangGraph, RAG, MCP) and the production backends that
run them (FastAPI, Express / NestJS, WebSockets, AWS). The site's own agent is
one of the case studies: it runs the same route / retrieve / tool pattern
described in the work section.

## Run it

```bash
npm install
npm run dev
```

Optional configuration - copy `env.example` to `.env.local`:

| Variable | Effect when unset |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Falls back to `http://localhost:3000` for metadata, robots, sitemap and the OG image |
| `NEXT_PUBLIC_CAL_LINK` | Schedule section is hidden entirely |
| `MONGODB_URI` | Contact form accepts submissions in demo mode without persisting |
| `GROQ_API_KEY` / `OPENAI_API_KEY` | Agent still routes, retrieves and answers extractively, and labels itself as retrieval-only |
| `AGENT_MODEL` | Defaults to `llama-3.3-70b-versatile` (Groq) or `gpt-4o-mini` (OpenAI) |

## Structure

```
src/
  app/
    page.tsx                  Section order (ids live on the sections themselves)
    layout.tsx                Fonts, metadata, pre-paint theme script
    opengraph-image.tsx       Social card generated from profile data (edge runtime)
    api/agent/route.ts        Portfolio agent: router, hybrid retrieval, GitHub tool, streaming
    api/contact/route.ts      Contact intake: honeypot, timing, bounds, rate limit
  components/
    Hero.tsx                  Brand-first hero with full-bleed agent graph plane
    Expertise.tsx             Interactive capability map
    Work.tsx                  Case study list + detail panel
    AgentArchitecture.tsx     Reference LangGraph / MCP architecture
    BackendPlatform.tsx       Reference backend architecture: gateways, services, queue, data, AWS
    StackLayers.tsx           Stack grouped by layer
    AgentConsole.tsx          Live agent UI with visible execution trace
    ArchitectureDiagram.tsx   Shared SVG diagram engine (nodes + edges from data)
  data/
    profile.ts                Brand, focus areas, stack, expertise graph, agent facts
    projects.ts               Case studies
    agentCorpus.ts            Agent corpus derived from profile.ts + projects.ts
```

### Content model

Editing `src/data/profile.ts` or `src/data/projects.ts` updates the page **and**
what the agent knows - `agentCorpus.ts` derives its chunks from those modules, so
there is no second copy to keep in sync.

Each case study in `projects.ts` carries `problem`, `architecture` (nodes and
edges rendered as an SVG diagram), `decisions`, `incident`, `metrics` and
`stackLayers`.

## Before publishing

The design and engineering are done; these items need your real values, and they
are the difference between a credible senior portfolio and a template:

1. **Measured metrics** - replace qualitative metrics (e.g. "Thousands", "24/7")
   with hard numbers from production where you can defend them in an interview
   (peak concurrent sockets, p95 chat latency, retrieval precision, cost).
2. **Project links** - `liveUrl` / `githubUrl` in `src/data/projects.ts`. Only
   add URLs that actually resolve. Where a project is not public, keep
   `linkNote` instead of inventing a link.
3. **Metrics** - any metric with `approximate: true` should be replaced with a
   measured number or deleted. Latency, retrieval precision, cost per query,
   and for backend work throughput and p95 latency carry the most weight in a
   technical screen.
4. **MCP evidence** - the site describes MCP as a tool boundary and the agent
   demonstrates tool use. If you have an MCP server repo, add it as a case study
   or link it from the agent case study.
5. **Resume link** - `profile.cvUrl` currently points at a Dropbox file; confirm
   it is the current version.
6. **Claims** - `profile.experienceYears`, the availability copy, and the
   backend and realtime tooling listed in `BackendPlatform.tsx` and
   `profileFacts` (MediaSoup, Socket.IO, Django, AWS Lambda) are the
   unverifiable statements on the site. Trim anything you would not want to be
   interviewed on.

## Notes on the agent

- Route: `POST /api/agent`, streams NDJSON events (`trace`, `sources`, `mode`,
  `token`, `done`) so the UI can render the execution path.
- Retrieval: sparse term weighting with IDF, plus phrase and tag bonuses; "how"
  and "why" questions bias toward architecture and decision chunks.
- Tool: live public GitHub activity, cached for 15 minutes, with a fallback
  answer when the API is unreachable.
- Degradation: no model key means extractive grounded answers, labelled as such
  in the UI rather than failing silently.
- Abuse controls: 15 questions per 5 minutes per client, 500 character cap, and
  history truncated to the last 6 turns.
