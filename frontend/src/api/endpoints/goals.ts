import { apiClient } from '../client';
import type { Goal, CreateGoalInput, UpdateGoalInput } from '../../types';

export const goalsApi = {
    getAll: (sprintId?: number) => {
        const queryString = sprintId ? `?sprint_id=${sprintId}` : '';
        return apiClient.get<Goal[]>(`/goals${queryString}`);
    },

    create: (data: CreateGoalInput) => apiClient.post<Goal>('/goals', data),

    update: (id: number, data: UpdateGoalInput) => apiClient.put<Goal>(`/goals/${id}`, data),

    delete: (id: number) => apiClient.delete<void>(`/goals/${id}`),
};
