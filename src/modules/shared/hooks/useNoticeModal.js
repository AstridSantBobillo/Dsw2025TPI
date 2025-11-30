import { useState, useEffect } from "react";

export default function useNoticeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [message, setMessage] = useState("");

  const open = (msg) => {
    setMessage(msg || "");
    setIsOpen(true);
    setIsClosing(false);
  };

  const close = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setMessage("");
      setIsClosing(false);
    }, 300); // duración de fadeOut
  };

  // Cierra automáticamente a los 5s
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      close();
    }, 5000);

    return () => clearTimeout(timer);
  }, [isOpen]); // SIN .length

  return { isOpen, isClosing, message, open, close };
}
