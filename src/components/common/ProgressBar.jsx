export const ProgressBar = ({ progress, className = '', showLabel = true, animated = true }) => {
  const percentage = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        {showLabel && (
          <span className="text-sm font-medium text-gray-700">{percentage.toFixed(0)}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 ${animated ? 'animate-progress' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
