// pages/ListProductsPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSearchState from '../../shared/hooks/useSearchState';
import useNoticeModal from '../../shared/hooks/useNoticeModal';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import SearchBar from '../../shared/components/SearchBar';
import Pagination from '../../shared/components/Pagination';
import AdminProductCard from '../../products/components/AdminProductCard';
import NoticeModal from '../../shared/components/NoticeModal';
import { useAdminProductsList } from '../hooks/useAdminProductsList';
import { usePaginationFix } from '../../shared/hooks/usePaginationFix';
import { getPaginationDisplayValues } from '../../shared/helpers/paginationUtils';
import ProductsStatusSelect from '../components/ProductsStatusSelect';
import productStatus from '../helpers/productsStatus';

function ListProductsPage() {
  const navigate = useNavigate();
  const { inputValue, searchTerm, setInputValue, commit, clear } = useSearchState('');

  const [status, setStatus] = useState(productStatus.ALL);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { isOpen, isClosing, message, open, close } = useNoticeModal();
  const { total, products, loading } = useAdminProductsList({
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
      <Card className="overflow-visible">
        <div className='flex justify-between items-center mb-3'>
          <h1 className='text-3xl'>Productos</h1>

          <Button className='h-11 w-11 rounded-2xl sm:hidden' onClick={() => navigate('/admin/products/create')}>
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 11C4.44772 11 4 10.5523 4 10C4 9.44772 4.44772 9 5 9H15C15.5523 9 16 9.44772 16 10C16 10.5523 15.5523 11 15 11H5Z" fill="#000000"></path>
              <path d="M9 5C9 4.44772 9.44772 4 10 4C10.5523 4 11 4.44772 11 5V15C11 15.5523 10.5523 16 10 16C9.44772 16 9 15.5523 9 15V5Z" fill="#000000"></path>
            </svg>
          </Button>

          <Button className='hidden sm:block' onClick={() => navigate('/admin/products/create')}>
            Crear Producto
          </Button>
        </div>

        <div className='flex flex-col sm:flex-row gap-4 sm:items-center'>
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

          <ProductsStatusSelect
            value={status}
            onChange={(val) => {
              setStatus(val);
              setPageNumber(1);
            }}
          />
        </div>
      </Card>

      <div className="mt-4 flex flex-col gap-4">
        {loading && <span className="animate-pulse">Buscando productos...</span>}

        {!loading && products.length === 0 && (
          <Card className="p-4 text-center text-gray-600">
            No hay productos para mostrar.
          </Card>
        )}

        {hasResults && products.map((product) => (
          <AdminProductCard key={product.sku} product={product} />
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

      <NoticeModal isOpen={isOpen} isClosing={isClosing} message={message} onClose={close} />
    </div>
  );
}

export default ListProductsPage;
