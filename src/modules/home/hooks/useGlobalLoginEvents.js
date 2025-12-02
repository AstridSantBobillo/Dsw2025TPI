import { useEffect } from 'react';

export function useGlobalLoginEvents({ onLoginOpen, onRegisterOpen }) {
  useEffect(() => {
    const openLogin = () => onLoginOpen();
    const openRegister = () => onRegisterOpen();

    window.addEventListener('open-login', openLogin);
    window.addEventListener('open-register', openRegister);

    return () => {
      window.removeEventListener('open-login', openLogin);
      window.removeEventListener('open-register', openRegister);
    };
  }, [onLoginOpen, onRegisterOpen]);
}