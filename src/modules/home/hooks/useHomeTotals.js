import { useEffect, useState } from 'react';
import { getOrders } from '../../orders/services/listServices';
import { getProducts } from '../../products/services/list';
import { handleApiError } from '../../shared/helpers/handleApiError';
import { frontendErrorMessage as productErrors } from '../../products/helpers/backendError';
import { frontendErrorMessage as orderErrors } from '../../orders/helpers/backendError';

const useHomeTotals = (onError = () => {}) => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const { data: prodData } = await getProducts('', '', 1, 1);

        if (prodData) setTotalProducts(prodData.total);
      } catch (err) {
        const { message } = handleApiError(err, {
          frontendMessages: productErrors,
          showAlert: false,
        });

        onError(message);
      }

      try {
        const { data: orderData } = await getOrders('', '', 1, 20);

        if (orderData) setTotalOrders(orderData.totalCount);
      } catch (err) {
        const { message } = handleApiError(err, {
          frontendMessages: orderErrors,
          showAlert: false,
        });

        onError(message);
      }
    };

    fetchTotals();
  }, [onError]);

  return { totalProducts, totalOrders };
};

export { useHomeTotals };
