function Card({ children, className }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm p-2 overflow-hidden flex flex-col animate-fadeIn hover:shadow-md transition-shadow duration-200 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
