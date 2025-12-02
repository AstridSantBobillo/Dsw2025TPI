import Button from './Button';

export default function Pagination({
  page,
  totalPages,
  onChangePage,
  pageSize,
  onChangePageSize,
  sizes = [2, 10, 15, 20],
  className = '',
  showPageSize = true,
  totalItems = null,
}) {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className={`flex flex-col gap-3 items-center sm:flex-row sm:gap-4 sm:items-center sm:justify-center bg-white border border-gray-200 rounded-lg shadow-sm p-3 ${className}`}>
      <div className="flex gap-2 items-center sm:gap-4">
        <Button
          variant="secondary"
          disabled={!canPrev}
          onClick={() => canPrev && onChangePage(page - 1)}
          className="px-2 py-2 min-w-[72px] font-bold justify-center text-sm border-gray-400 leading-tight disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Atras
        </Button>

        <span className="text-sm font-medium px-3 py-2 bg-gray-100 rounded whitespace-nowrap">{page} / {totalPages}</span>

        <Button
          variant="secondary"
          disabled={!canNext}
          onClick={() => canNext && onChangePage(page + 1)}
          className="px-2 py-2 min-w-[72px] font-bold justify-center text-sm leading-tight disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
        </Button>

        {showPageSize && (
          <select
            value={pageSize}
            onChange={(evt) => onChangePageSize(Number(evt.target.value))}
            className="px-2 py-2 border border-gray-300 rounded text-sm leading-tight hover:border-gray-400 transition-colors duration-200"
          >
            {sizes.map((s) => (
              <option key={s} value={s}>{s} por pagina</option>
            ))}
          </select>
        )}
      </div>

      {totalItems !== null && (
        <div className="text-sm text-gray-600">
          Total: <strong>{totalItems}</strong>
        </div>
      )}
    </div>
  );
}
