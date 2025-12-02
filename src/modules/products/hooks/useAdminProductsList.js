import { useEffect, useState } from 'react';
import { getProducts } from '../services/list';
import { handleApiError } from '../../shared/helpers/handleApiError';
import { frontendErrorMessage } from '../helpers/backendError';

const normalizeProductsResponse = (raw) => {
  if (!raw) return { total: 0, productItems: [] };

  if (Array.isArray(raw)) return { total: raw.length, productItems: raw };

  const total = Number(raw.total ?? raw.totalCount ?? raw.count ?? 0) || 0;
  const productItems =
    Array.isArray(raw.productItems) ? raw.productItems
      : Array.isArray(raw.items) ? raw.items
        : Array.isArray(raw.results) ? raw.results : [];

  return { total, productItems };
};

const useAdminProductsList = ({
  searchTerm,
  status,
  pageNumber,
  pageSize,
  onError = () => {},
}) => {
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await getProducts(searchTerm, status, pageNumber, pageSize);

        if (error) throw error;

        const norm = normalizeProductsResponse(data);

        setTotal(norm.total);
        setProducts(norm.productItems);
      } catch (error) {
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
  };
};

export { useAdminProductsList, normalizeProductsResponse };
