import { useEffect, useState } from 'react';
import { getClientProducts } from '../../products/services/listUser';
import { handleApiError } from '../../shared/helpers/handleApiError';
import { frontendErrorMessage } from '../../products/helpers/backendError';

// Normaliza lo que venga del backend a un formato fijo { total, productItems }
// Sirve porque a veces el backend cambia las claves o devuelve un array directo.
const normalizeProductsResponse = (raw) => {
  // Nada -> vacio
  if (!raw) return { total: 0, productItems: [] };

  // Array plano -> total = largo del array
  if (Array.isArray(raw)) return { total: raw.length, productItems: raw };

  // Objeto: intentamos distintas claves conocidas
  const total = Number(raw.total ?? raw.totalCount ?? raw.count ?? 0) || 0;
  const productItems =
    Array.isArray(raw.productItems) ? raw.productItems
      : Array.isArray(raw.items) ? raw.items
        : Array.isArray(raw.results) ? raw.results : [];

  return { total, productItems };
};

const useClientProductsList = ({
  searchTerm,
  status,
  pageNumber,
  pageSize,
  onError = () => {},
}) => {
  const [total, setTotal] = useState(0);      // cantidad total de productos
  const [products, setProducts] = useState([]); // lista a mostrar
  const [loading, setLoading] = useState(false); // flag de carga

  useEffect(() => {
    // Fetch de productos cuando cambia algun filtro/paginacion
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await getClientProducts(
          searchTerm,
          status,
          pageNumber,
          pageSize,
        );

        if (error) throw error;

        const norm = normalizeProductsResponse(data);

        setTotal(norm.total);
        setProducts(norm.productItems);
      } catch (error) {
        // En error: mostramos mensaje amigable y limpiamos la lista
        const result = handleApiError(error, {
          frontendMessages: frontendErrorMessage,
          showAlert: false,
        });

        onError(result.message);
        setTotal(0);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, status, pageNumber, pageSize, onError]);

  return {
    total,
    products,
    loading,
    setTotal,
    setProducts,
  };
};

export { useClientProductsList, normalizeProductsResponse };
