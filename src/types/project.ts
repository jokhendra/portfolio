export type Capability =
  | 'rag'
  | 'agent'
  | 'mcp'
  | 'eval'
  | 'backend'
  | 'realtime'
  | 'cloud'
  | 'fullstack'
  | 'nlp';

export type ProjectStatus = 'live' | 'demo' | 'source-available' | 'private';

/** Node kinds drive the visual treatment in ArchitectureDiagram. */
export type DiagramNodeKind =
  | 'client'
  | 'api'
  | 'orchestrator'
  | 'tool'
  | 'data'
  | 'model';

export interface DiagramNode {
  id: string;
  label: string;
  sublabel?: string;
  kind: DiagramNodeKind;
  /** Zero-indexed left-to-right position. */
  column: number;
  /** Zero-indexed top-to-bottom position inside the column. */
  row: number;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
  /** Dashed edges denote conditional or fallback paths. */
  dashed?: boolean;
}

export interface ProjectArchitecture {
  summary: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export interface ProjectMetric {
  label: string;
  value: string;
  note?: string;
  /** Rendered with a qualifier so measured and approximate numbers are never confused. */
  approximate?: boolean;
}

export interface ProjectDecision {
  choice: string;
  rationale: string;
  alternative?: string;
}

export interface ProjectIncident {
  broke: string;
  fix: string;
}

export interface ProjectStackLayer {
  layer: string;
  items: string[];
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  tagline: string;
  /** Capability area this project is the flagship for. */
  capabilityArea: string;
  category: string;
  capabilities: Capability[];
  role: string;
  timeframe: string;
  status: ProjectStatus;
  problem: string;
  description: string;
  technologies: string[];
  stackLayers: ProjectStackLayer[];
  architecture: ProjectArchitecture;
  metrics: ProjectMetric[];
  decisions: ProjectDecision[];
  incident?: ProjectIncident;
  features: string[];
  liveUrl?: string;
  githubUrl?: string;
  /** Shown instead of a fake link when a URL is not published yet. */
  linkNote?: string;
  featured: boolean;
}
