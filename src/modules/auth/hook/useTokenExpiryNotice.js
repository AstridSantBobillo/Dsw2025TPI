// hooks/useTokenExpiryNotice.js
import { useEffect, useRef } from 'react';
import useNoticeModal from '../../shared/hooks/useNoticeModal';

// Duración total del token: 10 minutos
const TOKEN_DURATION_MS = 10 * 60 * 1000;

// Minutos en los que se avisará al usuario
const WARNING_MINUTES = [5, 7, 9];

export default function useTokenExpiryNotice() {
  const notice = useNoticeModal();
  const timersRef = useRef([]);

  // Borra todos los timers antiguos
  const clearAllTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  // Programa el token y sus avisos
  const scheduleToken = ({ issuedAtMs, onExpire }) => {
    if (!issuedAtMs) return;

    clearAllTimers();

    const now = Date.now();
    const expiryAt = issuedAtMs + TOKEN_DURATION_MS;

    // 1) Programar avisos previos
    WARNING_MINUTES.forEach((min) => {
      const warnAt = issuedAtMs + min * 60 * 1000;
      const delay = warnAt - now;

      if (delay > 0) {
        const id = setTimeout(() => {
          const remainingMinutes = Math.ceil((expiryAt - warnAt) / 60000);

          notice.open(
            `Tu sesión expira en aproximadamente ${remainingMinutes} minutos.`,
          );
        }, delay);

        timersRef.current.push(id);
      }
    });

    // 2) Programar expiración final
    const expiryDelay = expiryAt - now;

    if (expiryDelay > 0) {
      const id = setTimeout(() => {
        onExpire?.();
      }, expiryDelay);

      timersRef.current.push(id);
    }
  };

  // Limpiar timers al desmontar el hook
  useEffect(() => clearAllTimers, []);

  return {
    notice,
    scheduleToken,
    clearAllTimers,
  };
}
