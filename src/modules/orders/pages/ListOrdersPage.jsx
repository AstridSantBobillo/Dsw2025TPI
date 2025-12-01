import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

//Hooks
import useSearchState from '../../shared/hooks/useSearchState';

// Components
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import SearchBar from '../../shared/components/SearchBar';   
import Pagination from '../../shared/components/Pagination'; 

// Services
import { getOrders } from '../services/listServices';

const orderStatus = {
  ALL: '',
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

function ListOrdersPage() {
  const navigate = useNavigate();

  const { inputValue, searchTerm, setInputValue, commit, clear } = useSearchState('');
  const [status, setStatus] = useState(orderStatus.ALL);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [total, setTotal] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await getOrders(searchTerm, status, pageNumber, pageSize);
      if (error) throw error;

      setTotal(data.totalCount);      
      setOrders(data.items ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchOrders();
  }, [searchTerm, status, pageSize, pageNumber]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <Card>
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-3xl">Órdenes</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          {/*  SearchBar estilo admin + botón limpiar */}
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
            placeholder="Buscar (ID, cliente, estado)…"
            className="sm:flex-1"
          />

          {/* Filtro de estado */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPageNumber(1);
            }}
            className="text-[1.1rem] border rounded px-2 py-2"
          >
            <option value={orderStatus.ALL}>Todos</option>
            <option value={orderStatus.PENDING}>Pendientes</option>
            <option value={orderStatus.PROCESSING}>Procesadas</option>
            <option value={orderStatus.SHIPPED}>Enviadas</option>
            <option value={orderStatus.DELIVERED}>Entregadas</option>
            <option value={orderStatus.COMPLETED}>Completadas</option>
            <option value={orderStatus.CANCELLED}>Canceladas</option>
          </select>
        </div>
      </Card>

      <div className="mt-4 flex flex-col gap-4">
        {loading ? (
          <span className="animate-pulse">Cargando órdenes...</span>
        ) : (
          orders.map((order, index) => (
           <Card key={order.id} className="animate-slideUp" style={{ animationDelay: `${index * 50}ms` }}>
            <div className="flex justify-between items-center w-full">
              <div>
                <h1>#{order.id} | {order.customerId}</h1>
                <p>Estado: {order.status}</p>
              </div>

              <Button 
                className="hidden sm:flex h-11 w-11 items-center justify-center cursor-default"
              >
                Ver
              </Button>
            </div>
          </Card>
          ))
        )}
      </div>

      {/* PAGINACIÓN */}
      <Card className="mt-6 overflow-visible">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Pagination
            page={pageNumber}
            totalPages={Math.max(1, Math.ceil(total / pageSize))}
            onChangePage={setPageNumber}
            pageSize={pageSize}
            onChangePageSize={(size) => {
              setPageNumber(1);
              setPageSize(size);
            }}
            sizes={[2, 10, 15, 20]}
            showPageSize
            compact
            className="flex flex-wrap gap-2 justify-center sm:justify-start" // 👈 wrap
          />

          <div className="text-sm text-gray-600">
            Total: <strong>{total}</strong>
          </div>
        </div>
      </Card>

    </div>
  );
}

export default ListOrdersPage;

