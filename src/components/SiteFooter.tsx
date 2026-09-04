import { profile } from '@/data/profile';

export default function SiteFooter() {
  return (
    <footer className="section-band relative z-10 py-10">
      <div className="page-shell flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-ink">{profile.name}</p>
          <p className="mono mt-1 text-[10px] uppercase tracking-[0.16em] text-faint">
            {profile.role} · {profile.supportingLine}
          </p>
        </div>

        <nav className="flex gap-5" aria-label="Footer">
          <a
            href={profile.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted transition-colors hover:text-accent"
          >
            GitHub
          </a>
          <a
            href={profile.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted transition-colors hover:text-accent"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="text-xs text-muted transition-colors hover:text-accent"
          >
            Email
          </a>
        </nav>
      </div>
    </footer>
  );
}
