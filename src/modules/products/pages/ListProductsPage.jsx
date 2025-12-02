import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Hooks
import useSearchState from '../../shared/hooks/useSearchState';
import useNoticeModal from '../../shared/hooks/useNoticeModal';

// Components
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import SearchBar from '../../shared/components/SearchBar';
import Pagination from '../../shared/components/Pagination';
import AdminProductCard from '../../products/components/AdminProductCard';
import NoticeModal from '../../shared/components/NoticeModal';

// Services
import { getProducts } from '../services/list';

//Helpers
import { handleApiError } from '../../shared/helpers/handleApiError';
import { frontendErrorMessage } from '../helpers/backendError';

const productStatus = {
  ALL: 'all',
  ENABLED: 'enabled',
  DISABLED: 'disabled',
};

function ListProductsPage() {
  const navigate = useNavigate();

  const { inputValue, searchTerm, setInputValue, commit, clear } = useSearchState('');

  const [ status, setStatus ] = useState(productStatus.ALL);
  const [ pageNumber, setPageNumber ] = useState(1);
  const [ pageSize, setPageSize ] = useState(10);

  const [ total, setTotal ] = useState(0);
  const [ products, setProducts ] = useState([]);

  const [loading, setLoading] = useState(false);
  
  const { isOpen, isClosing, message, open, close } = useNoticeModal();

  const normalizeProductsResponse = (raw) => {
    if (!raw) return { total: 0, productItems: [] };            // 204 / null

    if (Array.isArray(raw)) return { total: raw.length, productItems: raw };

    const total = Number(raw.total ?? raw.totalCount ?? raw.count ?? 0) || 0;
    const productItems =
    Array.isArray(raw.productItems) ? raw.productItems :
      Array.isArray(raw.items)        ? raw.items        :
        Array.isArray(raw.results)      ? raw.results      : [];

    return { total, productItems };
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await getProducts(searchTerm, status, pageNumber, pageSize);

        if (error) throw error;

        const norm = normalizeProductsResponse(data);

        setTotal(norm.total);
        setProducts(norm.productItems);
      } catch (error) {
       console.error(error);
  setTotal(0);
  setProducts([]);

  handleApiError(error, {
    frontendMessages: frontendErrorMessage,
    setErrorMessage: open, // 👈 importante: usa `open` del modal
    showAlert: false, // desactiva alert()
  });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, status, pageNumber, pageSize]);

  const realTotalPages = Math.ceil((Number(total) || 0) / (Number(pageSize) || 1));
  const displayedPage = total === 0 ? 0 : pageNumber;
  const displayedTotalPages = total === 0 ? 0 : realTotalPages;
  const hasResults = !loading && total > 0;

  return (
    <div>
      <Card className="overflow-visible">
        <div
          className='flex justify-between items-center mb-3'
        >
          <h1 className='text-3xl'>Productos</h1>
          <Button
            className='h-11 w-11 rounded-2xl sm:hidden'
            onClick={() => navigate('/admin/products/create')}
          >
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 11C4.44772 11 4 10.5523 4 10C4 9.44772 4.44772 9 5 9H15C15.5523 9 16 9.44772 16 10C16 10.5523 15.5523 11 15 11H5Z" fill="#000000"></path>
              <path d="M9 5C9 4.44772 9.44772 4 10 4C10.5523 4 11 4.44772 11 5V15C11 15.5523 10.5523 16 10 16C9.44772 16 9 15.5523 9 15V5Z" fill="#000000"></path>
            </svg>
          </Button>

          <Button
            className='hidden sm:block'
            onClick={() => navigate('/admin/products/create')}
          >
            Crear Producto
          </Button>
        </div>

        <div className='flex flex-col sm:flex-row gap-4 sm:items-center'>
          {/* SearchBar admin */}
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
            placeholder="Buscar (SKU, nombre)…"
            className="sm:flex-1"
          />

          <select
            value={status}
            onChange={(evt) => {
              setStatus(evt.target.value);
              setPageNumber(1);
            }}
            className='text-[1.1rem] border rounded px-2 py-2'
          >
            <option value={productStatus.ALL}>Todos</option>
            <option value={productStatus.ENABLED}>Habilitados</option>
            <option value={productStatus.DISABLED}>Inhabilitados</option>
          </select>
        </div>
      </Card>

      <div className="mt-4 flex flex-col gap-4">
        {loading && (
          <span className="animate-pulse">Buscando productos...</span>
        )}

        {!loading && products.length === 0 && (
          <Card className="p-4 text-center text-gray-600">
            No hay productos para mostrar.
          </Card>
        )}

        {hasResults &&
          products.map((product) => (
            <AdminProductCard
              key={product.sku}
              product={product}
            />
          ))
        }
      </div>

      {/* PAGINATION  */}
      <Card className="mt-6 overflow-visible">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
            compact
            className="flex flex-wrap gap-2 justify-center sm:justify-start"
          />

          <div className="text-sm text-gray-600">
            Total: <strong>{total}</strong>
          </div>
        </div>
      </Card>

            <NoticeModal isOpen={isOpen} isClosing={isClosing} message={message} onClose={close} />


    </div>

  );
};

export default ListProductsPage;