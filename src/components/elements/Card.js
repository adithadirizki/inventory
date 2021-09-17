const Card = ({ children, className }) => {
  return (
    <div
      className={`bg-white shadow-sm rounded-lg border border-gray-100 p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
