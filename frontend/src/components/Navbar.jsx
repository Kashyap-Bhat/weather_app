import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
      <span className="text-lg font-serif tracking-tight">
        Weather<span className="italic" style={{ color: 'var(--amber)' }}>Station</span>
      </span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-secondary)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
        >
          {theme === 'dark' ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
        {user && (
          <div ref={ref} className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{
                backgroundColor: open ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                color: 'var(--text-secondary)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = open ? 'var(--bg-card-hover)' : 'var(--bg-card)'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            {open && (
              <div
                className="absolute right-0 top-full mt-2 w-48 rounded-xl border overflow-hidden z-50"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
              >
                <div className="px-4 py-3 text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                  {user.email}
                </div>
                <div className="border-t" style={{ borderColor: 'var(--border)' }}>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                    style={{ color: 'var(--rose)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
