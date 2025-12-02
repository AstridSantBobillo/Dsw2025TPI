import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useNoticeModal from '../../shared/hooks/useNoticeModal';
import useSearchState from '../../shared/hooks/useSearchState';
import { useCart } from '../../cart/hooks/useCart';

import Card from '../../shared/components/Card';
import MobileSideMenu from '../../shared/components/MobileSideMenu';
import UserHeaderMenu from '../../shared/components/UserHeaderMenu';
import LoginModal from '../../auth/components/LoginModal';
import RegisterModal from '../../auth/components/RegisterModal';
import NoticeModal from '../../shared/components/NoticeModal';
import Pagination from '../../shared/components/Pagination';
import ProductCard from '../../products/components/ProductCard';
import { useClientProductsList } from '../hooks/useClientProductsList';
import { usePaginationFix } from '../../shared/hooks/usePaginationFix';
import { getPaginationDisplayValues } from '../../shared/helpers/paginationUtils';
import { useGlobalLoginEvents } from '../hooks/useGlobalLoginEvents';
import defaultProductImage from '../helpers/defaultProductsImage';

function ListProductsUserPage() {
  const navigate = useNavigate();
  const { isOpen, isClosing, message, open, close } = useNoticeModal();

  const { inputValue, searchTerm, setInputValue, commit, clear } = useSearchState('');
  const [status] = useState('enabled');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);

  const { loading, total: fetchedTotal, products: fetchedProducts } = useClientProductsList({
    searchTerm,
    status,
    pageNumber,
    pageSize,
    onError: open,
  });

  const { cart, addToCart } = useCart();
  const [quantities, setQuantities] = useState({});
  const totalItems = cart.reduce((acc, p) => acc + p.quantity, 0);

  const [openCartMenu, setOpenCartMenu] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);

  useGlobalLoginEvents({
    onLoginOpen: () => setOpenLoginModal(true),
    onRegisterOpen: () => setOpenRegisterModal(true),
  });

  usePaginationFix(total, pageSize, pageNumber, setPageNumber);

  // Actualizar total y products cuando cambien los datos
  useState(() => {
    setTotal(fetchedTotal);
    setProducts(fetchedProducts);
  }, [fetchedTotal, fetchedProducts]);

  const { displayedPage, displayedTotalPages } = getPaginationDisplayValues(total, pageNumber, pageSize);
  const hasResults = !loading && total > 0;

  return (
    <div className="page-container">
      <UserHeaderMenu
        title="Productos"
        totalItems={totalItems}
        onGoCart={() => navigate('/cart')}
        onGoProducts={null}
        onGoHome={() => navigate('/')}
        onOpenLogin={() => setOpenLoginModal(true)}
        onOpenRegister={() => setOpenRegisterModal(true)}
        onOpenMobileMenu={() => setOpenCartMenu(true)}
        search={{
          value: inputValue,
          onChange: (e) => {
            const v = e.target.value;

            setInputValue(v);

            if (v.trim() === '') {
              clear();
              setPageNumber(1);
            }
          },
          onSearch: () => {
            commit();
            setPageNumber(1);
          },
        }}
      />

      <MobileSideMenu
        isOpen={openCartMenu}
        onClose={() => setOpenCartMenu(false)}
        title="Menú"
        onGoCart={() => {
          setOpenCartMenu(false);
          navigate('/cart');
        }}
        onGoProducts={null}
        totalItems={totalItems}
        onOpenLogin={() => {
          setOpenCartMenu(false);
          setOpenLoginModal(true);
        }}
        onOpenRegister={() => {
          setOpenCartMenu(false);
          setOpenRegisterModal(true);
        }}
      />

      <div className="mt-4 flex flex-col gap-[3px] sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4">
        {loading && <span className="animate-pulse">Buscando productos...</span>}

        {!loading && products.length === 0 && (
          <Card className="p-4 text-center text-gray-600">No hay productos para mostrar.</Card>
        )}

        {hasResults && products.map((product) => {
          const qty = quantities[product.sku] || 1;
          const cartItem = cart.find((item) => item.sku === product.sku);
          const inCartQty = cartItem?.quantity || 0;

          return (
            <Card key={product.sku} className="flex flex-col">
              <ProductCard
                product={product}
                quantity={qty}
                inCartQty={inCartQty}
                imageSrc={defaultProductImage}
                onChangeQty={(q) =>
                  setQuantities((prev) => ({ ...prev, [product.sku]: q }))
                }
                onAdd={() => {
                  addToCart(product, qty);
                  setQuantities((prev) => ({ ...prev, [product.sku]: 1 }));
                  open(`Se agregó "${product.name}" al carrito.`);
                }}
              />
            </Card>
          );
        })}
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

      <LoginModal isOpen={openLoginModal} onClose={() => setOpenLoginModal(false)} />
      <RegisterModal isOpen={openRegisterModal} onClose={() => setOpenRegisterModal(false)} />
      <NoticeModal variant="success" isOpen={isOpen} isClosing={isClosing} message={message} onClose={close} />
    </div>
  );
}

export default ListProductsUserPage;
