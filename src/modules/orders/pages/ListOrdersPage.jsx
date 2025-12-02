import { useState } from 'react';
import useSearchState from '../../shared/hooks/useSearchState';
import useNoticeModal from '../../shared/hooks/useNoticeModal';
import Card from '../../shared/components/Card';
import SearchBar from '../../shared/components/SearchBar';
import Pagination from '../../shared/components/Pagination';
import OrderCard from '../components/OrderCard';
import { useOrdersList } from '../hooks/useOrdersList';
import { usePaginationFix } from '../../shared/hooks/usePaginationFix';
import { getPaginationDisplayValues } from '../../shared/helpers/paginationUtils';
import OrderStatusSelect from '../components/OrderStatusSelect';
import { orderStatus } from '../helpers/orderStatus';

function ListOrdersPage() {
  const { inputValue, searchTerm, setInputValue, commit, clear } = useSearchState('');
  const [status, setStatus] = useState(orderStatus.ALL);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { open } = useNoticeModal();

  const { total, orders, loading } = useOrdersList({
    searchTerm,
    status,
    pageNumber,
    pageSize,
    onError: open,
  });

  usePaginationFix(total, pageSize, pageNumber, setPageNumber);

  const { displayedPage, displayedTotalPages } = getPaginationDisplayValues(total, pageNumber, pageSize);
  const hasResults = !loading && total > 0;

  return (
    <div>
      <Card>
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-3xl">Órdenes</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <SearchBar
            variant="admin"
            value={inputValue}
            onChange={(e) => {
              const v = e.target.value;

              setInputValue(v);

              if (v.trim() === '') {
                clear();
                setPageNumber(1);
              }
            }}
            onSearch={() => {
              commit();
              setPageNumber(1);
            }}
            onClear={() => {
              clear();
              setPageNumber(1);
            }}
            placeholder="Buscar por nombre de cliente…"
            className="sm:flex-1"
          />

          <OrderStatusSelect
            value={status}
            onChange={(val) => {
              setStatus(val);
              setPageNumber(1);
            }}
          />
        </div>
      </Card>

      <div className="mt-4 flex flex-col gap-4">
        {loading && <span className="animate-pulse">Cargando órdenes...</span>}

        {!loading && total === 0 && (
          <Card className="p-4 text-center text-gray-600">
            No hay órdenes para mostrar.
          </Card>
        )}

        {hasResults &&
          orders.map((order, index) => (
            <div key={order.id} style={{ animationDelay: `${index * 50}ms` }}>
              <OrderCard order={order} onView={() => {}} />
            </div>
          ))}
      </div>

      <Pagination
        page={displayedPage}
        totalPages={displayedTotalPages}
        onChangePage={setPageNumber}
        pageSize={pageSize}
        onChangePageSize={(size) => {
          setPageNumber(1);
          setPageSize(size);
        }}
        sizes={[2, 10, 15, 20]}
        showPageSize
        totalItems={total}
        className="mt-6"
      />
    </div>
  );
}

export default ListOrdersPage;
