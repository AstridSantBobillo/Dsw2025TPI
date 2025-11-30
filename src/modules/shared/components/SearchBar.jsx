import Button from './Button';

export default function SearchBar({ value, onChange, onSearch }) {
  return (
    <div className="w-full flex items-center gap-1 h-10">

      {/* INPUT */}
      <input
        value={value}
        onChange={onChange}
        type="text"
        placeholder="Buscar productos..."
        className="
          border rounded
          w-full
          h-full
          px-2 py-1 text-sm              /* mobile */
          sm:px-3 sm:text-base           /* desktop */
        "
      />

      {/* BOTÓN */}
      <Button
        className="
          h-10 w-10 p-0
          flex items-center justify-center
          flex-shrink-0
        "
        onClick={onSearch}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
          <path
            d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18
            10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3
            10.5 3C14.6421 3 18 6.35786 18 10.5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
    </div>
  );
}
