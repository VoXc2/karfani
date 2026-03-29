'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTranslations } from 'next-intl';
import {
  Search, Layers, Navigation2, ZoomIn, ZoomOut,
  X, MapPin, Star, Users, Filter, ChevronDown,
  Compass, Maximize2, Minimize2, Route,
} from 'lucide-react';
import MapPopupCard from './MapPopupCard';

// Mapbox public token - in production this should be in env
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1Ijoia2FyZmFuaSIsImEiOiJjbTl6OHQ2YnUwMWRjMnFyMHNlNm9sdjRwIn0.placeholder';

interface MapLocation {
  id: string;
  type: 'caravan' | 'campsite' | 'route' | 'hub';
  title: string;
  subtitle: string;
  lat: number;
  lng: number;
  price?: number;
  rating?: number;
  reviews?: number;
  image: string;
  sleeps?: number;
  amenities?: string[];
  difficulty?: string;
}

// Saudi Arabia regions with coordinates for the category chips
const regions = [
  { id: 'all', name: 'الكل', lat: 24.0, lng: 45.0, zoom: 5.5 },
  { id: 'riyadh', name: 'الرياض', lat: 24.7136, lng: 46.6753, zoom: 10 },
  { id: 'jeddah', name: 'جدة', lat: 21.4858, lng: 39.1925, zoom: 10 },
  { id: 'alula', name: 'العلا', lat: 26.6175, lng: 37.9185, zoom: 10 },
  { id: 'aseer', name: 'عسير', lat: 18.2578, lng: 42.3667, zoom: 9 },
  { id: 'tabuk', name: 'تبوك', lat: 28.3838, lng: 36.5550, zoom: 9 },
  { id: 'amlaj', name: 'أملج', lat: 25.0452, lng: 37.2654, zoom: 11 },
  { id: 'albaha', name: 'الباحة', lat: 20.0, lng: 41.4686, zoom: 10 },
  { id: 'hail', name: 'حائل', lat: 27.5114, lng: 41.7208, zoom: 10 },
];

// Mock map locations - in production fetched from API
const mockLocations: MapLocation[] = [
  { id: '1', type: 'caravan', title: 'كرفان عائلي فاخر', subtitle: 'الرياض', lat: 24.7136, lng: 46.6753, price: 1200, rating: 4.8, reviews: 124, image: '🏕️', sleeps: 6, amenities: ['wifi', 'ac', 'power'] },
  { id: '2', type: 'caravan', title: 'فان مغامرات الصحراء', subtitle: 'العلا', lat: 26.6175, lng: 37.9185, price: 700, rating: 4.9, reviews: 89, image: '🚐', sleeps: 2 },
  { id: '3', type: 'caravan', title: 'كرفان رحلات طويلة', subtitle: 'عسير', lat: 18.2578, lng: 42.3667, price: 950, rating: 4.7, reviews: 67, image: '🏔️', sleeps: 4 },
  { id: '4', type: 'caravan', title: 'كرفان شاطئ البحر', subtitle: 'جدة', lat: 21.5433, lng: 39.1728, price: 1100, rating: 4.6, reviews: 45, image: '🏖️', sleeps: 5 },
  { id: '5', type: 'caravan', title: 'فان تخييم جبلي', subtitle: 'الباحة', lat: 20.0, lng: 41.4686, price: 600, rating: 4.8, reviews: 56, image: '⛺', sleeps: 3 },
  { id: '6', type: 'caravan', title: 'كرفان فاخر VIP', subtitle: 'حائل', lat: 27.5114, lng: 41.7208, price: 2200, rating: 5.0, reviews: 31, image: '✨', sleeps: 8 },
  { id: '7', type: 'caravan', title: 'كرفان النجوم', subtitle: 'تبوك', lat: 28.3838, lng: 36.5550, price: 1350, rating: 4.7, reviews: 42, image: '🌟', sleeps: 4 },
  { id: '8', type: 'caravan', title: 'كرفان الشاطئ', subtitle: 'أملج', lat: 25.0452, lng: 37.2654, price: 900, rating: 4.9, reviews: 36, image: '🌊', sleeps: 6 },
  { id: '9', type: 'campsite', title: 'مخيم السودة', subtitle: 'عسير', lat: 18.26, lng: 42.38, price: 150, rating: 4.5, reviews: 200, image: '⛰️' },
  { id: '10', type: 'campsite', title: 'مخيم العلا الصحراوي', subtitle: 'العلا', lat: 26.63, lng: 37.93, price: 200, rating: 4.8, reviews: 150, image: '🏜️' },
  { id: '11', type: 'hub', title: 'نقطة استلام الرياض', subtitle: 'مركز خدمة', lat: 24.72, lng: 46.68, image: '📍' },
  { id: '12', type: 'hub', title: 'نقطة استلام جدة', subtitle: 'مركز خدمة', lat: 21.49, lng: 39.20, image: '📍' },
  { id: '13', type: 'route', title: 'مسار العلا التاريخي', subtitle: '3 أيام • 420 كم', lat: 26.60, lng: 37.90, rating: 4.9, reviews: 75, image: '🗺️', difficulty: 'MODERATE' },
  { id: '14', type: 'route', title: 'مسار جبال عسير', subtitle: '5 أيام • 680 كم', lat: 18.30, lng: 42.40, rating: 4.7, reviews: 48, image: '🛤️', difficulty: 'CHALLENGING' },
];

