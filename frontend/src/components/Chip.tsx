interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export default function Chip({ label, active = false, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
        ${active 
          ? 'bg-secondary text-text-primary shadow-md' 
          : 'bg-white text-text-secondary border border-gray-200 hover:border-primary hover:text-primary'
        }
      `}
    >
      {label}
    </button>
  );
}