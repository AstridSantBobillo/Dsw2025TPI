import { useEffect, useState } from 'react';
import { getOrders } from '../services/listServices';
import { handleApiError } from '../../shared/helpers/handleApiError';
import { frontendErrorMessage } from '../helpers/backendError';
import useNoticeModal from '../../shared/hooks/useNoticeModal';

export default function useOrderList({ searchTerm, status, pageNumber, pageSize }) {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const { open } = useNoticeModal();

  const normalizeOrdersResponse = (raw) => {
    if (!raw) return { totalCount: 0, items: [] };

    if (Array.isArray(raw)) return { totalCount: raw.length, items: raw };

    const totalCount = Number(raw.totalCount ?? raw.total ?? raw.count ?? 0) || 0;
    const items = Array.isArray(raw.items) ? raw.items : Array.isArray(raw.results) ? raw.results : [];

    return { totalCount, items };
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await getOrders(searchTerm, status, pageNumber, pageSize);

      if (error) throw error;

      const norm = normalizeOrdersResponse(data);
      setTotal(norm.totalCount);
      setOrders(norm.items);
    } catch (err) {
      const { message } = handleApiError(err, {
        frontendMessages: frontendErrorMessage,
        showAlert: false,
      });
      open(message);
      setTotal(0);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cuando cambian los filtros
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, status, pageSize, pageNumber]);

  return { orders, total, loading, setOrders, setTotal };
}
