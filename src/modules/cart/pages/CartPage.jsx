import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Hooks
import useAuth from '../../auth/hook/useAuth';
import { useCart } from '../hooks/useCart';
import { useDeleteQuantity } from '../../shared/hooks/useDeleteQuantity';
import { useToggleMap } from '../../shared/hooks/useToggleMap';
import useNoticeModal from '../../shared/hooks/useNoticeModal';
import useSearchState from '../../shared/hooks/useSearchState';

// Components
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import UserHeaderMenu from '../../shared/components/UserHeaderMenu';
import MobileSideMenu from '../../shared/components/MobileSideMenu';
import LoginModal from '../../auth/components/LoginModal';
import RegisterModal from '../../auth/components/RegisterModal';
import NoticeModal from '../../shared/components/NoticeModal';
import CartCard from '../components/CartCard';

// Services
import { createOrder } from '../../orders/services/createOrder';

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const { inputValue, searchTerm, setInputValue, commit, clear } = useSearchState('');
  const { get, increment, decrement, reset } = useDeleteQuantity();
  const { isOpen, isClosing, message, open : openNotification } = useNoticeModal();

  const {
    state: modals,
    open,
    close,
  } = useToggleMap({
    cartMenu: false,
    loginModal: false,
    registerModal: false,
  });

  const totalItems = cart.reduce((acc, p) => acc + p.quantity, 0);

  const totalAmount = cart.reduce((acc, p) => acc + p.quantity * p.currentUnitPrice, 0);

  useEffect(() => {
    const openLogin = () => open('loginModal');
    const openRegister = () => open('registerModal');

    window.addEventListener('open-login', openLogin);
    window.addEventListener('open-register', openRegister);

    return () => {
      window.removeEventListener('open-login', openLogin);
      window.removeEventListener('open-register', openRegister);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendOrder = async () => {
    if (!user) {
      open('loginModal');

      return;
    }

    try {
      const orderData = {
        customerId: user.customerId,
        shippingAddress: 'Sin especificar',
        billingAddress: 'Sin especificar',
        notes: '',
        orderItems: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      const { error } = await createOrder(orderData);

      if (error) throw error;

      clearCart();
      navigate('/');
    } catch (err) {
      console.error(err);
      openNotification('Error al procesar la orden.');
    }
  };

  const handleCheckout = () => sendOrder();

  const handleLoginSuccess = () => {
    close('loginModal');
    sendOrder();
  };

  if (cart.length === 0) {
    return (
      <div className="page-container flex flex-col items-center justify-center text-center min-h-screen">
        <Card className="p-6 max-w-md shadow-lg">
          <h1 className="text-3xl font-semibold mb-4">Carrito vacío</h1>
          <p className="text-gray-600 mb-6 text-lg">
            Parece que todavía no agregaste productos.
          </p>
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            className="w-32 mx-auto opacity-80 mb-6"
          />
          <Button className="w-full text-lg py-2" onClick={() => navigate('/')}>
            Ver productos
          </Button>
        </Card>
      </div>
    );
  }

  const filteredCart = cart.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="page-container pb-40 sm:pb-0">
      {/* Header */}
      <UserHeaderMenu
        title="Carrito"
        search={{
          value: inputValue,
          onChange: (e) => {
            const v = e.target.value;

            setInputValue(v);

            if (v.trim() === '') {
              clear('');
            }
          },
          onSearch: () => {
            commit();
          },
        }}
        onGoProducts={() => navigate('/')}
        onGoHome={() => navigate('/')}
        onGoCart={null}
        onOpenLogin={() => open('loginModal')}
        onOpenRegister={() => open('registerModal')}
        onOpenMobileMenu={() => open('cartMenu')}
        totalItems={totalItems}
      />

      {/* Mobile menu */}
      <MobileSideMenu
        isOpen={modals.cartMenu}
        title="Menú"
        onClose={() => close('cartMenu')}
        onGoProducts={() => {
          close('cartMenu');
          navigate('/');
        }}
        onGoCart={null}
        totalItems={totalItems}
        onOpenLogin={() => {
          close('cartMenu');
          open('loginModal');
        }}
        onOpenRegister={() => {
          close('cartMenu');
          open('registerModal');
        }}
      />

      {/* Cart Items + Order Summary */}
      <div className="mt-4 flex flex-col sm:flex-row gap-[3px] sm:gap-4">
        {/* Cart items */}
        <div className="flex-1 flex flex-col gap-[3px] sm:gap-4">
          {filteredCart.length === 0 ? (
            <Card className="p-4 text-center text-gray-600">
              No hay productos en el carrito que coincidan con la búsqueda.
            </Card>
          ) : (
            filteredCart.map((item) => {
              return (
              // dentro del map(filteredCart)
                <CartCard
                  key={item.sku}
                  item={item}
                  delQty={get(item.sku)}                          // ← arranca en 1
                  onDecrease={() => decrement(item.sku)}         // no baja de 1
                  onIncrease={() => increment(item.sku, item.quantity)} // tope = quantity en carrito
                  onDelete={(qtyToDelete) => {                 // ⬅️ ahora recibe la cantidad
                    const remaining = item.quantity - qtyToDelete;

                    if (remaining <= 0) {
                      removeFromCart(item.sku);
                    } else {
                      updateQuantity(item.sku, remaining);
                    }

                    reset(item.sku, 1); // volver a 1 para la próxima
                    openNotification(`Se eliminó "${item.name}" del carrito.`);
                  }}
                />
              );
            })
          )}

        </div>

        {/* Order summary - MOBILE FIXED BOTTOM */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3">
          <div className="page-container">
            <div className="text-sm mb-3">
              <p className="text-gray-600">Cantidad de productos en total: <strong>{totalItems}</strong></p>
              <p className="text-lg font-semibold">Total a pagar: <strong>${totalAmount.toFixed(2)}</strong></p>
            </div>
            <Button
              className="w-full py-2 text-sm font-semibold"
              onClick={handleCheckout}
            >
              Finalizar Compra
            </Button>
          </div>
        </div>

        {/* Order summary - DESKTOP SIDEBAR */}
        <div className="hidden sm:block sm:w-72">
          <Card className="p-4 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Detalle del pedido</h2>
            <div className="space-y-2 mb-4">
              <p className="text-sm">Cantidad de en total: <strong>{totalItems}</strong></p>
              <p className="text-lg font-semibold">Total a pagar: <strong>${totalAmount.toFixed(2)}</strong></p>
            </div>

            <Button
              className="w-full py-2 text-sm font-semibold"
              onClick={handleCheckout}
            >
              Finalizar Compra
            </Button>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <LoginModal
        isOpen={modals.loginModal}
        onClose={() => close('loginModal')}
        onSuccess={handleLoginSuccess}
      />
      <RegisterModal
        isOpen={modals.registerModal}
        onClose={() => close('registerModal')}
      />

      <NoticeModal isOpen={isOpen} isClosing={isClosing} message={message} onClose={close} />

    </div>
  );
}

export default CartPage;
