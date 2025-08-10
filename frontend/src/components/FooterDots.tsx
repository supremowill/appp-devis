interface FooterDotsProps {
  leftText?: string;
  rightText?: string;
  centerText?: string;
  onLeftClick?: () => void;
  onRightClick?: () => void;
}

export default function FooterDots({ 
  leftText = "MENU", 
  rightText = "ACCOUNT",
  centerText = "DEVELOPED BY",
  onLeftClick,
  onRightClick 
}: FooterDotsProps) {
  return (
    <div className="bg-primary text-white py-4 px-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={onLeftClick}
          className="text-sm font-medium hover:text-secondary transition-colors"
        >
          {leftText}
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-secondary rounded-full"></div>
          <div className="w-2 h-2 bg-secondary rounded-full"></div>
          <div className="w-2 h-2 bg-secondary rounded-full"></div>
          {centerText && (
            <span className="text-xs text-gray-300 ml-2">{centerText}</span>
          )}
        </div>
        
        <button 
          onClick={onRightClick}
          className="text-sm font-medium hover:text-secondary transition-colors"
        >
          {rightText}
        </button>
      </div>
    </div>
  );
}