import { apiClient } from '../client';
import type { Tag } from '../../types';

export const tagsApi = {
    getAll: () => apiClient.get<Tag[]>('/tags'),

    create: (name: string) => apiClient.post<Tag>('/tags', { name }),

    delete: (id: number) => apiClient.delete<void>(`/tags/${id}`),
};
