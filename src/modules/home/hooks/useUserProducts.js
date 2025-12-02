import { useEffect, useState } from 'react';
import { getClientProducts } from '../../products/services/listUser';
import { handleApiError } from '../../shared/helpers/handleApiError';
import { frontendErrorMessage } from '../../products/helpers/backendError';
import useNoticeModal from '../../shared/hooks/useNoticeModal';

export default function useUserProducts(searchTerm, status = 'enabled') {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { open } = useNoticeModal();

  const normalizeProductsResponse = (raw) => {
    if (!raw) return { total: 0, productItems: [] };

    if (Array.isArray(raw)) return { total: raw.length, productItems: raw };

    const total = Number(raw.total ?? raw.totalCount ?? raw.count ?? 0) || 0;
    const productItems =
      Array.isArray(raw.productItems) ? raw.productItems :
        Array.isArray(raw.items) ? raw.items :
          Array.isArray(raw.results) ? raw.results : [];

    return { total, productItems };
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await getClientProducts(searchTerm, status, pageNumber, pageSize);

        if (error) throw error;

        const norm = normalizeProductsResponse(data);

        setProducts(norm.productItems);
        setTotal(norm.total);
      } catch (error) {
        const result = handleApiError(error, {
          frontendMessages: frontendErrorMessage,
          showAlert: false,
        });

        open(result.message);
        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, status, pageNumber, pageSize]);

  return {
    products,
    total,
    loading,
    pageNumber,
    pageSize,
    setPageNumber,
    setPageSize,
  };
}
