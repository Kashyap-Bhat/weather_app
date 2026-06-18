export default function LoadingSpinner({ loading }) {
  if (!loading) return null;

  return (
    <div className="flex items-center justify-center py-8 gap-1.5">
      <span className="w-2 h-2 rounded-full pulse-dot inline-block" style={{ backgroundColor: 'var(--amber)' }}></span>
      <span className="w-2 h-2 rounded-full pulse-dot inline-block" style={{ backgroundColor: 'var(--amber)' }}></span>
      <span className="w-2 h-2 rounded-full pulse-dot inline-block" style={{ backgroundColor: 'var(--amber)' }}></span>
    </div>
  );
}
