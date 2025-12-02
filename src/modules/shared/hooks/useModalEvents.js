import { useEffect } from 'react';

export default function useModalEvents(setLoginModal, setRegisterModal) {
  useEffect(() => {
    const openLogin = () => setLoginModal(true);
    const openRegister = () => setRegisterModal(true);

    window.addEventListener('open-login', openLogin);
    window.addEventListener('open-register', openRegister);

    return () => {
      window.removeEventListener('open-login', openLogin);
      window.removeEventListener('open-register', openRegister);
    };
  }, [setLoginModal, setRegisterModal]);
}
