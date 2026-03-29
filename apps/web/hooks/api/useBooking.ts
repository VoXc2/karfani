'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { useAuth } from '../useAuth';

export function useMyBookings() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['bookings', 'my'],
    queryFn: () => api.getMyBookings(token!),
    enabled: !!token,
  });
}

export function useCreateBooking() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => api.createBooking(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
