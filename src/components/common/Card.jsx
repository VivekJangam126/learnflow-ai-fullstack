export const Card = ({ children, className = '', onClick, hover = false }) => {
  return (
    <div 
      onClick={onClick}
      className={`card ${hover ? 'cursor-pointer hover:scale-[1.02]' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
