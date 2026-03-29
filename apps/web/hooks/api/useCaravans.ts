'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

export function useCaravans(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['caravans', params],
    queryFn: () => api.getCaravans(params),
  });
}

export function useCaravan(id: string | undefined) {
  return useQuery({
    queryKey: ['caravan', id],
    queryFn: () => api.getCaravan(id!),
    enabled: !!id,
  });
}

export function useFeaturedCaravans() {
  return useQuery({
    queryKey: ['caravans', 'featured'],
    queryFn: () => api.getFeaturedCaravans(),
  });
}
