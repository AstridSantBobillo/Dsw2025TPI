// Components
import Button from './Button';
import SearchBar from './SearchBar';

// Hooks
import useAuth from '../../auth/hook/useAuth';

export default function UserHeaderMenu({
  search = null,
  totalItems = 0,
  onGoCart,
  onGoProducts,
  onOpenLogin,
  onOpenRegister,
  onOpenMobileMenu,
}) {
  const { isAuthenticated, user, singout } = useAuth();
  const displayName = user?.username || 'Usuario';

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center gap-3 bg-white p-2 rounded-lg shadow animate-slideDown">

        {/* IZQUIERDA - ÍCONO HOGAR MOBILE + NAVEGACIÓN DESKTOP */}
        <div className="flex items-center gap-2">
          {/* ÍCONO HOGAR - SOLO MOBILE */}
          <Button
            onClick={onGoProducts}
            className="sm:hidden h-10 w-10 p-0 flex items-center justify-center text-xl"
          >
            🏠
          </Button>

          {/* BOTONES DESKTOP */}
          <div className="hidden sm:flex items-center gap-2">
            {onGoProducts && (
              <Button onClick={onGoProducts} className="px-3 py-2 text-sm">
                Productos
              </Button>
            )}

            {onGoCart && (
              <Button onClick={onGoCart} className="px-3 py-2 text-sm">
                Carrito ({totalItems})
              </Button>
            )}
          </div>
        </div>

        {/* CENTRO - SEARCH (MOBILE Y DESKTOP) */}
        <div className="flex-1 flex">
          {search && (
            <SearchBar
              value={search.value}
              onChange={search.onChange}
              onSearch={search.onSearch}
            />
          )}
        </div>

        {/* DERECHA - OPCIONES DE AUTENTICACIÓN DESKTOP + MENÚ MOBILE */}
        <div className="flex items-center gap-2">
          {/* BOTONES AUTH DESKTOP */}
          <div className="hidden sm:flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Button onClick={onOpenLogin} className="px-3 py-2 text-xs sm:text-sm">Iniciar Sesión</Button>
                <Button onClick={onOpenRegister} className="px-3 py-2 text-xs sm:text-sm">Registrarse</Button>
              </>
            ) : (
              <>
                <Button onClick={singout} className="px-3 py-2 text-sm">Cerrar sesión</Button>

                {/* Nombre + Avatar */}
                <div className="flex items-center gap-2 text-xs font-medium">
                  <img
                    src="https://cdn-icons-png.freepik.com/512/12225/12225935.png"
                    alt='avatar'
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{displayName}</span>
                </div>
              </>
            )}
          </div>

          {/* BOTÓN MOBILE MENU */}
          <Button
            className="sm:hidden h-10 w-10 p-0 flex items-center justify-center text-xl"
            onClick={onOpenMobileMenu}
          >
            ≡
          </Button>
        </div>

      </div>
    </div>
  );
}
