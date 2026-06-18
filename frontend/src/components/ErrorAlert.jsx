export default function ErrorAlert({ message }) {
  if (!message) return null;

  return (
    <div
      className="w-full max-w-md rounded-xl border px-5 py-3 text-sm text-center animate-scale-in"
      style={{
        backgroundColor: 'rgba(251, 113, 133, 0.08)',
        borderColor: 'rgba(251, 113, 133, 0.2)',
        color: 'var(--rose)',
      }}
    >
      {message}
    </div>
  );
}
