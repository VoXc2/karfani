'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

export function useMapData(query?: Record<string, string>) {
  return useQuery({
    queryKey: ['map', 'data', query],
    queryFn: () => api.getMapData(query),
  });
}

export function useLocations(query?: Record<string, string>) {
  return useQuery({
    queryKey: ['locations', query],
    queryFn: () => api.getLocations(query),
  });
}

export function useRoutes(query?: Record<string, string>) {
  return useQuery({
    queryKey: ['routes', query],
    queryFn: () => api.getRoutes(query),
  });
}
