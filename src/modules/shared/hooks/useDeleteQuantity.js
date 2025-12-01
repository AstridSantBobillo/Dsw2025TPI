// src/modules/shared/hooks/useDeleteQuantity.js
import { useState, useCallback } from "react";

export function useDeleteQuantity() {
  const [map, setMap] = useState({}); // { [sku]: number }

  const get = useCallback((sku) => {
    const v = map[sku];
    return typeof v === "number" && v > 0 ? v : 1; // ⬅️ default 1
  }, [map]);

  const set = useCallback((sku, next) => {
    setMap((prev) => ({ ...prev, [sku]: Math.max(1, Math.floor(next || 1)) }));
  }, []);

  const increment = useCallback((sku, max) => {
    setMap((prev) => {
      const current = typeof prev[sku] === "number" ? prev[sku] : 1;
      const next = current + 1;
      const capped = typeof max === "number" ? Math.min(next, max) : next;
      return { ...prev, [sku]: Math.max(1, capped) };
    });
  }, []);

  const decrement = useCallback((sku) => {
    setMap((prev) => {
      const current = typeof prev[sku] === "number" ? prev[sku] : 1;
      const next = Math.max(1, current - 1);
      return { ...prev, [sku]: next };
    });
  }, []);

  // reset a 1 por defecto (o al valor que pases)
  const reset = useCallback((sku, next = 1) => {
    setMap((prev) => {
      const value = Math.max(1, Math.floor(next));
      return { ...prev, [sku]: value };
    });
  }, []);

  // opcional: para limpiar completamente si lo necesitás
  const clear = useCallback((sku) => {
    setMap((prev) => {
      const { [sku]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  return {
    deleteQuantities: map,
    get,
    set,
    increment,
    decrement,
    reset,
    clear,
  };
}

export default useDeleteQuantity;
