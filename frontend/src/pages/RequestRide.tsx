import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../store/ui';
import { geocodeAddress } from '../api/geocode';
import { getRoute } from '../api/route';
import { estimatePrice } from '../api/rides';
import { createRide } from '../api/rides';
import Button from '../components/Button';
import Input from '../components/Input';
import Chip from '../components/Chip';
import MapView from '../components/MapView';
import Header from '../components/Header';
import { formatDistance, formatDuration, formatPrice } from '../utils/format';
import { Place } from '../types';

export default function RequestRide() {
  const navigate = useNavigate();
  const {
    fromPlace,
    toPlace,
    fromLocation,
    toLocation,
    route,
    priceEstimate,
    isGeocodingFrom,
    isGeocodingTo,
    isLoadingRoute,
    isLoadingEstimate,
    isCreatingRide,
    setFromPlace,
    setToPlace,
    setRoute,
    setPriceEstimate,
    setCurrentRide,
    setIsGeocodingFrom,
    setIsGeocodingTo,
    setIsLoadingRoute,
    setIsLoadingEstimate,
    setIsCreatingRide,
  } = useUIStore();

  const [fromInput, setFromInput] = useState('');
  const [toInput, setToInput] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState<Place[]>([]);
  const [toSuggestions, setToSuggestions] = useState<Place[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  // Debounced geocoding
  const debounceGeocoding = useCallback((
    query: string,
    isFrom: boolean,
    callback: (suggestions: Place[]) => void
  ) => {
    const timeoutId = setTimeout(async () => {
      if (query.length < 3) {
        callback([]);
        return;
      }

      try {
        if (isFrom) setIsGeocodingFrom(true);
        else setIsGeocodingTo(true);

        const response = await geocodeAddress(query);
        callback(response.features || []);
      } catch (error) {
        console.error('Geocoding error:', error);
        callback([]);
      } finally {
        if (isFrom) setIsGeocodingFrom(false);
        else setIsGeocodingTo(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [setIsGeocodingFrom, setIsGeocodingTo]);

  // Handle from input change
  useEffect(() => {
    const cleanup = debounceGeocoding(fromInput, true, (suggestions) => {
      setFromSuggestions(suggestions);
      setShowFromSuggestions(suggestions.length > 0);
    });
    return cleanup;
  }, [fromInput, debounceGeocoding]);

  // Handle to input change
  useEffect(() => {
    const cleanup = debounceGeocoding(toInput, false, (suggestions) => {
      setToSuggestions(suggestions);
      setShowToSuggestions(suggestions.length > 0);
    });
    return cleanup;
  }, [toInput, debounceGeocoding]);

  // Get route when both locations are set
  useEffect(() => {
    if (fromLocation && toLocation) {
      handleGetRoute();
    }
  }, [fromLocation, toLocation]);

  // Get price estimate when route is available
  useEffect(() => {
    if (route) {
      handleGetEstimate();
    }
  }, [route]);

  const handleGetRoute = async () => {
    if (!fromLocation || !toLocation) return;

    try {
      setIsLoadingRoute(true);
      const routeData = await getRoute(fromLocation, toLocation);
      setRoute(routeData);
    } catch (error) {
      console.error('Route error:', error);
      // Handle error - maybe show a toast
    } finally {
      setIsLoadingRoute(false);
    }
  };

  const handleGetEstimate = async () => {
    if (!route) return;

    try {
      setIsLoadingEstimate(true);
      const estimate = await estimatePrice(route.distance, route.duration);
      setPriceEstimate(estimate);
    } catch (error) {
      console.error('Estimate error:', error);
      // Handle error
    } finally {
      setIsLoadingEstimate(false);
    }
  };

  const handleSelectFromPlace = (place: Place) => {
    setFromPlace(place);
    setFromInput(place.place_name);
    setShowFromSuggestions(false);
  };

  const handleSelectToPlace = (place: Place) => {
    setToPlace(place);
    setToInput(place.place_name);
    setShowToSuggestions(false);
  };

  const handlePickMe = async () => {
    if (!fromLocation || !toLocation) return;

    try {
      setIsCreatingRide(true);
      const ride = await createRide(fromLocation, toLocation);
      setCurrentRide(ride);
      navigate('/rate', { state: { rideId: ride.id, driverId: ride.driver?.id } });
    } catch (error) {
      console.error('Create ride error:', error);
      // Handle error
    } finally {
      setIsCreatingRide(false);
    }
  };

  const suggestedPlaces = ['Shopping Center', 'Aeroporto', 'Rodoviária'];

  return (
    <div className="h-full flex flex-col">
      <Header 
        showBack 
        onBack={() => navigate('/')}
      />
      
      {/* Map */}
      <div className="flex-1 relative">
        <MapView
          fromLocation={fromLocation}
          toLocation={toLocation}
          route={route?.geometry}
          className="absolute inset-0"
        />
        
        {/* Form Overlay */}
        <div className="absolute top-4 left-4 right-4">
          <div className="bg-primary rounded-2xl p-4 shadow-xl">
            {/* From Input */}
            <div className="relative mb-3">
              <Input
                placeholder="From"
                value={fromInput}
                onChange={(e) => setFromInput(e.target.value)}
                className="bg-white text-text-primary placeholder-text-secondary"
              />
              {isGeocodingFrom && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              
              {/* From Suggestions */}
              {showFromSuggestions && fromSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg max-h-48 overflow-y-auto z-10">
                  {fromSuggestions.map((place, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectFromPlace(place)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl"
                    >
                      <div className="text-sm text-text-primary">{place.place_name}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* To Input */}
            <div className="relative mb-4">
              <Input
                placeholder="To"
                value={toInput}
                onChange={(e) => setToInput(e.target.value)}
                className="bg-white text-text-primary placeholder-text-secondary"
              />
              {isGeocodingTo && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              
              {/* To Suggestions */}
              {showToSuggestions && toSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg max-h-48 overflow-y-auto z-10">
                  {toSuggestions.map((place, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectToPlace(place)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl"
                    >
                      <div className="text-sm text-text-primary">{place.place_name}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Route Info */}
            {route && (
              <div className="bg-white bg-opacity-20 rounded-xl p-3 mb-4 text-white">
                <div className="flex justify-between items-center text-sm">
                  <span>ESTIMATED RANGE</span>
                  <button className="text-white hover:text-secondary">×</button>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-lg font-semibold">
                    {formatDistance(route.distance)} • {formatDuration(route.duration)}
                  </span>
                  {priceEstimate && (
                    <span className="text-lg font-semibold text-secondary">
                      {formatPrice(priceEstimate.price, priceEstimate.currency)}
                    </span>
                  )}
                </div>
              </div>
            )}
            
            {/* Suggested Places */}
            <div className="flex space-x-2 mb-4">
              {suggestedPlaces.map((place, index) => (
                <Chip
                  key={index}
                  label={String.fromCharCode(65 + index)} // A, B, C
                  onClick={() => {
                    // Handle suggested place selection
                    setToInput(place);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Action */}
      <div className="p-4 bg-white border-t border-gray-100">
        <Button
          size="lg"
          onClick={handlePickMe}
          disabled={!fromLocation || !toLocation || isCreatingRide}
          loading={isCreatingRide}
          className="w-full"
        >
          PICK ME
        </Button>
        
        {isLoadingRoute && (
          <p className="text-center text-sm text-text-secondary mt-2">
            Calculando rota...
          </p>
        )}
        
        {isLoadingEstimate && (
          <p className="text-center text-sm text-text-secondary mt-2">
            Calculando preço...
          </p>
        )}
      </div>
    </div>
  );
}