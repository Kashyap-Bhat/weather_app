import { useState } from 'react';

export default function LoginForm({ onLogin, onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm animate-scale-in">
      <h2 className="text-3xl font-serif tracking-tight mb-8 text-center" style={{ color: 'var(--text-primary)' }}>
        Sign In
      </h2>
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border p-7 space-y-5"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        {error && (
          <div
            className="rounded-xl border px-4 py-2.5 text-sm text-center"
            style={{
              backgroundColor: 'rgba(251, 113, 133, 0.08)',
              borderColor: 'rgba(251, 113, 133, 0.2)',
              color: 'var(--rose)',
            }}
          >
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
          <input
            type="email" value={email} required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border outline-none text-sm transition-all duration-200"
            style={{
              backgroundColor: 'var(--bg-input)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--amber)'; e.target.style.boxShadow = '0 0 0 3px var(--amber-glow)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password</label>
          <input
            type="password" value={password} required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border outline-none text-sm transition-all duration-200"
            style={{
              backgroundColor: 'var(--bg-input)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--amber)'; e.target.style.boxShadow = '0 0 0 3px var(--amber-glow)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
          />
        </div>
        <button
          type="submit" disabled={submitting}
          className="w-full py-3 rounded-xl font-medium text-sm transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--amber)',
            color: '#0B0D14',
          }}
          onMouseEnter={(e) => { if (!submitting) { e.target.style.backgroundColor = '#D97706'; e.target.style.transform = 'translateY(-1px)'; }}}
          onMouseLeave={(e) => { if (!submitting) { e.target.style.backgroundColor = 'var(--amber)'; e.target.style.transform = 'none'; }}}
        >
          {submitting ? 'Signing in...' : 'Sign In'}
        </button>
        <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
          No account?{' '}
          <button type="button" onClick={onSwitch} className="transition-colors" style={{ color: 'var(--amber)' }}
            onMouseEnter={(e) => e.target.style.color = '#D97706'}
            onMouseLeave={(e) => e.target.style.color = 'var(--amber)'}>
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
}
