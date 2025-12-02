function Button({ children, type = 'button', variant = 'default', ...restProps }) {
  if (!['button', 'reset', 'submit'].includes(type)) {
    console.warn('type prop not supported');
  }

  const { className = '', ...buttonProps } = restProps;

  const variantStyle = {
    default: 'bg-purple-200 hover:bg-purple-300 transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95 text-base sm:text-lg font-medium',
    secondary: 'bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95 text-base sm:text-lg font-medium',
  };

  return (
    <button
      {...buttonProps}
      className={`${variantStyle[variant]} ${className}`}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
