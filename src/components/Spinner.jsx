export default function Spinner({ className = '' }) {
  return (
    <div
      className={`h-6 w-6 animate-spin rounded-full border-2 border-court-200 border-t-court-600 ${className}`}
      role="status"
      aria-label="Loading"
    />
  )
}
