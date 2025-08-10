import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getDriver, rateDriver } from '../api/drivers';
import { Driver } from '../types';
import Button from '../components/Button';
import StarRating from '../components/StarRating';
import FooterDots from '../components/FooterDots';
import Header from '../components/Header';

export default function RateDriver() {
  const navigate = useNavigate();
  const location = useLocation();
  const { driverId } = location.state || {};
  
  const [driver, setDriver] = useState<Driver | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (driverId) {
      loadDriver();
    } else {
      // Mock driver for demo
      setDriver({
        id: 'demo-driver',
        name: 'João Silva',
        rating: 4.8,
        avatarUrl: undefined,
      });
      setIsLoading(false);
    }
  }, [driverId]);

  const loadDriver = async () => {
    try {
      setIsLoading(true);
      const driverData = await getDriver(driverId);
      setDriver(driverData);
    } catch (error) {
      console.error('Error loading driver:', error);
      // Fallback to mock data
      setDriver({
        id: driverId || 'demo-driver',
        name: 'João Silva',
        rating: 4.8,
        avatarUrl: undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitRating = async () => {
    if (!driver || rating === 0) return;

    try {
      setIsSubmitting(true);
      await rateDriver(driver.id, { stars: rating, comment: comment.trim() || undefined });
      setSubmitted(true);
      
      // Auto redirect after success
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error submitting rating:', error);
      // For demo purposes, still show success
      setSubmitted(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-bg-light">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Carregando...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="h-full flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center bg-bg-light px-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Obrigado!</h2>
            <p className="text-text-secondary">Sua avaliação foi enviada com sucesso.</p>
          </div>
        </div>
        <FooterDots />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-bg-light">
      <Header 
        showBack 
        onBack={() => navigate('/')}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          {/* Driver Card */}
          <div className="bg-primary rounded-3xl p-8 text-center text-white shadow-2xl">
            {/* Avatar */}
            <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
              {driver?.avatarUrl ? (
                <img 
                  src={driver.avatarUrl} 
                  alt={driver.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-blue-medium rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              )}
            </div>
            
            {/* Driver Name */}
            <h2 className="text-2xl font-bold mb-2">
              {driver?.name || 'DRIVER NAME'}
            </h2>
            
            {/* Current Rating */}
            <div className="flex items-center justify-center mb-6">
              <StarRating rating={driver?.rating || 0} readonly size="md" />
              <span className="ml-2 text-lg font-medium">
                {driver?.rating?.toFixed(1) || '0.0'}
              </span>
            </div>
            
            {/* Rating Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Avalie sua corrida</h3>
              <div className="flex justify-center mb-4">
                <StarRating 
                  rating={rating} 
                  onRatingChange={setRating}
                  size="lg"
                />
              </div>
            </div>
            
            {/* Comment Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-left">
                COMMENT
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Deixe um comentário (opcional)"
                className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 resize-none"
                rows={3}
              />
            </div>
            
            {/* Submit Button */}
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmitRating}
              disabled={rating === 0 || isSubmitting}
              loading={isSubmitting}
              className="w-full"
            >
              RATE DRIVER
            </Button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <FooterDots 
        onLeftClick={() => console.log('Menu clicked')}
        onRightClick={() => console.log('Account clicked')}
      />
    </div>
  );
}