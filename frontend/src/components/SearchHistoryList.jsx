import HistoryItem from './HistoryItem';

export default function SearchHistoryList({ history, onClear }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          History
          <span className="ml-1.5 text-xs font-normal" style={{ color: 'var(--text-muted)' }}>({history.length})</span>
        </h3>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs transition-colors"
            style={{ color: 'var(--rose)' }}
            onMouseEnter={(e) => e.target.style.color = '#FDA4AF'}
            onMouseLeave={(e) => e.target.style.color = 'var(--rose)'}
          >
            Clear
          </button>
        )}
      </div>
      {history.length === 0 ? (
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            No searches recorded yet
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <tbody>
              {history.map((entry, index) => (
                <HistoryItem key={entry.id || index} entry={entry} index={index} compact />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
