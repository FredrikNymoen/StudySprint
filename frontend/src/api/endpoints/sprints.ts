import { apiClient } from '../client';
import type { Sprint, CreateSprintInput, UpdateSprintInput } from '../../types';

export const sprintsApi = {
    getAll: () => apiClient.get<Sprint[]>('/sprints'),

    getById: (id: number) => apiClient.get<Sprint>(`/sprints/${id}`),

    create: (data: CreateSprintInput) => apiClient.post<Sprint>('/sprints', data),

    update: (id: number, data: UpdateSprintInput) => apiClient.put<Sprint>(`/sprints/${id}`, data),

    delete: (id: number) => apiClient.delete<void>(`/sprints/${id}`),
};
