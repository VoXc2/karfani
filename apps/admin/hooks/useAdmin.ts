'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminFetch } from '../lib/api';

// Store token in memory for admin session
let adminToken: string | null = null;
export function setAdminToken(token: string) {
  adminToken = token;
}
export function getAdminToken() {
  return adminToken;
}

export function useAdminOverview() {
  return useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: () =>
      adminFetch('/analytics/overview', { token: adminToken || undefined }),
  });
}

export function useAdminBookings(page = 1) {
  return useQuery({
    queryKey: ['admin', 'bookings', page],
    queryFn: () =>
      adminFetch(`/admin/bookings?page=${page}`, {
        token: adminToken || undefined,
      }),
  });
}

export function useAdminCaravans(page = 1, status?: string) {
  const params = new URLSearchParams({ page: String(page) });
  if (status) params.set('status', status);
  return useQuery({
    queryKey: ['admin', 'caravans', page, status],
    queryFn: () =>
      adminFetch(`/admin/caravans?${params}`, {
        token: adminToken || undefined,
      }),
  });
}

export function useAdminUsers(page = 1) {
  return useQuery({
    queryKey: ['admin', 'users', page],
    queryFn: () =>
      adminFetch(`/admin/users?page=${page}`, {
        token: adminToken || undefined,
      }),
  });
}

export function useAdminRevenue() {
  return useQuery({
    queryKey: ['admin', 'revenue'],
    queryFn: () =>
      adminFetch('/analytics/revenue', { token: adminToken || undefined }),
  });
}

export function useApproveCaravan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      adminFetch(`/admin/caravans/${id}/approve`, {
        method: 'PUT',
        token: adminToken || undefined,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['admin', 'caravans'] }),
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminFetch(`/admin/users/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
        token: adminToken || undefined,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
}
