import { apiClient } from '../client';
import type { Session, CreateSessionInput, UpdateSessionInput } from '../../types';

interface SessionFilters {
    sprint_id?: number;
    date?: string;
    from?: string;
    to?: string;
}

export const sessionsApi = {
    getAll: (filters?: SessionFilters) => {
        const params = new URLSearchParams();
        if (filters?.sprint_id) params.set('sprint_id', String(filters.sprint_id));
        if (filters?.date) params.set('date', filters.date);
        if (filters?.from) params.set('from', filters.from);
        if (filters?.to) params.set('to', filters.to);

        const queryString = params.toString();
        return apiClient.get<Session[]>(`/sessions${queryString ? `?${queryString}` : ''}`);
    },

    getById: (id: number) => apiClient.get<Session>(`/sessions/${id}`),

    create: (data: CreateSessionInput) => apiClient.post<Session>('/sessions', data),

    update: (id: number, data: UpdateSessionInput) => apiClient.put<Session>(`/sessions/${id}`, data),

    delete: (id: number) => apiClient.delete<void>(`/sessions/${id}`),
};
