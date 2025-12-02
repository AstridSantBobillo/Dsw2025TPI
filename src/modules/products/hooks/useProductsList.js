import { useEffect, useState } from 'react';
import { getProducts } from '../services/list';
import { handleApiError } from '../../shared/helpers/handleApiError';
import { frontendErrorMessage } from '../helpers/backendError';
import useNoticeModal from '../../shared/hooks/useNoticeModal';

export default function useProductList({ searchTerm, status, pageNumber, pageSize }) {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const { open } = useNoticeModal();

  const normalizeProductsResponse = (raw) => {
    if (!raw) return { total: 0, items: [] };

    if (Array.isArray(raw)) return { total: raw.length, items: raw };

    const total = Number(raw.total ?? raw.totalCount ?? raw.count ?? 0) || 0;
    const items =
      Array.isArray(raw.productItems) ? raw.productItems :
        Array.isArray(raw.items) ? raw.items :
          Array.isArray(raw.results) ? raw.results : [];

    return { total, items };
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await getProducts(searchTerm, status, pageNumber, pageSize);

      if (error) throw error;

      const norm = normalizeProductsResponse(data);

      setTotal(norm.total);
      setProducts(norm.items);
    } catch (err) {
      const { message } = handleApiError(err, {
        frontendMessages: frontendErrorMessage,
        showAlert: false,
      });

      open(message);
      setTotal(0);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, status, pageSize, pageNumber]);

  return { products, total, loading, setProducts, setTotal };
}
