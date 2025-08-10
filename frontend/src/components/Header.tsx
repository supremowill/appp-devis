import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightContent?: React.ReactNode;
}

export default function Header({ title, showBack = false, onBack, rightContent }: HeaderProps) {
  return (
    <div className="bg-white shadow-sm border-b border-gray-100 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        {showBack && (
          <button
            onClick={onBack}
            className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-text-primary" />
          </button>
        )}
        {title && (
          <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
        )}
      </div>
      {rightContent && (
        <div>{rightContent}</div>
      )}
    </div>
  );
}