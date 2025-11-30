function Input({ label, error = '', compact = false, suffix = null, ...restProps }) {
  return (
    <div
      className={`
        flex
        flex-col
        ${compact ? 'h-auto gap-1' : 'h-20'}
        animate-fadeIn
      `}
    >
      <label className="text-sm text-black">{label}:</label>
      <div className="flex items-center gap-2">
        <input
          className={`flex-1 h-10 rounded border px-3 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? 'border-red-400' : 'border-gray-300'}`}
          {...restProps}
        />
        {suffix}
      </div>
      {error && <p className="text-red-500 text-base sm:text-xs">{error}</p>}
    </div>
  );
};

export default Input;
