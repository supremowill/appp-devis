import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import FooterDots from '../components/FooterDots';
import MapView from '../components/MapView';

export default function Splash() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col">
      {/* Map Background */}
      <div className="flex-1 relative">
        <MapView className="absolute inset-0" />
        
        {/* Overlay Content */}
        <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col items-center justify-center">
          {/* Taxi Icon */}
          <div className="mb-8">
            <div className="relative">
              {/* Signal waves */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="w-16 h-8 border-4 border-primary rounded-t-full opacity-60 animate-pulse"></div>
                <div className="w-12 h-6 border-4 border-primary rounded-t-full opacity-80 animate-pulse delay-150 absolute top-2 left-1/2 transform -translate-x-1/2"></div>
                <div className="w-8 h-4 border-4 border-primary rounded-t-full animate-pulse delay-300 absolute top-4 left-1/2 transform -translate-x-1/2"></div>
              </div>
              
              {/* Pin */}
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-2xl">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                  </svg>
                </div>
              </div>
              
              {/* Pin tail */}
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-primary absolute top-full left-1/2 transform -translate-x-1/2"></div>
            </div>
          </div>
          
          {/* App Name */}
          <h1 className="text-4xl font-bold text-primary mb-2 text-center">
            TAXI NAME
          </h1>
          
          {/* CTA Button */}
          <div className="mt-8">
            <Button
              size="lg"
              onClick={() => navigate('/ride')}
              className="px-12"
            >
              Buscar Corrida
            </Button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <FooterDots 
        centerText="DEVELOPED BY"
        onLeftClick={() => console.log('Menu clicked')}
        onRightClick={() => console.log('Account clicked')}
      />
    </div>
  );
}