import { useEffect, useState } from 'react';
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
  }, [open]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 auto-rows-fr">
      <Card>
        <div className="space-y-1">
          <p className="text-1xl text-black">Productos</p>
        </div>
        <p className="mt-2 text-lg text-gray-900">Total publicados en la tienda <strong>{totalProducts}</strong></p>
      </Card>

      <Card>
        <div className="space-y-1">
          <p className="text-1xl text-black">Ordenes</p>
        </div>
        <p className="mt-2 text-lg text-gray-900">Total registradas en el sistema <strong>{totalOrders}</strong></p>
      </Card>
    </div>
  );
}

export default Home;
