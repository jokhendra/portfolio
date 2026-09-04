import { focusAreas, profile, profileFacts, stackLayers } from './profile';
import { projects } from './projects';

export interface CorpusChunk {
  id: string;
  /** Human-readable source label, shown as a citation. */
  source: string;
  title: string;
  text: string;
  /** Extra retrieval signal beyond the body text. */
  tags: string[];
}

/**
 * The agent reads the same modules the page renders, so editing a case study
 * updates what the agent knows. There is no second copy of the content to drift.
 */
function buildCorpus(): CorpusChunk[] {
  const chunks: CorpusChunk[] = [];

  for (const fact of profileFacts) {
    chunks.push({
      id: fact.id,
      source: 'Profile',
      title: fact.title,
      text: fact.text,
      tags: [...fact.tags],
    });
  }

  chunks.push({
    id: 'focus-areas',
    source: 'Expertise',
    title: 'Capability areas',
    text: focusAreas
      .map((area) => `${area.title}: ${area.summary} Tools: ${area.keywords.join(', ')}.`)
      .join(' '),
    tags: [
      'expertise', 'focus', 'capabilities', 'strengths', 'specialise', 'specialize',
      'retrieval', 'agentic', 'backend', 'cloud', 'platform',
    ],
  });

  chunks.push({
    id: 'stack-layers',
    source: 'Stack',
    title: 'Stack by layer',
    text: stackLayers
      .map((layer) => `${layer.layer} (${layer.role}): ${layer.items.join(', ')}.`)
      .join(' '),
    tags: ['stack', 'tools', 'technologies', 'skills', 'languages', 'frameworks'],
  });

  for (const project of projects) {
    const base = [project.slug, project.title.toLowerCase(), project.category, ...project.capabilities];

    chunks.push({
      id: `${project.slug}-overview`,
      source: project.title,
      title: `${project.title} - overview`,
      text: `${project.tagline} ${project.problem} ${project.description} Role: ${project.role}. Timeframe: ${project.timeframe}. Stack: ${project.technologies.join(', ')}.`,
      tags: [...base, 'project', 'overview', 'problem', ...project.technologies.map((t) => t.toLowerCase())],
    });

    chunks.push({
      id: `${project.slug}-architecture`,
      source: project.title,
      title: `${project.title} - architecture`,
      text: `${project.architecture.summary} Components: ${project.architecture.nodes
        .map((node) => `${node.label}${node.sublabel ? ` (${node.sublabel})` : ''}`)
        .join(', ')}.`,
      tags: [...base, 'architecture', 'design', 'diagram', 'components', 'pipeline'],
    });

    chunks.push({
      id: `${project.slug}-decisions`,
      source: project.title,
      title: `${project.title} - decisions and tradeoffs`,
      text: project.decisions
        .map(
          (decision) =>
            `${decision.choice}: ${decision.rationale}${
              decision.alternative ? ` Alternative considered: ${decision.alternative}` : ''
            }`
        )
        .join(' '),
      tags: [...base, 'decisions', 'tradeoffs', 'why', 'rationale', 'alternatives'],
    });

    if (project.incident) {
      chunks.push({
        id: `${project.slug}-incident`,
        source: project.title,
        title: `${project.title} - what broke and how it was fixed`,
        text: `What broke: ${project.incident.broke} How it was fixed: ${project.incident.fix}`,
        tags: [...base, 'incident', 'failure', 'broke', 'bug', 'debug', 'reliability', 'lesson'],
      });
    }

    if (project.metrics.length > 0) {
      chunks.push({
        id: `${project.slug}-metrics`,
        source: project.title,
        title: `${project.title} - results`,
        text: project.metrics
          .map(
            (metric) =>
              `${metric.label}: ${metric.value}${metric.approximate ? ' (approximate)' : ''}${
                metric.note ? ` - ${metric.note}` : ''
              }`
          )
          .join(' '),
        tags: [...base, 'metrics', 'results', 'latency', 'performance', 'outcome'],
      });
    }
  }

  chunks.push({
    id: 'work-index',
    source: 'Selected work',
    title: 'Project index',
    text: projects
      .map((project) => `${project.title} - ${project.capabilityArea}: ${project.tagline}`)
      .join(' '),
    tags: ['projects', 'work', 'portfolio', 'list', 'built', 'case studies'],
  });

  return chunks;
}

export const corpus: CorpusChunk[] = buildCorpus();

export const agentSuggestions = [
  'How do you structure a LangGraph agent?',
  'How did you scale realtime on My Live?',
  'Why hybrid retrieval instead of dense-only?',
  'What backend and WebRTC experience do you have?',
  'What broke in one of these projects?',
  'How do you deploy and operate services on AWS?',
  `What has ${profile.shortName} been building on GitHub?`,
];
