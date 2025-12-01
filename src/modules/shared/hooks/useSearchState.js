import { useCallback, useState } from 'react';

export default function useSearchState(initial = '') {
  const [inputValue, setInputValue] = useState(initial);
  const [searchTerm, setSearchTerm] = useState(initial);

  const commit = useCallback(() => {
    setSearchTerm(inputValue.trim());
  }, [inputValue]);

  const clear = useCallback(() => {
    setInputValue('');
    setSearchTerm('');
  }, []);

  return {
    // valores
    inputValue,
    searchTerm,

    // setters
    setInputValue,
    setSearchTerm,

    // acciones
    commit, // confirma (al hacer Enter o click)
    clear,  // limpia ambos
  };
}
