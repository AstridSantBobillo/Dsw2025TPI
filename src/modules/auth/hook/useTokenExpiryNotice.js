import { useEffect, useRef } from 'react';
import useNoticeModal from '../../shared/hooks/useNoticeModal';

const TEN_MIN_MS = 10 * 60 * 1000;
const WARNINGS_MINUTES = [5, 7, 9];

export default function useTokenExpiryNotice() {
  const notice = useNoticeModal();
  const timersRef = useRef([]);

  const clearTokenTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const scheduleToken = ({ issuedAtMs, onExpire }) => {
    if (!issuedAtMs) return;

    clearTokenTimers();
    const now = Date.now();
    const expiry = issuedAtMs + TEN_MIN_MS;

    const schedule = (ts, fn) => {
      const delay = ts - now;

      if (delay <= 0) {
        fn();

        return;
      }

      timersRef.current.push(setTimeout(fn, delay));
    };

    WARNINGS_MINUTES.forEach((m) => {
      const at = issuedAtMs + m * 60 * 1000;

      schedule(at, () => {
        const remainingMs = expiry - at;
        const remainingMin = Math.max(0, Math.ceil(remainingMs / 60000));

        notice.open(`Tu sesion expira en aproximadamente ${remainingMin} minutos. Guarda tu trabajo o vuelve a iniciar sesion.`);
      });
    });

    schedule(expiry, () => onExpire?.());
  };

  useEffect(() => () => clearTokenTimers(), []);

  return {
    notice,
    scheduleToken,
    clearTokenTimers,
  };
}
