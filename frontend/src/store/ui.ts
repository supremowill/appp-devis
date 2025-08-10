import { create } from 'zustand';
import { Location, Place, RouteResponse, PriceEstimate, Ride } from '../types';

interface UIState {
  // Location state
  fromPlace: Place | null;
  toPlace: Place | null;
  fromLocation: Location | null;
  toLocation: Location | null;
  
  // Route state
  route: RouteResponse | null;
  priceEstimate: PriceEstimate | null;
  
  // Current ride
  currentRide: Ride | null;
  
  // Loading states
  isGeocodingFrom: boolean;
  isGeocodingTo: boolean;
  isLoadingRoute: boolean;
  isLoadingEstimate: boolean;
  isCreatingRide: boolean;
  
  // Actions
  setFromPlace: (place: Place | null) => void;
  setToPlace: (place: Place | null) => void;
  setRoute: (route: RouteResponse | null) => void;
  setPriceEstimate: (estimate: PriceEstimate | null) => void;
  setCurrentRide: (ride: Ride | null) => void;
  setIsGeocodingFrom: (loading: boolean) => void;
  setIsGeocodingTo: (loading: boolean) => void;
  setIsLoadingRoute: (loading: boolean) => void;
  setIsLoadingEstimate: (loading: boolean) => void;
  setIsCreatingRide: (loading: boolean) => void;
  reset: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  fromPlace: null,
  toPlace: null,
  fromLocation: null,
  toLocation: null,
  route: null,
  priceEstimate: null,
  currentRide: null,
  isGeocodingFrom: false,
  isGeocodingTo: false,
  isLoadingRoute: false,
  isLoadingEstimate: false,
  isCreatingRide: false,
  
  // Actions
  setFromPlace: (place) => set((state) => ({
    fromPlace: place,
    fromLocation: place ? { lng: place.center[0], lat: place.center[1] } : null,
  })),
  
  setToPlace: (place) => set((state) => ({
    toPlace: place,
    toLocation: place ? { lng: place.center[0], lat: place.center[1] } : null,
  })),
  
  setRoute: (route) => set({ route }),
  setPriceEstimate: (priceEstimate) => set({ priceEstimate }),
  setCurrentRide: (currentRide) => set({ currentRide }),
  setIsGeocodingFrom: (isGeocodingFrom) => set({ isGeocodingFrom }),
  setIsGeocodingTo: (isGeocodingTo) => set({ isGeocodingTo }),
  setIsLoadingRoute: (isLoadingRoute) => set({ isLoadingRoute }),
  setIsLoadingEstimate: (isLoadingEstimate) => set({ isLoadingEstimate }),
  setIsCreatingRide: (isCreatingRide) => set({ isCreatingRide }),
  
  reset: () => set({
    fromPlace: null,
    toPlace: null,
    fromLocation: null,
    toLocation: null,
    route: null,
    priceEstimate: null,
    currentRide: null,
    isGeocodingFrom: false,
    isGeocodingTo: false,
    isLoadingRoute: false,
    isLoadingEstimate: false,
    isCreatingRide: false,
  }),
}));