export default function NoticeModal({ isOpen, isClosing, message, onClose }) {
  if (!isOpen && !isClosing) return null;

  return (
    <div className="fixed inset-0 flex items-end justify-end p-4 z-50 pointer-events-none">
      <div
        className={`
          pointer-events-auto bg-white shadow-xl rounded-lg border p-4 w-64
          transition-all duration-300
          ${isClosing ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'}
        `}
      >
        <div className="flex justify-between items-start">
          <p className="text-gray-800 text-sm">{message}</p>

          <button
            onClick={onClose}
            className="text-gray-500 font-bold ml-3 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
