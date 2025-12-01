// src/modules/shared/components/EyeIcon.jsx
export default function EyeIcon({ open, className = "w-5 h-5" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className={className}
    >
      {open ? (
        <>
          <path d="M1 12s4.5-7 11-7 11 7 11 7-4.5 7-11 7-11-7-11-7Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="M3 3l18 18" />
          <path d="M10.73 5.08A9.12 9.12 0 0 1 12 5c6.5 0 11 7 11 7a20.3 20.3 0 0 1-4.22 4.88" />
          <path d="M6.61 6.61C3.95 8.28 2 12 2 12a20.33 20.33 0 0 0 5.62 5.92" />
          <path d="M9.5 9.5a3 3 0 0 1 4.26 4.26" />
        </>
      )}
    </svg>
  );
}
