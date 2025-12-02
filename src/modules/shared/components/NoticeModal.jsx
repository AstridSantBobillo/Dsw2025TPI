import Button from './Button';

const variantStyles = {
  error: {
    container: 'bg-red-50 border-red-200 text-red-800',
  },
  success: {
    container: 'bg-green-50 border-green-200 text-green-800',
  },
  flag: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  },
};

export default function NoticeModal({ isOpen, isClosing, message, onClose, variant = 'flag' }) {
  if (!isOpen && !isClosing) return null;

  const styles = variantStyles[variant] || variantStyles.flag;

  return (
    <div className="fixed inset-0 flex items-end justify-end p-4 z-50 pointer-events-none">
      <div
        className={`
          pointer-events-auto
          ${styles.container}
          shadow-xl rounded-lg border p-5 w-80 sm:w-96
          transition-all duration-300
          ${isClosing ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'}
        `}
      >
        <div className="flex justify-between items-start gap-3">
          <p className="text-base font-medium leading-snug break-words">{message}</p>
          <Button
            type="button"
            onClick={onClose}
            className="bg-transparent hover:bg-black/5 text-current px-2 py-1"
          >
            ✕
          </Button>
        </div>
      </div>
    </div>
  );
}
