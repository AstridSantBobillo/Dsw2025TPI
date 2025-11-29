import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import UserHeaderMenu from '../../shared/components/UserHeaderMenu';
import SearchBar from '../../shared/components/SearchBar';
import { getProducts } from '../services/list';

const productStatus = {
  ALL: 'all',
  ENABLED: 'enabled',
  DISABLED: 'disabled',
};

function ListProductsPage() {
  const navigate = useNavigate();

  const [ searchTerm, setSearchTerm ] = useState('');
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

  const handleSearch = async () => {
    setPageNumber(1);
  };

  return (
    <div className='space-y-4'>
      <UserHeaderMenu
        title='Productos'
        search={ {
          value: searchTerm,
          onChange: (evt) => setSearchTerm(evt.target.value),
          onSearch: handleSearch,
        } }
        onGoProducts={() => navigate('/admin/home')}
      />

      <Card>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <SearchBar
            value={searchTerm}
            onChange={(evt) => setSearchTerm(evt.target.value)}
            onSearch={handleSearch}
          />

          <div className='flex items-center gap-3'>
            <select
              onChange={evt => setStatus(evt.target.value)}
              className='text-[1.1rem] border rounded p-2'
              value={status}
            >
              <option value={productStatus.ALL}>Todos</option>
              <option value={productStatus.ENABLED}>Habilitados</option>
              <option value={productStatus.DISABLED}>Inhabilitados</option>
            </select>
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
        </div>
      </Card>

      <div className='flex flex-col gap-4'>
        {
          loading
            ? <span>Buscando datos...</span>
            : products.map(product => (
              <Card key={product.sku}>
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

      <div className='flex justify-center items-center mt-3'>
        <button
          disabled={pageNumber === 1}
          onClick={() => setPageNumber(pageNumber - 1)}
          className='bg-gray-200 disabled:bg-gray-100'
        >
          Atras
        </button>
        <span>{pageNumber} / {totalPages}</span>
        <button
          disabled={ pageNumber === totalPages }
          onClick={() => setPageNumber(pageNumber + 1)}
          className='bg-gray-200 disabled:bg-gray-100'
        >
          Siguiente
        </button>

        <select
          value={pageSize}
          onChange={evt => {
            setPageNumber(1);
            setPageSize(Number(evt.target.value));
          }}
          className='ml-3'
        >
          <option value="2">2</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>

  );
};

export default ListProductsPage;
