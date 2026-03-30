'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../useAuth';

export function useOwnerCaravans() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['owner', 'caravans'],
    queryFn: () => apiFetch('/caravans/mine', { token: token || undefined }),
    enabled: !!token,
  });
}

export function useOwnerBookings() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['owner', 'bookings'],
    queryFn: () => apiFetch('/bookings/owner', { token: token || undefined }),
    enabled: !!token,
  });
}

export function useOwnerEarnings() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['owner', 'earnings'],
    queryFn: () => apiFetch('/analytics/owner', { token: token || undefined }),
    enabled: !!token,
  });
}

export function useCreateCaravan() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      apiFetch('/caravans', {
        method: 'POST',
        body: JSON.stringify(data),
        token: token || undefined,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['owner', 'caravans'] }),
  });
}
