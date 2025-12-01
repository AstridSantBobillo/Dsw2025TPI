export default function Pagination({
  page,
  totalPages,
  onChangePage,
  pageSize,
  onChangePageSize,
  sizes = [2, 10, 15, 20],
  className = '',
  showPageSize = true,
}) {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className={`flex justify-center items-center mt-3 ${className}`}>
      <button
        disabled={!canPrev}
        onClick={() => canPrev && onChangePage(page - 1)}
        className="bg-gray-200 disabled:bg-gray-100"
      >
        Atras
      </button>

      <span className="mx-2">{page} / {totalPages}</span>

      <button
        disabled={!canNext}
        onClick={() => canNext && onChangePage(page + 1)}
        className="bg-gray-200 disabled:bg-gray-100"
      >
        Siguiente
      </button>

      {showPageSize && (
        <select
          value={pageSize}
          onChange={(evt) => onChangePageSize(Number(evt.target.value))}
          className="ml-3"
        >
          {sizes.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      )}
    </div>
  );
}
