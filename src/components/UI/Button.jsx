const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95';
  
  const variants = {
    primary: 'bg-logistics-blue text-white hover:bg-blue-700 shadow-lg hover:shadow-xl',
    secondary: 'bg-logistics-orange text-white hover:bg-orange-600 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-logistics-blue text-logistics-blue hover:bg-logistics-blue hover:text-white',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
