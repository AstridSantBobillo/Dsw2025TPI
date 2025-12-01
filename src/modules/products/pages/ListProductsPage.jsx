import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Hooks
import useSearchState from '../../shared/hooks/useSearchState';

// Components
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import SearchBar from '../../shared/components/SearchBar';    
import Pagination from '../../shared/components/Pagination'; 

// Services
import { getProducts } from '../services/list';

const productStatus = {
  ALL: 'all',
  ENABLED: 'enabled',
  DISABLED: 'disabled',
};

function ListProductsPage() {
  const navigate = useNavigate();

  const { inputValue, searchTerm, setInputValue, commit, clear } = useSearchState("");

  const [ status, setStatus ] = useState(productStatus.ALL);
  const [ pageNumber, setPageNumber ] = useState(1);
  const [ pageSize, setPageSize ] = useState(10);

  const [ total, setTotal ] = useState(0);
  const [ products, setProducts ] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await getProducts(searchTerm, status, pageNumber, pageSize);
        if (error) throw error;

        setTotal(data.total);
        setProducts(data.productItems);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, status, pageNumber, pageSize]);

  const totalPages = Math.ceil(total / pageSize);

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
          {/* 🔎 SearchBar admin */}
          <SearchBar
            variant="admin"
            value={inputValue}
            onChange={(e) => {
              const v = e.target.value;
              setInputValue(v);
              if (v.trim() === "") {
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

      <div className='mt-4 flex flex-col gap-4'>
        {
          loading
            ? <span className='animate-pulse'>Buscando datos...</span>
            : products.map((product, index) => (
              <Card key={product.sku} className={`animate-slideUp`} style={{ animationDelay: `${index * 50}ms` }}>
                <div className="flex justify-between items-center w-full">
                  <div>
                    <h1>{product.sku} - {product.name}</h1>
                    <p className='text-base'>Stock: {product.stockQuantity} - ${product.currentUnitPrice} - {product.isActive ? 'Activado' : 'Desactivado'}</p>
                  </div>

                  <Button
                    className="hidden sm:flex h-11 w-11 items-center justify-center cursor-default">
                Ver
                  </Button>
                </div>
              </Card>
            ))
        }
      </div>

       {/* PAGINATION  */}
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
};

export default ListProductsPage;