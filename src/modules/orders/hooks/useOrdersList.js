import { useEffect, useState } from 'react';
import { getOrders } from '../services/listServices';
import { handleApiError } from '../../shared/helpers/handleApiError';
import { frontendErrorMessage } from '../helpers/backendError';

const normalizeOrdersResponse = (raw) => {
  if (!raw) return { totalCount: 0, items: [] };

  if (Array.isArray(raw)) return { totalCount: raw.length, items: raw };

  const totalCount = Number(raw.totalCount ?? raw.total ?? raw.count ?? 0) || 0;
  const items = Array.isArray(raw.items)
    ? raw.items
    : Array.isArray(raw.results)
      ? raw.results
      : [];

  return { totalCount, items };
};

const useOrdersList = ({
  searchTerm,
  status,
  pageNumber,
  pageSize,
  onError = () => {},
}) => {
  const [total, setTotal] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

        onError(message);
        setTotal(0);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [searchTerm, status, pageNumber, pageSize, onError]);

  return {
    total,
    orders,
    loading,
    setTotal,
    setOrders,
  };
};

export { useOrdersList, normalizeOrdersResponse };
