import { useEffect } from 'react';

export function usePaginationFix(total, pageSize, pageNumber, setPageNumber) {
  useEffect(() => {
    if (total > 0) {
      const totalPages = Math.max(1, Math.ceil(total / pageSize));

      if (pageNumber > totalPages || pageNumber === 0) {
        setPageNumber(1);
      }
    }
  }, [total, pageSize, pageNumber, setPageNumber]);
}