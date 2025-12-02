import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

// Hooks
import useAuth from '../../auth/hook/useAuth';

// Components
import Button from '../../shared/components/Button';

function Dashboard() {
  const [openMenu, setOpenMenu] = useState(false);

  const navigate = useNavigate();

  const { singout } = useAuth();

  const logout = () => {
    singout();
    navigate('/login');
  };

  const getLinkStyles = ({ isActive }) => (
    `
      w-full block
      pl-4 pr-3 py-3
      text-base
      rounded-xl
      transition
      hover:bg-gray-100 active:bg-gray-200
      ${isActive ? 'bg-purple-200 hover:bg-purple-100' : ''}
    `
  );

  const renderLogoutButton = (mobile = false) => (
    <Button className={`${mobile ? 'block w-full sm:hidden' :  'hidden sm:block mr-[1%] px-3 py-1' }`} onClick={logout}>Cerrar sesión</Button>
  );

  return (
    <div
      className="
        h-full
        grid
        grid-cols-1
        grid-rows-[auto_1fr]
        sm:gap-3
        sm:grid-cols-[256px_1fr]
        sm:rounded-lg
        sm:overflow-hidden
      "
    >
      <header
        className="
          flex
          items-center
          justify-between
          p-4
          m-2
          shadow
          rounded
          bg-white
          sm:col-span-2
        "
      >
        <span className='ml-[2%]'>Mi Dashboard</span>
        {renderLogoutButton()}
        <Button
          className="sm:hidden h-15 w-15 p-0"
          onClick={() => setOpenMenu(!openMenu)}
        >
          { openMenu ? <span className='text-3xl'>&#215;</span> : <span className='text-3xl'>&#9776;</span>}
        </Button>
      </header>
      <aside
        className={`
          absolute
          top-0
          bottom-0
          bg-white
          w-64
          p-6
          ${openMenu ? 'left-0' : 'left-[-256px]'}
          rounded
          shadow
          flex
          flex-col
          justify-between
          animate-slideRight
          transition-left
          duration-300
          z-50
          sm:relative
          sm:left-0
        `}
      >
        <nav>
          <ul
            className='flex flex-col'
          >
            <li>
              <NavLink
                to='/admin/home'
                className={getLinkStyles}
              >Principal</NavLink>
            </li>
            <li>
              <NavLink
                to='/admin/products'
                className={getLinkStyles}
              >Productos</NavLink>
            </li>
            <li>
              <NavLink
                to='/admin/orders'
                className={getLinkStyles}
              >Ordenes</NavLink>
            </li>
          </ul>
          <hr className='opacity-15 mt-4' />
        </nav>
        {renderLogoutButton(true)}
      </aside>
      <main
        className="
          p-5
          overflow-y-scroll
        "
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