const filterCategories = [
  { id: 'all', label: 'الكل', icon: '🗺️' },
  { id: 'caravan', label: 'كرفانات', icon: '🚐' },
  { id: 'campsite', label: 'مخيمات', icon: '⛺' },
  { id: 'route', label: 'مسارات', icon: '🛤️' },
  { id: 'hub', label: 'نقاط استلام', icon: '📍' },
];

export default function ExploreMap() {
  const t = useTranslations('explore');
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeRegion, setActiveRegion] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite' | 'outdoors'>('outdoors');

  const styleUrls: Record<string, string> = {
    streets: 'mapbox://styles/mapbox/streets-v12',
    satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
    outdoors: 'mapbox://styles/mapbox/outdoors-v12',
  };

  // Filter locations
  const filteredLocations = mockLocations.filter((loc) => {
    if (activeFilter !== 'all' && loc.type !== activeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return loc.title.includes(q) || loc.subtitle.includes(q);
    }
    return true;
  });

  // Create custom marker element
  const createMarkerElement = useCallback((location: MapLocation) => {
    const el = document.createElement('div');
    el.className = 'karfani-marker';

    const isCaravan = location.type === 'caravan';
    const isCampsite = location.type === 'campsite';
    const isRoute = location.type === 'route';

    if (isCaravan && location.price) {
      el.innerHTML = `
        <div class="marker-bubble marker-caravan">
          <span class="marker-price">${location.price.toLocaleString()}</span>
          <span class="marker-currency">ر.س</span>
        </div>
        <div class="marker-arrow"></div>
      `;
    } else if (isCampsite) {
      el.innerHTML = `
        <div class="marker-bubble marker-campsite">
          <span class="marker-emoji">⛺</span>
        </div>
        <div class="marker-arrow marker-arrow-campsite"></div>
      `;
    } else if (isRoute) {
      el.innerHTML = `
        <div class="marker-bubble marker-route">
          <span class="marker-emoji">🗺️</span>
        </div>
        <div class="marker-arrow marker-arrow-route"></div>
      `;
    } else {
      el.innerHTML = `
        <div class="marker-bubble marker-hub">
          <span class="marker-emoji">📍</span>
        </div>
        <div class="marker-arrow marker-arrow-hub"></div>
      `;
    }

    return el;
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: styleUrls[mapStyle],
      center: [45.0, 24.0], // Saudi Arabia center
      zoom: 5.5,
      minZoom: 4,
      maxZoom: 18,
      pitch: 0,
      bearing: 0,
      attributionControl: false,
      locale: { 'NavigationControl.ZoomIn': '', 'NavigationControl.ZoomOut': '', 'NavigationControl.ResetBearing': '' },
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    map.current.on('click', () => {
      setSelectedLocation(null);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update markers when filter changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add new markers
    filteredLocations.forEach((location) => {
      const el = createMarkerElement(location);

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedLocation(location);
        map.current?.flyTo({
          center: [location.lng, location.lat],
          zoom: Math.max(map.current?.getZoom() || 0, 11),
          duration: 800,
          essential: true,
        });
      });

      const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([location.lng, location.lat])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [filteredLocations, mapLoaded, createMarkerElement]);

  // Change map style
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    const style = styleUrls[mapStyle];
    if (style) map.current.setStyle(style);
  }, [mapStyle]);

  // Fly to region
  const flyToRegion = (regionId: string) => {
    const region = regions.find((r) => r.id === regionId);
    if (!region || !map.current) return;
    setActiveRegion(regionId);
    map.current.flyTo({
      center: [region.lng, region.lat],
      zoom: region.zoom,
      duration: 1200,
      essential: true,
    });
  };

  // Locate user
  const locateUser = () => {
    if (!navigator.geolocation || !map.current) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        map.current?.flyTo({
          center: [pos.coords.longitude, pos.coords.latitude],
          zoom: 12,
          duration: 1000,
        });
      },
      () => { /* silently ignore */ },
    );
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="relative w-full h-[calc(100dvh-80px)] lg:h-dvh overflow-hidden bg-charcoal">
      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Loading State */}
      {!mapLoaded && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-cream">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-olive/10 flex items-center justify-center animate-pulse">
              <Compass className="w-8 h-8 text-olive animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <p className="text-charcoal-light font-medium">{t('loading')}</p>
          </div>
        </div>
      )}

      {/* Top Bar - Search & Filters */}
      <div className="absolute top-4 inset-x-4 z-40">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className={`bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-charcoal/15 border border-white/50 transition-all duration-300 ${
            showSearch ? 'ring-2 ring-olive/30' : ''
          }`}>
            <div className="flex items-center gap-3 px-5 py-3.5">
              <Search className="w-5 h-5 text-olive shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearch(true)}
                onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                placeholder={t('searchPlaceholder')}
                className="flex-1 bg-transparent outline-none text-charcoal placeholder:text-charcoal-light/60 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="w-7 h-7 rounded-full bg-cream flex items-center justify-center hover:bg-cream-dark transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-charcoal-light" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Region Chips - Horizontal Scroll */}
        <div className="mt-3 max-w-3xl mx-auto overflow-x-auto hide-scrollbar">
          <div className="flex items-center gap-2 px-1 pb-1">
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => flyToRegion(region.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm ${
                  activeRegion === region.id
                    ? 'bg-olive text-white shadow-olive/30'
                    : 'bg-white/90 backdrop-blur-sm text-charcoal hover:bg-white hover:shadow-md'
                }`}
              >
                {region.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Type Filter Pills - Bottom Left */}
      <div className="absolute bottom-28 start-4 z-30">
        <div className="flex flex-col gap-2">
          {filterCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg ${
                activeFilter === cat.id
                  ? 'bg-olive text-white shadow-olive/40 scale-105'
                  : 'bg-white/95 backdrop-blur-sm text-charcoal hover:bg-white hover:shadow-xl'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Map Controls - Right Side */}
      <div className="absolute end-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2">
        <button
          onClick={() => map.current?.zoomIn({ duration: 300 })}
          className="w-11 h-11 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center hover:bg-white hover:shadow-xl transition-all text-charcoal"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={() => map.current?.zoomOut({ duration: 300 })}
          className="w-11 h-11 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center hover:bg-white hover:shadow-xl transition-all text-charcoal"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <div className="w-11 h-px bg-cream-dark" />
        <button
          onClick={locateUser}
          className="w-11 h-11 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center hover:bg-white hover:shadow-xl transition-all text-olive"
        >
          <Navigation2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            const styles: Array<'streets' | 'satellite' | 'outdoors'> = ['outdoors', 'satellite', 'streets'];
            const next = styles[(styles.indexOf(mapStyle) + 1) % styles.length] ?? 'outdoors';
            setMapStyle(next);
          }}
          className="w-11 h-11 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center hover:bg-white hover:shadow-xl transition-all text-charcoal"
        >
          <Layers className="w-5 h-5" />
        </button>
        <button
          onClick={toggleFullscreen}
          className="w-11 h-11 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center hover:bg-white hover:shadow-xl transition-all text-charcoal"
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Results Count Badge */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
        <div className="bg-charcoal/90 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-xl flex items-center gap-2">
          <MapPin className="w-4 h-4 text-copper" />
          <span>{filteredLocations.length} {t('resultsOnMap')}</span>
        </div>
      </div>

      {/* Selected Location Popup */}
      {selectedLocation && (
        <MapPopupCard
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      )}
    </div>
  );
}
