import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'

export interface Endpoint {
  id: string
  method: string
  path: string
  projectId: string
  createdAt: string
}

export function useEndpoints(projectId: string) {
  return useQuery<Endpoint[]>({
    queryKey: ['endpoints', projectId],
    queryFn: () => api.get(`/projects/${projectId}/endpoints`).then((r) => r.data),
    enabled: !!projectId,
  })
}

export function useCreateEndpoint(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { method: string; path: string }) =>
      api.post(`/projects/${projectId}/endpoints`, data).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['endpoints', projectId] }),
  })
}
