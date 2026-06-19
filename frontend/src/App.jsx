import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { useWeather } from './hooks/useWeather';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import SearchHistoryList from './components/SearchHistoryList';
import HistoryItem from './components/HistoryItem';
import ErrorAlert from './components/ErrorAlert';
import LoadingSpinner from './components/LoadingSpinner';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Navbar from './components/Navbar';
import WeatherMap from './components/WeatherMap';

function Dashboard() {
  const { weather, history, loading, error, searchCity, clearAllHistory } = useWeather();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showHistory, setShowHistory] = useState(false);

  const handleSelectCity = (city) => {
    searchCity(city);
  };

  return (
    <>
      <WeatherMap weather={weather} />

      {/* Desktop sidebar */}
      <div className="hidden lg:flex fixed right-0 inset-y-0 w-72 z-20 flex-col backdrop-blur-xl"
        style={{ backgroundColor: 'var(--bg-glass)', borderLeft: '1px solid var(--border)' }}
      >
        <Navbar />
        <SearchHistoryList history={history} onClear={clearAllHistory} onSelect={handleSelectCity} />
      </div>

      {/* Mobile top bar */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 backdrop-blur-xl"
        style={{ backgroundColor: 'var(--bg-glass)', borderBottom: '1px solid var(--border)' }}
      >
        <span className="text-base font-serif tracking-tight">
          Weather<span className="italic" style={{ color: 'var(--amber)' }}>Station</span>
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleTheme}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)' }}
          >
            {theme === 'dark' ? (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            style={{
              backgroundColor: showHistory ? 'var(--amber)' : 'var(--bg-card)',
              color: showHistory ? '#0B0D14' : 'var(--text-primary)',
            }}
          >
            {showHistory ? 'Close' : `History (${history.length})`}
          </button>
        </div>
      </div>

      {/* Mobile history drawer */}
      {showHistory && (
        <>
          <div className="lg:hidden fixed inset-0 z-20" onClick={() => setShowHistory(false)} />
          <div
            className="lg:hidden fixed bottom-0 left-0 right-0 z-30 flex flex-col backdrop-blur-xl rounded-t-2xl"
            style={{
              backgroundColor: 'var(--bg-glass-heavy)',
              border: '1px solid var(--border)',
              maxHeight: '55vh',
            }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                History ({history.length})
              </span>
              {history.length > 0 && (
                <button
                  onClick={() => { clearAllHistory(); setShowHistory(false); }}
                  className="text-xs transition-colors"
                  style={{ color: 'var(--rose)' }}
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto">
              {history.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No searches recorded yet</p>
                </div>
              ) : (
                <div>
                  {history.map((entry, i) => (
                    <HistoryItem
                      key={entry.id || i}
                      entry={entry}
                      index={i}
                      compact
                      onSelect={(city) => { handleSelectCity(city); setShowHistory(false); }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center pt-16 lg:pt-12 px-4 lg:mr-72 gap-5">
        <SearchBar onSearch={searchCity} loading={loading} history={history} />
        <ErrorAlert message={error} />
        <LoadingSpinner loading={loading} />
        {weather && !loading && <WeatherCard weather={weather} />}
      </div>
    </>
  );
}

function AuthGate() {
  const { user, login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  if (user) return <Dashboard />;

  return (
    <main className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center stagger-fade">
      {isLogin ? (
        <LoginForm onLogin={login} onSwitch={() => setIsLogin(false)} />
      ) : (
        <SignupForm onSignup={signup} onSwitch={() => setIsLogin(true)} />
      )}
    </main>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen">
          <AuthGate />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
