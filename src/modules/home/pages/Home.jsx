import { useEffect, useState } from 'react';
import Card from '../../shared/components/Card';
import { getOrders } from '../../orders/services/listServices';
import { getProducts } from '../../products/services/list';

function Home() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const { data: prodData } = await getProducts('', '', 1, 1);

        if (prodData) setTotalProducts(prodData.total);

        const { data: orderData } = await getOrders('', '', 1, 20);

        if (orderData) setTotalOrders(orderData.totalCount);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTotals();
  }, []);

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
