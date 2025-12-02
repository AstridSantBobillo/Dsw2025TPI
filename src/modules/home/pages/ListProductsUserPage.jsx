import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

//Hooks
import useNoticeModal from '../../shared/hooks/useNoticeModal';
import useSearchState from '../../shared/hooks/useSearchState';
import { useCart } from '../../cart/hooks/useCart';

// Components
import Card from '../../shared/components/Card';
import MobileSideMenu from '../../shared/components/MobileSideMenu';
import UserHeaderMenu from '../../shared/components/UserHeaderMenu';
import LoginModal from '../../auth/components/LoginModal';
import RegisterModal from '../../auth/components/RegisterModal';
import NoticeModal from '../../shared/components/NoticeModal';
import Pagination from '../../shared/components/Pagination';
import ProductCard from '../../products/components/ProductCard';
import { useClientProductsList } from '../hooks/useClientProductsList';

//Helpers

function ListProductsUserPage() {
  const defaultProductImage =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXp7vG6vsG3u77s8fTCxsnn7O/f5OfFyczP09bM0dO8wMPk6ezY3eDd4uXR1tnJzdBvAX/cAAACVElEQVR4nO3b23KDIBRA0ShGU0n0//+2KmO94gWZ8Zxmr7fmwWEHJsJUHw8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwO1MHHdn+L3rIoK6eshsNJ8kTaJI07fERPOO1Nc1vgQm2oiBTWJ+d8+CqV1heplLzMRNonED+4mg7L6p591FC+133/xCRNCtd3nL9BlxWP++MOaXFdEXFjZ7r8D9l45C8y6aG0cWtP/SUGhs2d8dA/ZfGgrzYX+TVqcTNRRO9l+fS5eSYzQs85psUcuzk6igcLoHPz2J8gvzWaH/JLS+95RfOD8o1p5CU5R7l5LkfKEp0mQ1UX7hsVXqDpRrifILD/3S9CfmlUQFhQfuFu0STTyJ8gsP3PH7GVxN1FC4t2sbBy4TNRTu7LyHJbqaqKFw+/Q0ncFloo7CjRPwMnCWqKXQZ75El4nKC9dmcJaou9AXOE5UXbi+RGeJygrz8Uf+GewSn9uXuplnWDZJ7d8f24F/s6iq0LYf9olbS3Q8i5oKrRu4S9ybwaQ/aCkqtP3I28QDgeoK7TBya/aXqL5COx67PTCD2grtdOwH+pQV2r0a7YVBgZoKwwIVFQYG6ikMDVRTGByopjD8ATcKb0UhhRTe77sKs2DV7FKSjId18TUEBYVyLhUThWfILHTDqmI85/2RWWjcE/bhP6OD7maT3h20MHsA47JC3PsW0wcwLhv9t0OOPOIkCn21y2bXXwlyylxiYMPk1SuCSmpfK8bNQvIrpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwNX4BCbAju9/X67UAAAAASUVORK5CYII=';

  const navigate = useNavigate();
  const { isOpen, isClosing, message, open, close } = useNoticeModal();

  // PRODUCT STATE
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

  // CART
  const { cart, addToCart } = useCart();
  const [quantities, setQuantities] = useState({});
  const totalItems = cart.reduce((acc, p) => acc + p.quantity, 0);

  // MOBILE MENU
  const [openCartMenu, setOpenCartMenu] = useState(false);

  // MODALS
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);

  // OPEN MODALS FROM EVENTS
  useEffect(() => {
    const openLogin = () => setOpenLoginModal(true);
    const openRegister = () => setOpenRegisterModal(true);

    window.addEventListener('open-login', openLogin);
    window.addEventListener('open-register', openRegister);

    return () => {
      window.removeEventListener('open-login', openLogin);
      window.removeEventListener('open-register', openRegister);
    };
  }, []);

  // Sincronizar valores del hook con el estado local para paginación/otros efectos
  useEffect(() => {
    setTotal(fetchedTotal);
    setProducts(fetchedProducts);
  }, [fetchedTotal, fetchedProducts]);

  useEffect(() => {
    if (total > 0) {
      const tp = Math.max(1, Math.ceil(total / pageSize));

      if (pageNumber > tp) setPageNumber(1);

      if (pageNumber === 0) setPageNumber(1);
    }
  }, [total, pageSize, pageNumber]);

  const realTotalPages = Math.ceil((Number(total) || 0) / (Number(pageSize) || 1));
  const displayedPage = total === 0 ? 0 : pageNumber;
  const displayedTotalPages = total === 0 ? 0 : realTotalPages;
  const hasResults = !loading && total > 0;

  return (
    <div className="page-container">
      {/* HEADER REUTILIZABLE */}
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

      {/* MOBILE MENU REUTILIZABLE */}
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

      {/* PRODUCT LIST */}
      <div
        className="
        mt-4 flex flex-col gap-[3px]
        sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4
      "
      >
        {loading && (
          <span className="animate-pulse">Buscando productos...</span>
        )}

        {!loading && products.length === 0 && (
          <Card className="p-4 text-center text-gray-600">
            No hay productos para mostrar.
          </Card>
        )}

        {hasResults &&
          products.map((product) => {
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
          })
        }
      </div>

      {/* PAGINATION */}
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

      {/* MODALS */}
      <LoginModal
        isOpen={openLoginModal}
        onClose={() => setOpenLoginModal(false)}
      />

      <RegisterModal
        isOpen={openRegisterModal}
        onClose={() => setOpenRegisterModal(false)}
      />

      <NoticeModal
        variant="success"
        isOpen={isOpen}
        isClosing={isClosing}
        message={message}
        onClose={close}
      />

    </div>
  );
}

export default ListProductsUserPage;
