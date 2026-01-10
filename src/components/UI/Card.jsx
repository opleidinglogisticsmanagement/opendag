const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
