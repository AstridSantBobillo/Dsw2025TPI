import { useEffect, useState } from 'react';
// Components
import Card from '../../shared/components/Card';
import { handleApiError } from '../../shared/helpers/handleApiError';
import { frontendErrorMessage as productErrors } from '../../products/helpers/backendError';
import { frontendErrorMessage as orderErrors } from '../../orders/helpers/backendError';

// Services
import { getOrders } from '../../orders/services/listServices';
import { getProducts } from '../../products/services/list';
import useNoticeModal from '../../shared/hooks/useNoticeModal';

function Home() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const { open } = useNoticeModal();

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const { data: prodData } = await getProducts('', '', 1, 1);

        if (prodData) setTotalProducts(prodData.total);

        const { data: orderData } = await getOrders('', '', 1, 20);

        if (orderData) setTotalOrders(orderData.totalCount);

      } catch (err) {
        const { message } = handleApiError(err, {
          frontendMessages: productErrors,
          showAlert: false,
        });

        open(message);
      }

      try {
        const { data: orderData } = await getOrders('', '', 1, 20);

        if (orderData) setTotalOrders(orderData.totalCount);
      } catch (err) {
        const { message } = handleApiError(err, {
          frontendMessages: orderErrors,
          showAlert: false,
        });

        open(message);
      }
    };

    fetchTotals();
  }, []);

  return (
    <div className="
    flex
    flex-col
    gap-3
    sm:grid
    sm:grid-cols-2
    ">
      <Card className="animate-slideUp" style={{ animationDelay: '0ms' }}>
        <h3>Productos</h3>
        <p>Cantidad: {totalProducts}</p>
      </Card>

      <Card className="animate-slideUp" style={{ animationDelay: '50ms' }}>
        <h3>Órdenes</h3>
        <p>Cantidad: {totalOrders}</p>
      </Card>
    </div>
  );
}

export default Home;
