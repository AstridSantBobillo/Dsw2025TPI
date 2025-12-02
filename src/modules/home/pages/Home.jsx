// Components
import Card from '../../shared/components/Card';

//Hook
import useDashboardTotals from '../hooks/useDashboardTotals';

function Home() {

  const { totalProducts, totalOrders } = useDashboardTotals();

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
