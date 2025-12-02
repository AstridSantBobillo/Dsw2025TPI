export function getPaginationDisplayValues(total, pageNumber, pageSize) {
  const realTotalPages = Math.ceil((Number(total) || 0) / (Number(pageSize) || 1));

  return {
    displayedPage: total === 0 ? 0 : pageNumber,
    displayedTotalPages: total === 0 ? 0 : realTotalPages,
  };
}