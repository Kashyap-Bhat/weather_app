import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
      <span className="text-lg font-serif tracking-tight">
        Weather<span className="italic" style={{ color: 'var(--amber)' }}>Station</span>
      </span>
      {user && (
        <div className="flex items-center gap-3">
          <span className="text-xs truncate max-w-[120px]" style={{ color: 'var(--text-muted)' }}>{user.email}</span>
          <button
            onClick={logout}
            className="text-xs font-medium transition-colors"
            style={{ color: 'var(--rose)' }}
            onMouseEnter={(e) => e.target.style.color = '#FDA4AF'}
            onMouseLeave={(e) => e.target.style.color = 'var(--rose)'}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
