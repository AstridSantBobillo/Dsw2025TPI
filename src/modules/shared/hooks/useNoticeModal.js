import { useState, useEffect, useCallback } from 'react';

export default function useNoticeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [message, setMessage] = useState('');

  const open = useCallback((msg) => {
    setMessage(msg || '');
    setIsOpen(true);
    setIsClosing(false);
  }, []);

  const close = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setMessage('');
      setIsClosing(false);
    }, 300);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      close();
    }, 5000);

    return () => clearTimeout(timer);
  }, [isOpen, close]);

  return { isOpen, isClosing, message, open, close };
}
