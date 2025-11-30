function Button({ children, type = 'button', variant = 'default', ...restProps }) {
  if (!['button', 'reset', 'submit'].includes(type)) {
    console.warn('type prop not supported');
  }

  const variantStyle = {
    default: 'bg-purple-200 hover:bg-purple-300 transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95',
    secondary: 'bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95',
  };

  return (
    <button
      {...restProps}
      className={`${variantStyle[variant]} ${restProps.className}`}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
