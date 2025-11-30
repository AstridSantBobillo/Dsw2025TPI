export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/40 backdrop-blur-sm
        px-4
        animate-fadeIn
      "
      onClick={onClose}
    >
      <div
        className="
          relative
          w-full max-w-md
          bg-white
          p-4
          rounded-lg
          shadow-2xl
          animate-slideUp
          origin-top
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Boton de cerrar */}
        <button
          onClick={onClose}
          className="
            absolute top-2 right-2
            h-8 w-8
            flex items-center justify-center
            rounded-full
            text-lg
            hover:bg-gray-100
            transition-all duration-200
            hover:scale-110
            active:scale-95
          "
        >
          X
        </button>

        {children}
      </div>
    </div>
  );
}
