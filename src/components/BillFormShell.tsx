import { useNavigate } from 'react-router';
import AppShell from './AppShell';

interface BillFormShellProps {
  title: string;
  bannerImage: string;
  children: React.ReactNode;
  providers?: { id: string; name: string; logo: string }[];
  selectedProvider?: string | null;
  onProviderSelect?: (id: string) => void;
}

export default function BillFormShell({
  title, bannerImage, children, providers, selectedProvider, onProviderSelect,
}: BillFormShellProps) {
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="bfs-page">

        <div className="bfs-breadcrumb">
          <button type="button" className="bfs-breadcrumb__link" onClick={() => navigate('/bills')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Bills
          </button>
          <span className="bfs-breadcrumb__sep">›</span>
          <span className="bfs-breadcrumb__current">{title}</span>
        </div>

        <h1 className="bfs-title">{title}</h1>

        <div className="bfs-card">
          <div className="bfs-illustration">
            <img src={bannerImage} alt={title} className="bfs-illustration__img" />
          </div>
          <div className="bfs-form">{children}</div>
        </div>

        {providers && providers.length > 0 && (
          <div className="bfs-platforms">
            <h3 className="bfs-platforms__title">Common Platforms</h3>
            <div className="bfs-platforms__grid">
              {providers.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`bfs-platform-card${selectedProvider === p.id ? ' bfs-platform-card--active' : ''}`}
                  onClick={() => onProviderSelect?.(p.id)}
                >
                  <div className="bfs-platform-card__logo">
                    <img src={p.logo} alt={p.name}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                  <span className="bfs-platform-card__name">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
