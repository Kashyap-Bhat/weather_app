import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useWeather } from './hooks/useWeather';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import SearchHistoryList from './components/SearchHistoryList';
import ErrorAlert from './components/ErrorAlert';
import LoadingSpinner from './components/LoadingSpinner';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Navbar from './components/Navbar';
import WeatherMap from './components/WeatherMap';

function Dashboard() {
  const { weather, history, loading, error, searchCity, clearAllHistory } = useWeather();
  const { user, logout } = useAuth();
  const [showHistory, setShowHistory] = useState(false);

  return (
    <>
      <WeatherMap weather={weather} />

      {/* Desktop sidebar */}
      <div className="hidden lg:flex fixed right-0 inset-y-0 w-72 z-20 flex-col backdrop-blur-xl"
        style={{ backgroundColor: 'rgba(11, 13, 20, 0.88)', borderLeft: '1px solid var(--border)' }}
      >
        <Navbar />
        <SearchHistoryList history={history} onClear={clearAllHistory} />
      </div>

      {/* Mobile top bar */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 backdrop-blur-xl"
        style={{ backgroundColor: 'rgba(11, 13, 20, 0.88)', borderBottom: '1px solid var(--border)' }}
      >
        <span className="text-base font-serif tracking-tight">
          Weather<span className="italic" style={{ color: 'var(--amber)' }}>Station</span>
        </span>
        <div className="flex items-center gap-2">
          {user && (
            <button
              onClick={logout}
              className="text-xs transition-colors"
              style={{ color: 'var(--rose)' }}
            >
              Logout
            </button>
          )}
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
              backgroundColor: 'rgba(11, 13, 20, 0.95)',
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
                <table className="w-full">
                  <tbody>
                    {history.map((entry, i) => (
                      <tr key={entry.id || i} className="transition-colors" style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="py-2.5 px-4">
                          <span className="mr-1.5">{['☀️','🌤️','⛅','☁️','🌫️','🌦️','🌧️','🌨️','⛈️'][entry.weatherCode] || '❓'}</span>
                          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{entry.city}</span>
                        </td>
                        <td className="py-2.5 px-4 text-right text-sm" style={{ color: 'var(--amber)', fontFamily: "'JetBrains Mono', monospace" }}>
                          {Math.round(entry.temperature)}°
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center pt-16 lg:pt-12 px-4 lg:mr-72">
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
    <AuthProvider>
      <div className="min-h-screen">
        <AuthGate />
      </div>
    </AuthProvider>
  );
}
