import Card from '../../shared/components/Card';
import useNoticeModal from '../../shared/hooks/useNoticeModal';
import { useHomeTotals } from '../hooks/useHomeTotals';

function Home() {
  const { open } = useNoticeModal();
  const { totalProducts, totalOrders } = useHomeTotals(open);

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
