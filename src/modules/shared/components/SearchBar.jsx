import Button from "./Button";

const base =
  "w-full flex items-center gap-1 h-10";
const stylesByVariant = {
  shop: {
    input:
      "border rounded w-full h-full px-2 py-1 text-sm sm:px-3 sm:text-base",
    button:
      "h-10 w-10 p-0 flex items-center justify-center flex-shrink-0",
    placeholder: "Buscar productos...",
  },
  admin: {
    input:
      "border rounded-lg w-full h-11 px-3 text-[1.05rem] sm:text-[1.1rem]",
    button:
      "h-11 px-3 whitespace-nowrap flex items-center justify-center rounded-lg",
    placeholder: "Buscar…",
  },
};

export default function SearchBar({
  value,
  onChange,
  onSearch,
  onClear,
  disabled = false,
  placeholder,
  variant = "shop", // "shop" | "admin"
  className = "",
  showClear = true,
}) {
  const v = stylesByVariant[variant] ?? stylesByVariant.shop;
  const ph = placeholder ?? v.placeholder;

  return (
    <div className={`${base} ${className}`}>
      <input
        value={value}
        disabled={disabled}
        onChange={onChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSearch?.();
          if (e.key === "Escape" && onClear) onClear();
        }}
        type="text"
        placeholder={ph}
        className={v.input}
      />

      {showClear && value?.length > 0 && (
        <Button
          type="button"
          className={`${v.button} bg-gray-100 hover:bg-gray-200`}
          onClick={onClear}
          aria-label="Limpiar búsqueda"
        >
          ✕
        </Button>
      )}

      <Button
        type="button"
        className={`${v.button}`}
        onClick={onSearch}
        disabled={disabled}
        aria-label="Buscar"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.8 15.8 21 21M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
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
